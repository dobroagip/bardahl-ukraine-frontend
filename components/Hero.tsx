
import React, { useState } from 'react';
import { Search, Droplets, ArrowRight, ShieldCheck, Star, FlaskConical, ChevronDown, Users, Zap, MousePointer2, ChevronDown as Chevron } from 'lucide-react';
import { VISCOSITIES, APPROVALS, ADDITIVE_CATEGORIES, ADDITIVE_SUBTYPES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { FilterState } from '../types';

interface HeroProps {
  onFilter: (criteria: Partial<FilterState> & { type: string }) => void;
  onCarSelect: (carDetails: { brand: string; model: string; year: string; fuel: string }) => void;
  isAnalyzing?: boolean;
}

const Hero: React.FC<HeroProps> = ({ onFilter }) => {
  const { t, language } = useLanguage();
  
  const [selectedType, setSelectedType] = useState('motor-oil');
  const [selectedViscosity, setSelectedViscosity] = useState('');
  const [selectedApproval, setSelectedApproval] = useState('');
  const [selectedAdditiveSub, setSelectedAdditiveSub] = useState('');

  const h1Text = language === 'ru' 
    ? "Официальный дилер Bardahl в Украине" 
    : "Офіційний дилер Bardahl в Україні";

  const scrollText = language === 'ru' ? 'Перейти в магазин' : 'Перейти до магазину';

  const scrollToShop = () => {
    const shopSection = document.getElementById('shop-section');
    if (shopSection) {
      window.scrollTo({
        top: shopSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleParamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const criteria: Partial<FilterState> & { type: string } = { 
      type: selectedType,
      viscosities: selectedViscosity ? [selectedViscosity] : [],
      approvals: selectedApproval ? [selectedApproval] : (selectedAdditiveSub ? [selectedAdditiveSub] : [])
    };

    onFilter(criteria);
    
    setTimeout(() => {
        const resultsElement = document.getElementById('shop-section');
        if (resultsElement) {
            const headerOffset = 100;
            const elementPosition = resultsElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, 150);
  };

  return (
    <section className="relative w-full min-h-[420px] lg:h-[calc(100vh-120px)] flex flex-col justify-center overflow-hidden bg-black z-10" id="selector">
      
      {/* Background - LCP optimized */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
           <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop" 
            alt="Performance Engine" 
            className="w-full h-full object-cover opacity-20 md:opacity-30 scale-105"
            fetchpriority="high"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 md:via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center py-8 md:py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 animate-fade-in flex flex-col justify-center text-center lg:text-left">
              {/* SEO H1 Hidden but accessible or visible as part of branding */}
              <h1 className="sr-only">{h1Text}</h1>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/5 border border-yellow-500/20 mb-4 lg:mb-6 w-fit mx-auto lg:mx-0 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                 <Zap size={10} className="text-yellow-500 fill-yellow-500" />
                 <span className="text-yellow-500 font-black text-[8px] md:text-[9px] uppercase tracking-[0.3em]">
                   {t('hero.trust')}
                 </span>
              </div>
              
              <div className="space-y-4 lg:space-y-6 mb-6 lg:mb-8">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter italic uppercase">
                    <span className="block text-white mb-1">{t('hero.title_1')}</span>
                    <span className="text-yellow-500 block">{t('hero.title_2')}</span>
                  </h2>
                  <p 
                    className="text-zinc-400 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed max-w-lg opacity-90 mx-auto lg:mx-0"
                    dangerouslySetInnerHTML={{ __html: t('hero.desc_html') }}
                  />
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                 <button onClick={scrollToShop} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest h-11 md:h-12 px-8 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-[10px] md:text-xs shadow-xl shadow-yellow-500/10">
                   {t('hero.btn_catalog')} <ArrowRight size={16} strokeWidth={3} />
                 </button>
                 <button onClick={() => document.getElementById('about-brand')?.scrollIntoView({behavior: 'smooth'})} className="h-11 md:h-12 px-8 rounded-xl border border-zinc-800 bg-black/40 backdrop-blur-md text-white font-black uppercase tracking-widest transition-all hover:bg-zinc-800 text-[10px] md:text-xs flex items-center justify-center gap-2">
                   {t('hero.btn_brand')}
                 </button>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-5 w-full animate-fade-in-up delay-100 flex flex-col items-center lg:items-end">
                <div className="w-full max-w-[380px] bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                   <form onSubmit={handleParamSubmit} className="space-y-4 lg:space-y-5">
                       <div className="flex items-center justify-between border-b border-white/5 pb-4">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500">
                                   <Search size={16} />
                               </div>
                               <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">
                                   {t('hero.tab_params')}
                               </h3>
                           </div>
                           
                           <div className="hidden sm:flex items-center gap-3 text-[9px] font-black uppercase text-zinc-500">
                               <span className="flex items-center gap-1"><Users size={12} className="text-yellow-500"/> 5k+</span>
                               <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-yellow-500"/> 97%</span>
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-xl border border-zinc-800">
                           <button
                              type="button"
                              onClick={() => { setSelectedType('motor-oil'); setSelectedAdditiveSub(''); }}
                              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                                  selectedType === 'motor-oil' 
                                  ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700' 
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                           >
                              <Droplets size={12} className={selectedType === 'motor-oil' ? 'text-yellow-500' : ''} />
                              {t('hero.opt_oil')}
                           </button>
                           <button
                              type="button"
                              onClick={() => { setSelectedType('additives'); setSelectedViscosity(''); setSelectedApproval(''); }}
                              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                                  selectedType === 'additives' 
                                  ? 'bg-zinc-800 text-white shadow-lg border border-zinc-700' 
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                           >
                              <FlaskConical size={12} className={selectedType === 'additives' ? 'text-yellow-500' : ''} />
                              {t('hero.opt_additives')}
                           </button>
                       </div>

                       <div className="space-y-2.5">
                           {selectedType === 'motor-oil' ? (
                               <>
                                 <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors pointer-events-none flex items-center gap-1.5">
                                        <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">SAE</span>
                                    </div>
                                    <select 
                                        value={selectedViscosity}
                                        onChange={(e) => setSelectedViscosity(e.target.value)}
                                        className="w-full h-11 bg-black/60 border border-zinc-800 rounded-xl py-2 pl-14 pr-10 text-[11px] font-bold text-white focus:border-yellow-500 outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">{t('hero.ph_viscosity')}</option>
                                        {VISCOSITIES.map(v => <option key={v} value={v}>{v.replace('SAE ', '')}</option>)}
                                    </select>
                                    <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                                 </div>

                                 <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors pointer-events-none">
                                        <ShieldCheck size={14} />
                                    </div>
                                    <select 
                                        value={selectedApproval}
                                        onChange={(e) => setSelectedApproval(e.target.value)}
                                        className="w-full h-11 bg-black/60 border border-zinc-800 rounded-xl py-2 pl-12 pr-10 text-[11px] font-bold text-white focus:border-yellow-500 outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">{t('hero.ph_approval')}</option>
                                        {APPROVALS.filter(a => !['Petrol','Diesel','DPF','Anti-smoke','Transmission','Engine'].includes(a)).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                    <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                                 </div>
                               </>
                           ) : (
                               <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors pointer-events-none">
                                        <FlaskConical size={14} />
                                    </div>
                                    <select 
                                        value={selectedAdditiveSub}
                                        onChange={(e) => setSelectedAdditiveSub(e.target.value)}
                                        className="w-full h-11 bg-black/60 border border-zinc-800 rounded-xl py-2 pl-12 pr-10 text-[11px] font-bold text-white focus:border-yellow-500 outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">{t('hero.ph_add_sub')}</option>
                                        {ADDITIVE_CATEGORIES.map(cat => (
                                          <optgroup key={cat.id} label={t(cat.labelKey)} className="bg-zinc-900 text-zinc-300">
                                             {ADDITIVE_SUBTYPES[cat.id]?.map(sub => (
                                                <option key={sub.id} value={sub.id}>{t(sub.labelKey)}</option>
                                             ))}
                                          </optgroup>
                                        ))}
                                    </select>
                                    <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
                               </div>
                           )}
                       </div>

                       <button 
                          type="submit" 
                          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-[0.2em] h-12 rounded-xl shadow-lg transition-all active:scale-[0.97] flex items-center justify-center gap-3 text-[10px]"
                       >
                          {t('hero.btn_show')}
                       </button>
                   </form>
                </div>
            </div>
        </div>
      </div>

      {/* Scroll Down Indicator - Hidden on Mobile to avoid overlapping with bottom navigation */}
      <div 
        onClick={scrollToShop}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 cursor-pointer group animate-bounce-slow"
      >
        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] group-hover:text-yellow-500 transition-colors duration-300">
          {scrollText}
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-yellow-500 to-transparent relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-500 rounded-full blur-[2px] animate-ping" />
        </div>
        <Chevron size={14} className="text-yellow-500 mt-[-8px] opacity-50" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite ease-in-out;
        }
      `}} />
    </section>
  );
};

export default Hero;
