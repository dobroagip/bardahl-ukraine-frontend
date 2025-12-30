
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { reviewService } from '../services/reviewService';
import LazyImage from './LazyImage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: (product: Product) => void;
  onOneClickBuy?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick, onOneClickBuy }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<{ count: number; average: number }>({ count: 0, average: 0 });
  const isInStock = product.inStock !== false;

  useEffect(() => {
    let isMounted = true;
    reviewService.getStats(product.id).then(s => {
      if (isMounted) setStats(s);
    });
    return () => { isMounted = false; };
  }, [product.id]);

  const discountPercent = product.oldPrice && product.oldPrice > product.price 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  const getBadgeText = (badge: string) => {
      switch(badge) {
          case 'bestseller': return t('product.bestseller');
          case 'new': return t('product.new');
          case 'sale': return t('product.sale');
          default: return badge;
      }
  };

  return (
    <div className={`group relative bg-[#111111] border border-zinc-800/60 rounded-2xl overflow-hidden hover:border-yellow-500/40 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500 flex flex-col h-full ${!isInStock ? 'opacity-75' : ''}`}>
      {/* Badge Overlay */}
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className={`
            px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded shadow-2xl
            ${product.badge === 'new' ? 'bg-blue-600 text-white' : ''}
            ${product.badge === 'sale' ? 'bg-red-600 text-white animate-pulse' : ''}
            ${product.badge === 'bestseller' ? 'bg-yellow-500 text-black' : ''}
          `}>
            {getBadgeText(product.badge)}
          </span>
          {discountPercent > 0 && product.badge === 'sale' && (
              <span className="bg-white text-black px-2 py-1 text-[10px] font-black rounded w-fit shadow-lg">
                -{discountPercent}%
              </span>
          )}
        </div>
      )}

      {/* Image Section */}
      <div 
        onClick={() => onClick && onClick(product)}
        className="cursor-pointer group/img relative"
      >
         <LazyImage 
           src={product.image} 
           alt={product.name} 
           containerClassName="aspect-square bg-white p-8"
           className={`w-full h-full object-contain ${!isInStock ? 'grayscale' : ''} group-hover/img:scale-110`}
         />

         {!isInStock && (
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
             <span className="bg-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl">
               {t('product.out_of_stock')}
             </span>
           </div>
         )}
      </div>

      {/* Info Section */}
      <div className="p-5 xl:p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.15em] truncate mr-2">
              {product.category} • {product.volume}
            </span>
            <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-wider ${isInStock ? 'text-green-500' : 'text-zinc-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isInStock ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
              {isInStock ? t('product.in_stock') : t('product.out_of_stock')}
            </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
            <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star} 
                        size={11} 
                        fill={star <= Math.round(stats.average || 5) ? "currentColor" : "none"} 
                        className={star > Math.round(stats.average || 5) ? "text-zinc-800" : ""}
                    />
                ))}
            </div>
            <span className="text-[11px] font-black text-zinc-500">{stats.average > 0 ? stats.average : '5.0'}</span>
        </div>
        
        <h3 
          onClick={() => onClick && onClick(product)}
          className="text-white font-bold text-base xl:text-[18px] leading-[1.3] mb-6 group-hover:text-yellow-500 transition-colors cursor-pointer line-clamp-2 min-h-[2.6em] tracking-tight"
        >
          {product.name}
        </h3>
        
        <div className="mt-auto pt-5 border-t border-zinc-800/50 flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-1.5">{t('common.price')}</span>
            <div className="flex flex-col">
                {product.oldPrice && (
                    <span className="text-[11px] text-zinc-600 line-through font-bold mb-1">
                      {product.oldPrice} ₴
                    </span>
                )}
                <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-black leading-none tracking-tighter ${product.oldPrice ? 'text-yellow-500' : 'text-white'}`}>
                      {product.price}
                    </span>
                    <span className="text-[11px] font-bold text-zinc-600 uppercase">{t('common.uah')}</span>
                </div>
            </div>
          </div>

          <div className="flex gap-2.5 items-center">
             {onOneClickBuy && (
                <button
                    disabled={!isInStock}
                    onClick={(e) => {
                        e.stopPropagation();
                        onOneClickBuy(product);
                    }}
                    className="flex items-center justify-center w-12 h-12 border border-zinc-800 hover:border-zinc-600 text-zinc-500 hover:text-yellow-500 rounded-xl transition-all active:scale-90 bg-zinc-900/50 group/fast"
                    title={t('product.one_click')}
                >
                    <Zap size={18} fill="currentColor" className="opacity-80 group-hover/fast:scale-110 transition-transform" />
                </button>
             )}
             <button 
                disabled={!isInStock}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className={`h-12 px-5 xl:px-7 rounded-xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2.5 group/btn ${
                  isInStock 
                  ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/10' 
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
            >
                <ShoppingCart size={19} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-wider">{isInStock ? t('product.buy') : t('product.out_of_stock')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
