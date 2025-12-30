
import { Order } from '../types';
import { supabase } from './supabase';
import { notificationService } from './notificationService';

export const ORDERS_STORAGE_KEY = 'bardahl_orders';

export const orderService = {
  async getAll(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST204' || error.code === 'PGRST205') {
            console.warn("Table 'orders' missing in Supabase. Using LocalStorage fallback.");
            return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
        }
        throw new Error(error.message);
      }
      return (data || []).map(this.mapDbToOrder);
    } catch (e) {
      return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    }
  },

  async getByUser(userId: string): Promise<Order[]> {
    try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []).map(this.mapDbToOrder);
    } catch (e) {
        const local = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
        return local.filter((o: Order) => o.userId === userId);
    }
  },

  async create(order: Order): Promise<Order> {
    if (order.customer.honeypot && order.customer.honeypot.trim() !== '') {
        return order;
    }

    // Сохраняем в локалку ВСЕГДА для надежности
    const local = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...local]));

    let finalUserId = order.userId;
    if (!finalUserId) {
        const { data: { session } } = await supabase.auth.getSession();
        finalUserId = session?.user?.id;
    }

    try {
        const { data, error } = await supabase
          .from('orders')
          .insert([{
            id: order.id,
            user_id: finalUserId || null,
            items: order.items,
            total: order.total,
            customer: order.customer,
            status: order.status,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
            console.error("Supabase order save failed, but saved to LocalStorage.");
        } else {
            notificationService.sendOrderNotification(order).catch(console.error);
            return this.mapDbToOrder(data);
        }
    } catch (e) {}

    return order;
  },

  async updateStatus(orderId: string, status: Order['status']): Promise<void> {
    const local = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    const idx = local.findIndex((o: any) => o.id === orderId);
    if (idx !== -1) {
        local[idx].status = status;
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(local));
    }

    try {
        await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (e) {}
  },

  async delete(orderId: string): Promise<void> {
    const local = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(local.filter((o: any) => o.id !== orderId)));

    try {
        await supabase.from('orders').delete().eq('id', orderId);
    } catch (e) {}
  },

  mapDbToOrder(d: any): Order {
      return {
          id: d.id,
          userId: d.user_id,
          date: d.created_at,
          items: d.items,
          total: Number(d.total) || 0,
          customer: d.customer,
          status: d.status
      };
  }
};
