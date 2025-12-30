
import { AbandonedCart, CartItem, User } from '../types';
import { supabase } from './supabase';
import { notificationService } from './notificationService';

export const cartService = {
  async syncCart(email: string, items: CartItem[], user?: User | null): Promise<void> {
    if (!email || items.length === 0) return;
    try {
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const cartData: Partial<AbandonedCart> = {
        email,
        items,
        total,
        lastUpdated: new Date().toISOString(),
        status: 'active',
        customerName: user ? `${user.firstName} ${user.lastName || ''}` : undefined,
        phone: user?.phone
      };

      const { error } = await supabase
        .from('carts')
        .upsert(cartData, { onConflict: 'email' });

      if (error) {
        if (error.code === 'PGRST204' || error.code === 'PGRST205') {
            console.warn("Table 'carts' not found. Skip sync.");
        } else {
            console.error("Sync Cart Error:", error.message);
        }
      }
    } catch (e) {}
  },

  async triggerAbandonment(email: string, items: CartItem[], customerName?: string, phone?: string): Promise<void> {
    if (!email || items.length === 0) return;
    try {
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const cart: AbandonedCart = {
          id: `cart-${Date.now()}`,
          email,
          items,
          total,
          lastUpdated: new Date().toISOString(),
          status: 'abandoned',
          customerName,
          phone
        };

        await supabase.from('carts').update({ status: 'abandoned' }).eq('email', email);
        notificationService.sendAbandonedCartAdminAlert(cart).catch(console.error);
        notificationService.sendAbandonedCartEmail(cart).catch(console.error);
    } catch (e) {}
  },

  async getAbandonedCarts(): Promise<AbandonedCart[]> {
    try {
        const { data, error } = await supabase
          .from('carts')
          .select('*')
          .eq('status', 'abandoned')
          .order('lastUpdated', { ascending: false });

        if (error) {
            console.warn("Abandoned carts table check:", error.message);
            return [];
        }
        return data || [];
    } catch (e) {
        return [];
    }
  },

  async markAsConverted(email: string): Promise<void> {
    try {
        await supabase.from('carts').update({ status: 'converted' }).eq('email', email);
    } catch (e) {}
  }
};
