import React from 'react';
import { ArrowRight, Timer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PromotionsProps {
  onNavigate?: () => void;
}

const Promotions: React.FC<PromotionsProps> = ({ onNavigate }) => {
  const { t, promotions } = useLanguage();

  // Show only first 2 items on homepage
  const displayedPromos = promotions.slice(0, 2);

  if (displayedPromos.length === 0) return null;

  return (
    <section id="promotions" className="py-8 bg-black border-b border-zinc-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{t('promo.title')}</h2>
            <p className="text-zinc-500 text-xs md:text-sm">{t('promo.subtitle')}</p>
          </div>
          <button 
            onClick={onNavigate}
            className="text-zinc-400 hover:text-yellow-500 text-xs font-bold flex items-center gap-1 transition-all"
          >
            {t('promo.all')} <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedPromos.map((promo) => (
            <div 
              key={promo.id} 
              className="relative group overflow-hidden rounded-xl h-48 md:h-60 border border-zinc-800 hover:border-yellow-500/50 transition-all cursor-pointer shadow-sm hover:shadow-yellow-500/5"
            >
              {/* Image Bg */}
              <div className="absolute inset-0">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${promo.bgGradient} opacity-90`} />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-start z-10">
                {promo.discount && (
                  <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded mb-3 uppercase tracking-widest animate-pulse shadow-sm">
                    {promo.discount}
                  </span>
                )}
                <h3 className="text-xl md:text-3xl font-black text-white mb-2 italic leading-none max-w-sm">
                  {promo.title}
                </h3>
                <p className="text-zinc-400 mb-4 max-w-xs text-xs md:text-sm line-clamp-2 leading-relaxed">
                  {promo.description}
                </p>
                <button className="flex items-center gap-2 text-white text-xs font-bold border-b border-yellow-500 pb-0.5 hover:text-yellow-400 transition-colors">
                   {t('promo.details')}
                </button>
              </div>

              {/* Timer Badge (Mock) */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white flex items-center gap-1.5 border border-white/10">
                <Timer size={10} className="text-yellow-500" /> 
                <span>3 дня</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promotions;