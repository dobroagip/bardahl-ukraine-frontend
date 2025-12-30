
import React from 'react';
import { Category } from '../types';
import { ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CategoryHeaderProps {
  category: Category;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category }) => {
  const { language } = useLanguage();

  const seoSubtitle = language === 'ru' 
    ? `Оригинальная продукция Bardahl с технологиями Polar Plus и Fullerene C60`
    : `Оригінальна продукція Bardahl з технологіями Polar Plus та Fullerene C60`;

  const benefitsTitle = language === 'ru' ? 'Ключевые преимущества:' : 'Ключові переваги:';

  return (
    <div className="relative min-h-[160px] md:min-h-[240px] flex items-center overflow-hidden border-b border-zinc-900 bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover animate-zoom-slow opacity-40 grayscale-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-4 pb-4">
        <div className="max-w-5xl animate-in fade-in slide-in-from-left-6 duration-1000">
          
          <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-[0.3em] text-[7px] md:text-[9px] mb-2 md:mb-3">
            <span className="opacity-70">Official Bardahl</span>
            <ArrowRight size={8} className="opacity-50" />
            <span className="opacity-100">Premium Catalog</span>
          </div>
          
          {/* Main Category Heading (H1 for SEO) */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-3 italic transform -skew-x-12 leading-[1] md:leading-[0.9] uppercase tracking-tighter drop-shadow-2xl">
            {category.name}
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
              <div className="flex-1">
                  <h2 className="text-[10px] md:text-sm text-yellow-500 font-bold uppercase tracking-widest mb-3 max-w-3xl border-l-2 border-yellow-500 pl-3 py-0.5">
                    {seoSubtitle}
                  </h2>
                  <p className="hidden md:block text-xs md:text-sm text-zinc-400 leading-relaxed max-w-xl font-medium opacity-80">
                    {category.description}
                  </p>
              </div>
              
              <div className="hidden lg:flex flex-col gap-2 bg-zinc-900/60 backdrop-blur-xl border border-white/5 p-4 rounded-2xl flex-shrink-0 shadow-2xl">
                  <h3 className="text-[9px] font-black text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                     <Sparkles size={12} className="text-yellow-500" />
                     {benefitsTitle}
                  </h3>
                  <ul className="space-y-1">
                      {[
                        { text: '100% Original Belgium', icon: <ShieldCheck size={10} className="text-green-500" /> },
                        { text: 'Fullerene C60 Protection', icon: <Zap size={10} className="text-yellow-500" /> },
                        { text: 'Factory OEM Approvals', icon: <CheckCircle2 size={10} className="text-blue-500" /> }
                      ].map((b, i) => (
                          <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-zinc-300">
                              {b.icon} {b.text}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-yellow-500/50 via-zinc-800 to-transparent"></div>
    </div>
  );
};

const CheckCircle2 = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default CategoryHeader;
