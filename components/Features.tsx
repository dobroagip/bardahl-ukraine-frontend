
import React from 'react';
import { ShieldCheck, Truck, Award, Headphones } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    { icon: ShieldCheck, title: t('features.original_title'), desc: t('features.original_desc') },
    { icon: Truck, title: t('features.delivery_title'), desc: t('features.delivery_desc') },
    { icon: Award, title: t('features.warranty_title'), desc: t('features.warranty_desc') },
    { icon: Headphones, title: t('features.consult_title'), desc: t('features.consult_desc') },
  ];

  return (
    <section className="relative z-20 bg-zinc-950 border-y border-zinc-900 shadow-2xl overflow-hidden">
      <div className="container mx-auto px-4 py-6 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 md:gap-y-16 items-start">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center text-center group transition-all duration-500"
            >
              {/* Icon Container with Glow */}
              <div className="relative mb-3 md:mb-7">
                <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-10 h-10 md:w-20 md:h-20 bg-zinc-900 border border-zinc-800 rounded-xl md:rounded-2xl flex items-center justify-center text-yellow-500 group-hover:text-black group-hover:bg-yellow-500 group-hover:border-yellow-400 group-hover:rotate-[10deg] transition-all duration-500 shadow-2xl">
                  <f.icon className="w-5 h-5 md:w-10 md:h-10" strokeWidth={1.5} />
                </div>
              </div>

              {/* Text Content */}
              <div className="max-w-[140px] md:max-w-[220px] flex flex-col items-center">
                <h4 className="text-white font-black text-[9px] md:text-base uppercase tracking-tighter italic mb-1 md:mb-2 group-hover:text-yellow-500 transition-colors">
                  {f.title}
                </h4>
                <div className="w-4 md:w-12 h-[1px] md:h-0.5 bg-zinc-800 mb-2 md:mb-3 group-hover:w-6 md:group-hover:w-12 group-hover:bg-yellow-500 transition-all duration-500" />
                <p className="text-zinc-500 text-[8px] md:text-sm font-medium leading-tight md:leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background decoration line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
    </section>
  );
};

export default Features;
