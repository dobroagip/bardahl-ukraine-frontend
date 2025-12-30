
import { Review } from '../types';
import { supabase } from './supabase';

const MOCK_REVIEWS: Review[] = [
  { id: 'rev-1', productId: '36163', userName: 'Александр', rating: 5, date: '2024-03-10', comment: 'Лучшее масло для BMW.', pros: 'Качество', cons: 'Цена' }
];

export const reviewService = {
  async getAll(): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        if (error.code === 'PGRST204' || error.code === 'PGRST205') return MOCK_REVIEWS;
        throw error;
      }
      return data && data.length > 0 ? data : MOCK_REVIEWS;
    } catch (e) {
      return MOCK_REVIEWS;
    }
  },

  async getReviews(productId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('productId', productId)
        .order('date', { ascending: false });
      
      if (error) return MOCK_REVIEWS.filter(r => r.productId === productId);
      return data && data.length > 0 ? data : MOCK_REVIEWS.filter(r => r.productId === productId);
    } catch (e) {
      return MOCK_REVIEWS.filter(r => r.productId === productId);
    }
  },

  /**
   * Добавление отзыва (базовый метод для клиентов)
   */
  async addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        ...review,
        date: new Date().toISOString().split('T')[0]
      }])
      .select().single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Админ-метод для создания или обновления отзыва с ручной датой
   */
  async adminUpsertReview(review: Partial<Review>): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .upsert({
        ...review,
        id: review.id || `rev-${Date.now()}`,
        date: review.date || new Date().toISOString().split('T')[0]
      });
    
    if (error) throw new Error(error.message);
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },

  async getStats(productId: string) {
    const reviews = await this.getReviews(productId);
    if (reviews.length === 0) return { count: 0, average: 5.0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return { count: reviews.length, average: parseFloat((sum / reviews.length).toFixed(1)) };
  }
};
