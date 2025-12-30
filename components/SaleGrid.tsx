
import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from './ProductCard';
import { Percent, ArrowRight } from 'lucide-react';

interface SaleGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
  onOneClickBuy: (p: Product) => void;
}

const SaleGrid: React.FC<SaleGridProps> = ({ products, onAddToCart, onProductClick, onOneClickBuy }) => {
  const { t } = useLanguage();
  const saleItems = products.filter(p => p.badge === 'sale').slice(0, 4);

  if (saleItems.length === 0) return null;

  return (
    <section className="py-12 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
           <div>
              <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                 <Percent size={14} strokeWidth={3} /> Best deals this week
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                 {t('promo_blocks.sale_title')}
              </h2>
              <p className="text-zinc-500 mt-3 font-medium">{t('promo_blocks.sale_subtitle')}</p>
           </div>
           <button className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px]">
              Смотреть все акции <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
           {saleItems.map(product => (
             <div key={product.id} className="relative group">
                {/* Custom discount tag for grid */}
                <div className="absolute -top-2 -right-2 z-20 bg-red-600 text-white font-black px-3 py-1 rounded-lg text-xs shadow-xl rotate-6 group-hover:scale-110 transition-transform">
                   SALE
                </div>
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onClick={() => onProductClick(product)} 
                  onOneClickBuy={onOneClickBuy}
                />
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default SaleGrid;
