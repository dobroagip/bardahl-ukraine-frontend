
import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Phone, User as UserIcon, Zap, ChevronRight, Info, BookOpen, ShieldCheck, Truck, Mail, Globe } from 'lucide-react';
import { Product, User, ViewType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  onOpenMobileSearch?: () => void;
  onProductSelect: (product: Product) => void; 
  activeCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onNavigate: (view: ViewType) => void;
  onGoHome: () => void;
  user: User | null;
  onAuthAction: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onSearch, onOpenMobileSearch, onProductSelect, activeCategory, onCategorySelect, onNavigate, onGoHome, user, onAuthAction }) => {
  const { language, setLanguage, products, categories, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsSearchFocused(false);
    setIsMenuOpen(false);
  };

  const infoPages = [
    { id: 'about-us' as ViewType, label: t('header.about'), icon: Info },
    { id: 'blog' as ViewType, label: t('header.blog'), icon: BookOpen },
    { id: 'delivery' as ViewType, label: t('header.delivery'), icon: Truck },
    { id: 'contacts' as ViewType, label: t('header.contacts'), icon: Mail },
  ];

  const headerCategories = categories.length > 0 
    ? categories.filter(c => c.isHeader !== false && c.id !== 'all' && c.id !== 'truck-oil')
    : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 shadow-lg">
      {/* Top Utility Bar - Desktop only */}
      <div className="bg-black border-b border-zinc-900 text-[11px] py-1.5 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
           <div className="flex items-center gap-6 text-zinc-500 font-bold uppercase tracking-wider">
              {infoPages.map(page => (
                <button key={page.id} onClick={() => onNavigate(page.id)} className="hover:text-yellow-500 transition-colors">
                  {page.label}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
                 <button 
                  onClick={() => setLanguage('uk')} 
                  className={`px-3 py-0.5 rounded-md font-black text-[10px] transition-all flex items-center gap-1.5 ${language === 'uk' ? 'bg-yellow-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   <span>🇺🇦</span> УКР
                 </button>
                 <button 
                  onClick={() => setLanguage('ru')} 
                  className={`px-3 py-0.5 rounded-md font-black text-[10px] transition-all flex items-center gap-1.5 ${language === 'ru' ? 'bg-yellow-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                   РУС
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="container mx-auto px-4 py-4 relative z-20">
        <div className="flex items-center justify-between gap-6 md:gap-10">
          
          {/* Logo */}
          <button onClick={onGoHome} className="flex items-center gap-2 group shrink-0">
            <div className="bg-yellow-500 text-black font-black text-xl md:text-2xl px-3 py-1.5 tracking-tighter italic transform -skew-x-12 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(234,179,8,0.2)]">
              BARDAHL
            </div>
          </button>

          {/* Search (Desktop) */}
          <div ref={searchRef} className="hidden lg:block flex-1 max-w-xl relative mx-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative group">
                <input
                  type="text"
                  placeholder={t('header.search_ph')}
                  className="w-full bg-[#111111] border border-zinc-800 rounded-xl py-2.5 px-5 pl-11 text-sm text-zinc-300 focus:text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 outline-none transition-all"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  autoComplete="off"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-yellow-500 transition-colors" />
              </div>
            </form>

            {isSearchFocused && searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-[60]">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => { onProductSelect(product); setIsSearchFocused(false); }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg text-left"
                      >
                        <div className="w-10 h-10 bg-white rounded p-1 flex-shrink-0">
                           <img src={product.image} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-zinc-200 truncate">{product.name}</div>
                          <div className="text-xs text-zinc-500">{product.price} ₴</div>
                        </div>
                        <ChevronRight size={14} className="text-zinc-600" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-zinc-500 text-xs italic">...</div>
                )}
              </div>
            )}
          </div>

          {/* Right Section: Contacts & Actions */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex flex-col items-end">
               <a href="tel:+380674862117" className="text-yellow-500 font-black text-lg md:text-xl leading-none hover:text-white transition-colors tracking-tight">
                 +38 (067) 486-21-17
               </a>
               <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">
                 {t('header.distributor')}
               </span>
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              <button 
                onClick={onAuthAction} 
                className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-all active:scale-90"
                title={t('header.cabinet')}
              >
                <UserIcon className={user ? "text-yellow-500" : ""} size={24} strokeWidth={1.5} />
              </button>
              
              <button 
                onClick={onOpenCart} 
                className="relative p-2.5 text-zinc-100 hover:text-yellow-500 hover:bg-zinc-900 rounded-full transition-all active:scale-90"
              >
                <ShoppingCart size={24} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-yellow-500 text-black text-[9px] font-black h-4.5 w-4.5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                    {cartCount}
                  </span>
                )}
              </button>

              <button className="md:hidden text-zinc-100 p-2 ml-1 active:scale-90 transition-transform" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop horizontal & Mobile drawer */}
      <div 
        className={`
          ${isMenuOpen ? 'fixed md:absolute inset-0 top-[64px] md:top-auto md:relative block bg-zinc-950 z-[100] h-screen md:h-auto overflow-y-auto' : 'hidden md:block'} 
          border-t border-zinc-900 transition-all duration-300
        `}
      >
        <div className="container mx-auto px-4 py-6 md:py-1 flex flex-col md:flex-row md:items-center justify-between">
           
           {/* Desktop Menu - Optimized Typography */}
           <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 lg:gap-10">
              <li className="md:hidden text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Каталог</li>
              {headerCategories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => { onCategorySelect(cat.id); setIsMenuOpen(false); }}
                    className={`w-full text-left md:w-auto py-3 md:py-2 text-lg md:text-[11px] font-black uppercase tracking-[0.15em] transition-colors border-b border-zinc-900 md:border-0 ${activeCategory === cat.id ? 'text-yellow-500' : 'text-zinc-300 md:text-zinc-400 hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
           </ul>
           
           <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 pt-6 md:pt-0 border-t border-zinc-900 md:border-0">
              {/* Mobile Language Switcher */}
              <div className="md:hidden flex items-center justify-between bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                 <span className="text-zinc-500 text-xs font-bold flex items-center gap-2">
                   <Globe size={18} /> {language === 'ru' ? 'Язык сайта' : 'Мова сайту'}
                 </span>
                 <div className="flex gap-2">
                    <button onClick={() => { setLanguage('uk'); setIsMenuOpen(false); }} className={`px-4 py-2 rounded-lg font-black text-sm transition-all ${language === 'uk' ? 'bg-yellow-500 text-black' : 'text-zinc-400 bg-zinc-800'}`}>УКР</button>
                    <button onClick={() => { setLanguage('ru'); setIsMenuOpen(false); }} className={`px-4 py-2 rounded-lg font-black text-sm transition-all ${language === 'ru' ? 'bg-yellow-500 text-black' : 'text-zinc-400 bg-zinc-800'}`}>РУС</button>
                 </div>
              </div>

              {/* Selection Button - Capsule style as per screenshot */}
              <button 
                onClick={() => { onCategorySelect('all'); setIsMenuOpen(false); }} 
                className="bg-yellow-500 text-black px-7 py-4 md:py-1.5 rounded-full text-sm md:text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(234,179,8,0.2)]"
              >
                <Zap size={14} fill="currentColor" /> {t('header.oil_select')}
              </button>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
