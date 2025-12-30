
import React, { useState, useEffect } from 'react';
import { Shield, Zap, History, Globe, Heart, UserCheck, Award, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { contentService } from '../services/contentService';
import { STATIC_CONTENT } from '../constants';

const AboutBrand: React.FC = () => {
  const { t, language } = useLanguage();
  const companyData = STATIC_CONTENT[language].aboutUs;
  
  const [imageSrc, setImageSrc] = useState('https://images.unsplash.com/photo-1552176625-e47ff529b595?q=80&w=2669&auto=format&fit=crop');

  useEffect(() => {
    const savedImage = contentService.getAboutImage();
    if (savedImage) {
        setImageSrc(savedImage);
    }
  }, []);

  return (
    <section id="about-brand" className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-500/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* Text Content Area */}
          <div className="flex-1 space-y-10 md:space-y-14">
            
            {/* 1. Main Company Info (Now First) */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                <Award size={14} /> Official Distributor
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                  {companyData.companyName}
                </h2>
                <p className="text-yellow-500 font-bold text-sm md:text-lg uppercase tracking-wide">
                  {companyData.status}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <Calendar size={14} className="text-yellow-500" /> {companyData.since}
                </span>
                <span className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <MapPin size={14} className="text-yellow-500" /> {companyData.address}
                </span>
              </div>

              <p className="text-zinc-300 text-base md:text-xl leading-relaxed italic border-l-4 border-yellow-500 pl-6 max-w-2xl py-2">
                "{companyData.philosophy}"
              </p>
            </div>

            {/* 2. Success History Section */}
            <div className="space-y-6 pt-6 border-t border-zinc-900">
              <div className="flex items-center gap-4">
                <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">{t('about.history_title')}</h3>
                <div className="h-px bg-zinc-800 flex-1"></div>
              </div>
              <div className="prose prose-invert text-zinc-400 text-sm md:text-base leading-relaxed space-y-4">
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
              </div>
            </div>

            {/* 3. Technologies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
              <div className="bg-zinc-900/40 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 hover:border-yellow-500/30 transition-all group">
                <div className="bg-yellow-500 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-black shadow-[0_0_20px_rgba(234,179,8,0.2)] group-hover:scale-110 transition-transform">
                  <Zap size={24} strokeWidth={2.5} />
                </div>
                <h4 className="text-white font-black uppercase italic tracking-wider mb-2">Polar Plus</h4>
                <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">
                  {t('about.tech_polar')}
                </p>
              </div>
              
              <div className="bg-zinc-900/40 backdrop-blur-sm p-6 rounded-2xl border border-zinc-800 hover:border-yellow-500/30 transition-all group">
                <div className="bg-zinc-800 w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Shield size={24} />
                </div>
                <h4 className="text-white font-black uppercase italic tracking-wider mb-2">Fullerene C60</h4>
                <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">
                  {t('about.tech_c60')}
                </p>
              </div>
            </div>

            {/* 4. Local Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2 p-5 bg-zinc-900/20 border border-white/5 rounded-2xl group hover:border-yellow-500/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-2">
                     <UserCheck size={20} />
                  </div>
                  <div>
                     <div className="text-2xl md:text-3xl font-black text-white leading-none mb-1">5000+</div>
                     <div className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest">{t('about.stats_clients')}</div>
                  </div>
               </div>
               <div className="flex flex-col gap-2 p-5 bg-zinc-900/20 border border-white/5 rounded-2xl group hover:border-red-500/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                     <Heart size={20} fill="currentColor" />
                  </div>
                  <div>
                     <div className="text-2xl md:text-3xl font-black text-white leading-none mb-1">97.8%</div>
                     <div className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-black tracking-widest">{t('about.stats_satisfaction')}</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Visuals Column */}
          <div className="flex-1 w-full lg:sticky lg:top-32">
             <div className="relative group">
                <div className="absolute -inset-4 bg-yellow-500/10 rounded-3xl blur-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-700"></div>
                <div className="relative rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl">
                    <img 
                      src={imageSrc}
                      alt="Bardahl Racing Legacy" 
                      className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-1000"
                      onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1552176625-e47ff529b595?q=80&w=2669&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Experience Badges */}
                <div className="absolute -bottom-6 -left-4 md:-left-8 bg-zinc-900 p-5 rounded-2xl border border-zinc-700 shadow-2xl flex items-center gap-4 animate-bounce-slow">
                  <div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-500">
                    <Globe size={28} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white leading-none">100+</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mt-1">{t('about.stats_countries')}</div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-4 md:-right-8 bg-zinc-900 p-5 rounded-2xl border border-zinc-700 shadow-2xl flex items-center gap-4 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                  <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
                    <History size={28} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white leading-none">85+</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mt-1">{t('about.stats_years')}</div>
                  </div>
                </div>
             </div>

             <div className="mt-12 hidden lg:grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                        <Award size={16} className="text-yellow-500" /> Сделано в Бельгии
                    </h5>
                    <p className="text-xs text-zinc-500 leading-relaxed">Вся продукция производится на европейских заводах со строгим контролем качества.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                    <h5 className="text-white font-bold mb-2 flex items-center gap-2">
                        <Shield size={16} className="text-yellow-500" /> Лабораторные тесты
                    </h5>
                    <p className="text-xs text-zinc-500 leading-relaxed">Каждая партия проходит проверку на соответствие заявленным допускам производителей.</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutBrand;
