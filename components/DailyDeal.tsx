
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Zap, Timer, ShoppingCart, ArrowRight } from 'lucide-react';

interface DailyDealProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  onProductClick: (p: Product) => void;
}

const DailyDeal: React.FC<DailyDealProps> = ({ products, onAddToCart, onProductClick }) => {
  const { t, language } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const gridCols = products.length === 1 ? 'grid-cols-1' : products.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-10 bg-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
           <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full">
              <Zap size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-yellow-500 font-black text-[11px] uppercase tracking-[0.2em]">{t('promo_blocks.daily_title')}</span>
           </div>
           <div className="h-px flex-1 bg-zinc-800"></div>
           <div className="hidden md:flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              <Timer size={14} className="text-yellow-500" />
              {t('promo_blocks.timer_end')}
              <span className="text-white font-mono text-sm tracking-normal ml-2">
                {timeLeft.h.toString().padStart(2, '0')}:{timeLeft.m.toString().padStart(2, '0')}:{timeLeft.s.toString().padStart(2, '0')}
              </span>
           </div>
        </div>

        <div className={`grid ${gridCols} gap-6`}>
          {products.map((product) => {
            const discountPercent = product.oldPrice 
              ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
              : 0;

            return (
              <div 
                key={product.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative group flex flex-col h-full"
              >
                {/* Image Area */}
                <div 
                  className="bg-white p-10 flex items-center justify-center relative cursor-pointer overflow-hidden aspect-video lg:aspect-auto lg:h-64"
                  onClick={() => onProductClick(product)}
                >
                  <div className="absolute top-6 left-6 bg-red-600 text-white font-black px-3 py-1 rounded-lg text-sm shadow-xl z-20">
                    -{discountPercent}%
                  </div>
                  <img 
                    src={product.image} 
                    className="max-h-44 md:max-h-52 object-contain transition-transform duration-700 group-hover:scale-110" 
                    alt={product.name} 
                  />
                  <div className="absolute bottom-0 right-0 bg-black text-yellow-500 px-4 py-2 font-black text-[9px] italic tracking-tighter rounded-tl-2xl border-t border-l border-zinc-800">
                    LIMITED DEAL
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                  <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter leading-tight mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2 min-h-[3em]">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-zinc-800">
                       <div className="text-right">
                         <div className="text-zinc-600 line-through text-[10px] font-bold">{product.oldPrice} ₴</div>
                         <div className="text-xl font-black text-white leading-none">{product.price} <span className="text-xs font-bold text-zinc-500 uppercase">₴</span></div>
                       </div>
                       <div className="w-px h-6 bg-zinc-800"></div>
                       <div className="text-center">
                         <div className="text-zinc-600 text-[8px] font-black uppercase mb-1">{t('promo_blocks.save')}</div>
                         <div className="text-green-500 font-black text-xs">{(product.oldPrice || 0) - product.price} ₴</div>
                       </div>
                    </div>
                    
                    {/* Mobile Only Mini-Timer */}
                    <div className="md:hidden flex flex-col items-end">
                       <span className="text-[8px] text-zinc-500 uppercase font-black mb-1">Ends In:</span>
                       <span className="text-sm font-black text-yellow-500 font-mono">
                         {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
                       </span>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3">
                    <button 
                      onClick={() => onAddToCart(product)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black h-12 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-xl shadow-yellow-500/10 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} strokeWidth={3} /> {t('promo_blocks.buy_now')}
                    </button>
                    <button 
                      onClick={() => onProductClick(product)}
                      className="px-4 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white h-12 rounded-xl transition-all flex items-center justify-center"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DailyDeal;
