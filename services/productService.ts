
import { Product, MasterProduct, Language, FilterState } from '../types';
import { supabase } from './supabase';

export const productService = {
  validateProduct(p: Partial<MasterProduct>): string[] {
    const errors: string[] = [];
    if (!p.sku || String(p.sku).trim().length < 2) errors.push("Отсутствует или слишком короткий SKU");
    if (p.price === undefined || isNaN(Number(p.price))) errors.push("Некорректная цена");
    if (!p.locales || !p.locales.ru || !p.locales.ru.name) errors.push("Отсутствует название (RU)");
    return errors;
  },

  mapDbToMaster(dbItem: any): MasterProduct {
    return {
      id: dbItem.id,
      sku: dbItem.sku || '',
      price: Number(dbItem.price) || 0,
      oldPrice: dbItem.old_price ? Number(dbItem.old_price) : undefined,
      inStock: dbItem.in_stock ?? true,
      image: dbItem.image || 'https://bardahl.com.ua/wp-content/uploads/2016/11/36163-5.png',
      category: dbItem.category_id || dbItem.category || 'motor-oil',
      volume: dbItem.volume || '1L',
      viscosity: dbItem.viscosity || '',
      tags: Array.isArray(dbItem.tags) ? dbItem.tags : [],
      badge: dbItem.badge,
      variants: dbItem.variants || [],
      locales: dbItem.locales || { 
        ru: { name: 'Untitled', description: '', specifications: {}, seo: {} },
        uk: { name: 'Untitled', description: '', specifications: {}, seo: {} }
      }
    };
  },

  mapMasterToDb(m: Partial<MasterProduct>) {
    const dbObj: any = {
      sku: String(m.sku || '').trim(),
      price: m.price ? Number(m.price) : 0,
      old_price: m.oldPrice ? Number(m.oldPrice) : null,
      in_stock: m.inStock ?? true,
      image: m.image,
      category_id: m.category || 'motor-oil', 
      volume: m.volume || '1L',
      viscosity: m.viscosity || '',
      tags: m.tags || [],
      badge: m.badge || null,
      variants: m.variants || [],
      locales: m.locales
    };

    if (m.id && m.id.length > 10) {
      dbObj.id = m.id;
    }

    Object.keys(dbObj).forEach(key => dbObj[key] === undefined && delete dbObj[key]);
    return dbObj;
  },

  async getAllMaster(): Promise<MasterProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Ошибка загрузки: ${error.message}`);
    }
    return (data || []).map(this.mapDbToMaster);
  },

  async getAll(lang: Language = 'ru'): Promise<Product[]> {
    const masters = await this.getAllMaster();
    return this.mapMasterToUI(masters, lang);
  },

  mapMasterToUI(masters: MasterProduct[], lang: Language): Product[] {
    return masters.map(m => {
      const locale = m.locales[lang] || m.locales.ru || { name: 'Untitled', description: '', specifications: {}, seo: {} };
      return {
        id: m.id,
        sku: m.sku,
        price: m.price,
        oldPrice: m.oldPrice,
        category: m.category,
        image: m.image,
        viscosity: m.viscosity,
        volume: m.volume,
        badge: m.badge,
        inStock: m.inStock,
        variants: m.variants,
        name: locale.name,
        description: locale.description,
        specifications: locale.specifications,
        seo: locale.seo
      };
    });
  },

  async getFiltered(
    lang: Language, 
    filters: FilterState, 
    searchQuery: string, 
    sortBy: string,
    page: number = 1,
    pageSize: number = 12
  ): Promise<{ products: Product[], total: number }> {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (filters.categories.length > 0 && !filters.categories.includes('all')) {
      query = query.in('category_id', filters.categories);
    }
    
    if (filters.viscosities.length > 0) query = query.in('viscosity', filters.viscosities);
    if (filters.volumes.length > 0) query = query.in('volume', filters.volumes);
    if (filters.priceRange.min > 0) query = query.gte('price', filters.priceRange.min);
    if (filters.priceRange.max < 20000) query = query.lte('price', filters.priceRange.max);

    if (searchQuery) {
        query = query.or(`sku.ilike.%${searchQuery}%,locales->ru->>name.ilike.%${searchQuery}%`);
    }

    if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
    else if (sortBy === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('created_at', { ascending: false });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    const products = this.mapMasterToUI((data || []).map(this.mapDbToMaster), lang);
    return { products, total: count || 0 };
  },

  async upsertProducts(products: Partial<MasterProduct>[]): Promise<void> {
    const dbRows = products.map(p => this.mapMasterToDb(p));
    
    const chunkSize = 50;
    for (let i = 0; i < dbRows.length; i += chunkSize) {
      const chunk = dbRows.slice(i, i + chunkSize);
      const { error } = await supabase
        .from('products')
        .upsert(chunk, { onConflict: 'sku' });

      if (error) {
          throw new Error(`Ошибка базы (блок ${i + 1}): ${error.message}`);
      }
    }
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
};
