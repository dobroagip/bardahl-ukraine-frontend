
import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronRight, CornerDownLeft, Zap } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSearch: (query: string) => void;
  onProductSelect: (product: Product) => void;
  onCategorySelect: (id: string) => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  onSearch, 
  onProductSelect,
  onCategorySelect
}) => {
  const { t, categories, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure modal is rendered before focusing
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const smartMatch = (product: Product, q: string): boolean => {
    const clean = (str: string) => str.toLowerCase().replace(/[\s\-\.]/g, '');
    const pName = clean(product.name);
    const pVisc = product.viscosity ? clean(product.viscosity) : '';
    const qRaw = clean(q);

    const qTranslit = qRaw
      .replace(/бардаль/g, 'bardahl')
      .replace(/в/g, 'w')
      .replace(/х/g, 'x')
      .replace(/с/g, 'c')
      .replace(/а/g, 'a')
      .replace(/р/g, 'p')
      .replace(/о/g, 'o')
      .replace(/е/g, 'e')
      .replace(/к/g, 'k')
      .replace(/м/g, 'm')
      .replace(/т/g, 't');

    return pName.includes(qRaw) || pName.includes(qTranslit) || pVisc.includes(qRaw) || pVisc.includes(qTranslit);
  };

  useEffect(() => {
    if (query.length > 1) {
      const filtered = products.filter(p => smartMatch(p, query)).slice(0, 8);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      onClose();
    }
  };

  const popularCategoryIds = ['motor-oil', 'additives', 'moto', 'car-care'];
  const popularTitle = language === 'ru' ? 'Популярные категории' : 'Популярні категорії';
  const showAllText = language === 'ru' ? 'Показать все результаты' : 'Показати всі результати';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="p-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900/50">
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={t('header.search_ph')}
            className="w-full bg-black border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
        </form>
        <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {results.length > 0 ? (
          <>
            <div className="text-[10px] uppercase text-zinc-500 font-black tracking-widest px-2 mb-2 flex items-center gap-2">
              <Zap size={10} className="text-yellow-500" />
              {t('shop.found')}
            </div>
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  onProductSelect(product);
                  onClose();
                }}
                className="w-full flex items-center gap-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-yellow-500/30 transition-all text-left group active:scale-[0.98]"
              >
                <div className="w-16 h-16 bg-white rounded-lg p-1 flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-zinc-100 group-hover:text-yellow-500 line-clamp-2 leading-tight">
                    {product.name}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    {product.viscosity && <span className="text-yellow-500/70">{product.viscosity} • </span>}
                    {product.volume}
                  </div>
                  <div className="text-sm font-black text-white mt-1">
                    {product.price} ₴
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-700" />
              </button>
            ))}
          </>
        ) : query.length > 1 ? (
          <div className="py-20 text-center text-zinc-500">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>{language === 'ru' ? 'Ничего не найдено' : 'Нічого не знайдено'}</p>
          </div>
        ) : (
          <div className="py-10">
             <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">{popularTitle}</h4>
             <div className="grid grid-cols-2 gap-2">
                {popularCategoryIds.map(id => {
                  const cat = categories.find(c => c.id === id);
                  if (!cat) return null;
                  return (
                    <button 
                      key={id} 
                      onClick={() => { 
                        onCategorySelect(cat.id);
                        onClose();
                      }}
                      className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm text-zinc-300 text-left hover:border-yellow-500/50 active:bg-zinc-800 transition-all active:scale-[0.97]"
                    >
                      {cat.name}
                    </button>
                  );
                })}
             </div>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {query && (
        <div className="p-4 border-t border-zinc-800 bg-zinc-900 text-center">
           <button 
             onClick={handleSubmit}
             className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
           >
              {showAllText} <CornerDownLeft size={18} />
           </button>
        </div>
      )}
    </div>
  );
};

export default MobileSearchModal;
