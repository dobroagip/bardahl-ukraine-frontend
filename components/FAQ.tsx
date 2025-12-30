import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { STATIC_CONTENT } from '../constants';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const { language } = useLanguage();
  const content = STATIC_CONTENT[language].faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 bg-black border-t border-zinc-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-8 justify-center">
            <HelpCircle className="text-yellow-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            {content.title}
            </h2>
        </div>
        
        <div className="space-y-4">
          {content.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`bg-zinc-900 border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-bold text-sm md:text-base ${isOpen ? 'text-white' : 'text-zinc-300'}`}>
                    {item.q}
                  </span>
                  <div className={`p-1 rounded-full border transition-all ${isOpen ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-zinc-700 text-zinc-500'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-5 pt-0 text-zinc-400 text-sm leading-relaxed border-t border-zinc-800/50 mt-2">
                    {item.a}
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

export default FAQ;