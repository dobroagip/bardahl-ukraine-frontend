import React from 'react';
import { Search, Zap, Droplets, Settings, Award, Phone, MessageSquare, MapPin, Clock } from 'lucide-react';
import { FilterState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SeoTarget {
  category?: string;
  filters?: Partial<FilterState>;
  searchQuery?: string;
  productId?: string; 
  articleId?: string;
}

interface SeoBlockProps {
  onSeoSelect: (target: SeoTarget) => void;
}

const SeoBlock: React.FC<SeoBlockProps> = ({ onSeoSelect }) => {
  const { language } = useLanguage();
  
  const handleClick = (e: React.MouseEvent, target: SeoTarget) => {
    e.preventDefault();
    onSeoSelect(target);
  };

  const content = {
    ru: {
      queriesTitle: "Популярные запросы",
      footerText: "Bardahl Ukraine © 2011-2025. Все права защищены. ПП «Добробут» — официальный импортер.",
      contactTitle: "ГОРЯЧАЯ ЛИНИЯ",
      schedule: "Пн-Пт: 09:00 - 18:00 | Сб: 10:00 - 15:00",
      topQueries: [
        { text: "Официальный дилер Bardahl Украина", target: { articleId: 'official-dealer-status-ukraine' } },
        { text: "купить масло 5w30 киев", target: { category: 'motor-oil', filters: { viscosities: ['SAE 5W30'] } } },
        { text: "присадка full metal цена", target: { productId: 'full-metal' } },
        { text: "масло для дизеля dpf", target: { category: 'motor-oil', filters: { approvals: ['DPF'] } } }, 
        { text: "bardahl 5w40 xtc отзывы", target: { searchQuery: 'XTC 5W40' } },
        { text: "подбор масла по вин коду", target: { searchQuery: 'подбор' } },
        { text: "присадка в дизель BDC купить", target: { searchQuery: 'BDC' } },
        { text: "оригинальный Bardahl Бельгия", target: { searchQuery: 'оригинал' } },
        { text: "масло Bardahl XTEC 5w30", target: { searchQuery: 'XTEC 5W30' } },
        { text: "трансмиссионное масло Bardahl", target: { category: 'gear-oil' } },
      ]
    },
    uk: {
      queriesTitle: "Популярні запити",
      footerText: "Bardahl Ukraine © 2011-2025. Усі права захищені. ПП «Добробут» — офіційний импортер.",
      contactTitle: "ГАРЯЧА ЛІНІЯ",
      schedule: "Пн-Пт: 09:00 - 18:00 | Сб: 10:00 - 15:00",
      topQueries: [
        { text: "Офіційний дилер Bardahl Україна", target: { articleId: 'official-dealer-status-ukraine' } },
        { text: "купити оливу 5w30 київ", target: { category: 'motor-oil', filters: { viscosities: ['SAE 5W30'] } } },
        { text: "присадка full metal ціна", target: { productId: 'full-metal' } },
        { text: "олива для дизеля dpf", target: { category: 'motor-oil', filters: { approvals: ['DPF'] } } }, 
        { text: "bardahl 5w40 xtc відгуки", target: { searchQuery: 'XTC 5W40' } },
        { text: "підбір оливи за він кодом", target: { searchQuery: 'підбір' } },
        { text: "присадка в дизель BDC купити", target: { searchQuery: 'BDC' } },
        { text: "оригінальний Bardahl Бельгія", target: { searchQuery: 'оригінал' } },
        { text: "олива Bardahl XTEC 5w30", target: { searchQuery: 'XTEC 5W30' } },
        { text: "трансмісійна олива Bardahl", target: { category: 'gear-oil' } },
      ]
    }
  };

  const cur = content[language] || content.ru;

  return (
    <section className="bg-black border-t border-zinc-900 pt-16 pb-12">
      <div className="container mx-auto px-4">
        
        {/* Contact Footer Header */}
        <div className="grid lg:grid-cols-12 gap-12 mb-16 items-start">
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full group-hover:scale-150 transition-transform"></div>
                 <h3 className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] mb-4">{cur.contactTitle}</h3>
                 <a href="tel:+380674862117" className="text-3xl md:text-4xl font-black text-white italic tracking-tighter hover:text-yellow-500 transition-colors block mb-6">
                   +38 (067) 486-21-17
                 </a>
                 <div className="flex flex-wrap gap-3">
                    <a href="viber://chat?number=%2B380674862117" className="flex items-center gap-2 bg-[#7360f2] hover:bg-[#6251d1] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg">
                       <img src="https://img.icons8.com/color/48/viber.png" className="w-5 h-5 brightness-200" alt="Viber" /> Viber
                    </a>
                    <a href="https://wa.me/380674862117" className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20b859] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg">
                       <img src="https://img.icons8.com/color/48/whatsapp.png" className="w-5 h-5 brightness-200" alt="WhatsApp" /> WhatsApp
                    </a>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-yellow-500 flex-shrink-0">
                    <MapPin size={20} />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm uppercase mb-1">Центральный офис</h4>
                    <p className="text-zinc-500 text-sm">г. Одесса, ул. Бугаёвская, 41</p>
                    <a href="mailto:info@bardahl-ukraine.com" className="text-yellow-500 text-sm hover:underline mt-2 inline-block">info@bardahl-ukraine.com</a>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-yellow-500 flex-shrink-0">
                    <Clock size={20} />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-sm uppercase mb-1">Режим работы</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{cur.schedule}</p>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4">
              <h4 className="text-white font-bold text-sm uppercase mb-6 flex items-center gap-2">
                 <Search size={16} className="text-yellow-500" /> {cur.queriesTitle}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cur.topQueries.map((query, idx) => (
                  <a 
                    key={idx} 
                    href="#" 
                    title={query.text}
                    onClick={(e) => handleClick(e, query.target)}
                    className="text-[10px] font-bold text-zinc-500 border border-zinc-800 hover:border-yellow-500/50 hover:text-white px-3 py-1.5 rounded-full transition-all"
                  >
                    {query.text}
                  </a>
                ))}
              </div>
           </div>
        </div>

        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center md:text-left">
           <div className="flex items-center gap-4">
              <div className="bg-yellow-500 text-black px-2 py-0.5 italic transform -skew-x-12">BARDAHL UKRAINE</div>
              <p>{cur.footerText}</p>
           </div>
           <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white transition-colors">Оферта</a>
           </div>
        </div>

      </div>
    </section>
  );
};

export default SeoBlock;