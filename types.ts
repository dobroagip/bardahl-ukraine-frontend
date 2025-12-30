
export type ViewType = 'shop' | 'checkout' | 'cabinet' | 'blog' | 'warranty' | 'delivery' | 'contacts' | 'wholesale' | 'sitemap' | '404' | 'admin' | 'promotions' | 'thank-you' | 'about-us';

export type Language = 'ru' | 'uk';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
}

export interface ProductVariant {
  volume: string;
  price: number;
  sku: string;
}

export interface ProductLocale {
  name: string;
  description: string;
  specifications: Record<string, string>;
  seo: SeoConfig;
}

export interface MasterProduct {
  id: string;
  sku: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  image: string;
  category: string;
  volume: string;
  viscosity?: string;
  tags?: string[];
  badge?: 'new' | 'bestseller' | 'sale';
  variants?: ProductVariant[];
  locales: {
    ru: ProductLocale;
    uk: ProductLocale;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number; 
  category: string; 
  viscosity?: string; 
  volume: string; 
  image: string;
  description: string;
  badge?: 'new' | 'bestseller' | 'sale';
  sku?: string;
  inStock?: boolean;
  specifications?: Record<string, string>; 
  seo?: SeoConfig;
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AbandonedCart {
  id: string;
  email: string;
  items: CartItem[];
  total: number;
  lastUpdated: string;
  status: 'active' | 'abandoned' | 'converted';
  customerName?: string;
  phone?: string;
}

export interface FilterState {
  categories: string[];
  viscosities: string[];
  volumes: string[];
  approvals: string[]; 
  priceRange: { min: number; max: number };
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  deliveryMethod: 'nova_poshta_dept' | 'courier' | 'pickup';
  paymentMethod: 'card_online' | 'cod' | 'iban';
  comment: string;
  honeypot?: string;
}

export interface Car {
  id: string;
  brand: string; 
  model: string; 
  year: string; 
  fuel: string;
  vin?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  cars?: Car[];
  defaultShipping?: {
    city: string;
    deliveryMethod: 'nova_poshta_dept' | 'courier' | 'pickup';
    addressOrDept: string;
  };
  createdAt: string;
  isGoogleAuth?: boolean;
  role: 'user' | 'admin'; 
}

export interface Order {
  id: string;
  userId?: string; 
  date: string;
  items: CartItem[];
  total: number;
  customer: CustomerDetails;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export interface CustomerRequest {
  id: string;
  date: string;
  type: 'vin_check' | 'wholesale' | 'contact';
  status: 'new' | 'processed';
  contact: {
    name?: string;
    phone: string;
    email?: string;
  };
  details: any;
  honeypot?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  bgGradient: string;
}

export interface MasterPromotion {
  id: string;
  image: string;
  discount: string;
  bgGradient: string;
  isActive: boolean;
  locales: {
    ru: {
      title: string;
      description: string;
    };
    uk: {
      title: string;
      description: string;
    };
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  isHeader: boolean;
  seo?: SeoConfig; 
  masterSeo?: {     
    ru: SeoConfig;
    uk: SeoConfig;
  };
}

export interface BlogPost {
  id: string;
  date: string;
  image: string;
  title: string;
  preview: string;
  readMore: string;
  seo?: SeoConfig;
}

export interface BlogLocale {
  title: string;
  preview: string;
  readMore: string;
  seo?: SeoConfig;
}

export interface MasterBlogPost {
  id: string;
  date: string;
  image: string;
  locales: {
    ru: BlogLocale;
    uk: BlogLocale;
  };
}

// Added Review interface for product reviews
export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  pros?: string;
  cons?: string;
}

// Added ExternalProduct interface for external AI search recommendations
export interface ExternalProduct {
  name: string;
  viscosity: string;
  reason: string;
}
