import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Breadcrumbs from './Breadcrumbs';
import { Timer, ArrowLeft } from 'lucide-react';
import SeoHead from './SeoHead';

interface AllPromotionsProps {
  onBack: () => void;
}

const AllPromotions: React.FC<AllPromotionsProps> = ({ onBack }) => {
  const { t, promotions } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 animate-in fade-in">
      <SeoHead title={t('promo.title')} description={t('promo.subtitle')} />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[
            { label: 'Bardahl', onClick: onBack },
            { label: t('promo.title'), isActive: true }
        ]} />

        <div className="flex items-center gap-4 mb-8">
            <button onClick={onBack} className="md:hidden text-zinc-400 hover:text-white">
                <ArrowLeft />
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase border-l-4 border-yellow-500 pl-4">
                {t('promo.title')}
            </h1>
        </div>

        <p className="text-zinc-400 mb-10 max-w-2xl text-lg">
            {t('promo.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div 
              key={promo.id} 
              className="relative group overflow-hidden rounded-2xl h-80 border border-zinc-800 hover:border-yellow-500/50 transition-all cursor-pointer shadow-lg hover:shadow-yellow-500/10"
            >
              {/* Image Bg */}
              <div className="absolute inset-0">
                <img 
                  src={promo.image} 
                  alt={promo.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${promo.bgGradient} opacity-90`} />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-center items-start z-10">
                {promo.discount && (
                  <span className="bg-yellow-500 text-black text-xs font-black px-2 py-1 rounded mb-4 uppercase tracking-widest animate-pulse shadow-lg">
                    {promo.discount}
                  </span>
                )}
                <h3 className="text-2xl font-black text-white mb-4 italic leading-none">
                  {promo.title}
                </h3>
                <p className="text-zinc-300 mb-6 text-sm leading-relaxed line-clamp-3">
                  {promo.description}
                </p>
                <button className="flex items-center gap-2 text-white font-bold border-b-2 border-yellow-500 pb-1 hover:text-yellow-400 transition-colors mt-auto">
                   {t('promo.details')}
                </button>
              </div>

              {/* Timer Badge */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white flex items-center gap-2 border border-white/10">
                <Timer size={12} className="text-yellow-500" /> 
                <span>Limited Offer</span>
              </div>
            </div>
          ))}
        </div>

        {promotions.length === 0 && (
            <div className="text-center py-20 text-zinc-500">
                <p className="text-xl">На данный момент активных акций нет.</p>
                <button onClick={onBack} className="mt-4 text-yellow-500 underline">Вернуться в магазин</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AllPromotions;