
import { CustomerRequest } from '../types';
import { supabase } from './supabase';
import { notificationService } from './notificationService';

const REQUESTS_LOCAL_KEY = 'bardahl_customer_requests';

export const requestService = {
  async getAll(): Promise<CustomerRequest[]> {
    try {
      const { data, error } = await supabase
        .from('customer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
          if (error.code === 'PGRST205') return JSON.parse(localStorage.getItem(REQUESTS_LOCAL_KEY) || '[]');
          throw error;
      }
      return data || [];
    } catch (e) {
      return JSON.parse(localStorage.getItem(REQUESTS_LOCAL_KEY) || '[]');
    }
  },

  async create(req: Omit<CustomerRequest, 'id' | 'date' | 'status'>): Promise<void> {
    if (req.honeypot && req.honeypot.trim() !== '') return;

    const newRequest = {
        ...req,
        id: `req-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'new'
    };

    const local = JSON.parse(localStorage.getItem(REQUESTS_LOCAL_KEY) || '[]');
    localStorage.setItem(REQUESTS_LOCAL_KEY, JSON.stringify([newRequest, ...local]));

    try {
        const { error } = await supabase
          .from('customer_requests')
          .insert([{
            type: req.type,
            contact: req.contact,
            details: req.details,
            status: 'new',
            created_at: new Date().toISOString()
          }]);
        
        if (!error) {
            notificationService.sendRequestNotification(req).catch(console.error);
        }
    } catch (e) {}
  },

  async markAsProcessed(id: string): Promise<void> {
    const local = JSON.parse(localStorage.getItem(REQUESTS_LOCAL_KEY) || '[]');
    const idx = local.findIndex((r: any) => r.id === id);
    if (idx !== -1) {
        local[idx].status = 'processed';
        localStorage.setItem(REQUESTS_LOCAL_KEY, JSON.stringify(local));
    }

    try {
        await supabase.from('customer_requests').update({ status: 'processed' }).eq('id', id);
    } catch (e) {}
  }
};
