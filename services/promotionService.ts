
import { MasterPromotion, Promotion, Language } from '../types';
import { supabase } from './supabase';

export const promotionService = {
  async getAllMaster(): Promise<MasterPromotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async getAll(lang: Language): Promise<Promotion[]> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true);

    if (error || !data) return [];

    return data.map(m => {
        const locale = m.locales[lang] || m.locales.ru;
        return {
          id: m.id,
          image: m.image,
          discount: m.discount,
          bgGradient: m.bg_gradient,
          title: locale.title,
          description: locale.description
        };
      });
  }
};
