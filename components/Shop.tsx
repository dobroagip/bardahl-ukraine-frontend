
import React, { useState, useEffect, useMemo } from 'react';
import { Product, FilterState, ViewType, Category } from '../types';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';
import CategoryHeader from './CategoryHeader';
import { Search, Filter, X, ChevronLeft, ChevronRight, ChevronDown, Trash2, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import SeoHead from './SeoHead';

interface ShopProps {
  products: Product[];
  initialCategory?: string;
  initialFilters?: Partial<FilterState>;
  searchQuery: string;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onOneClickBuy: (product: Product) => void;
  onClearSearch: () => void;
  onCategoryChange: (id: string) => void;
  onNavigate?: (view: ViewType) => void; 
  onGoHome: () => void;
}

const ITEMS_PER_PAGE = 12;

const Shop: React.FC<ShopProps> = ({ 
  products: allProducts, 
  initialCategory = 'all', 
  initialFilters,
  searchQuery, 
  onAddToCart, 
  onProductClick,
  onOneClickBuy,
  onClearSearch,
  onCategoryChange,
  onGoHome
}) => {
  const { t, language } = useLanguage();

  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory !== 'all' ? [initialCategory] : [],
    viscosities: initialFilters?.viscosities || [],
    volumes: [],
    approvals: initialFilters?.approvals || [],
    priceRange: { min: 0, max: 20000 }
  });

  const [sortBy, setSortBy] = useState<'pop' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('pop');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCategoryData, setActiveCategoryData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize internal category filter with initialCategory from props
  useEffect(() => {
    setFilters(prev => ({ 
      ...prev, 
      categories: initialCategory !== 'all' ? [initialCategory] : [],
      viscosities: initialFilters?.viscosities || [], 
      approvals: initialFilters?.approvals || [],
    }));
    setCurrentPage(1); 
  }, [initialCategory, initialFilters]);

  // Main data fetching effect - now includes currentPage
  useEffect(() => {
    let isMounted = true;
    const updateFiltered = async () => {
      setIsLoading(true);
      try {
        const result = await productService.getFiltered(
          language, 
          filters, 
          searchQuery, 
          sortBy,
          currentPage,
          ITEMS_PER_PAGE
        );
        if (isMounted) {
          setFilteredProducts(result.products);
          setTotalCount(result.total);
        }
      } catch (e) {
        console.error("Filter Fetch Error:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    updateFiltered();
    return () => { isMounted = false; };
  }, [filters, searchQuery, sortBy, language, currentPage]);

  useEffect(() => {
    if (initialCategory !== 'all' && !searchQuery) {
        categoryService.getById(initialCategory, language).then(data => {
            if (data) setActiveCategoryData(data);
        });
    } else {
        setActiveCategoryData(null);
    }
  }, [initialCategory, searchQuery, language]);

  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileFiltersOpen]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
        const scrollTarget = document.getElementById('shop-section');
        if (scrollTarget) {
          window.scrollTo({
            top: scrollTarget.offsetTop - 80,
            behavior: 'smooth'
          });
        }
    }
  };

  const handleResetAll = () => {
    onClearSearch();
    if (initialCategory !== 'all') onCategoryChange('all');
    setFilters({ categories: [], viscosities: [], volumes: [], approvals: [], priceRange: { min: 0, max: 20000 } });
    setCurrentPage(1);
    setIsMobileFiltersOpen(false);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Bardahl', onClick: onGoHome },
    { label: t('sidebar.catalog'), onClick: () => onCategoryChange('all'), isActive: (initialCategory === 'all' || filters.categories.length === 0) && !searchQuery },
  ];

  if (initialCategory !== 'all') {
      breadcrumbItems.push({
        label: activeCategoryData?.name || initialCategory,
        onClick: () => { onClearSearch(); onCategoryChange(initialCategory); },
        isActive: !searchQuery
      });
  }

  const getDisplayTitle = () => {
    if (searchQuery) return `${t('common.search')}: ${searchQuery}`;
    const isAll = initialCategory === 'all' || filters.categories.length === 0;
    if (isAll) return language === 'ru' ? 'Все товары Bardahl' : 'Всі товари Bardahl';
    return activeCategoryData?.name || t('sidebar.all_products');
  };

  const paginationLabel = language === 'ru' ? 'Навигация по страницам' : 'Навігація по сторінках';

  return (
    <div className="w-full">
      <SeoHead 
        title={activeCategoryData?.seo?.title}
        description={activeCategoryData?.seo?.description}
        keywords={activeCategoryData?.seo?.keywords}
        categoryName={activeCategoryData?.name}
        type="category"
        path={initialCategory !== 'all' ? `/?cat=${initialCategory}` : '/'}
      />

      {initialCategory !== 'all' && activeCategoryData && !searchQuery && (
        <CategoryHeader category={activeCategoryData} />
      )}

      <div className="container mx-auto px-4 py-4 md:py-6 min-h-screen">
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28">
            <Sidebar 
              filters={filters} 
              onFilterChange={(f) => { setFilters(f); setCurrentPage(1); }} 
              onCategorySelect={(id) => { onCategoryChange(id); setCurrentPage(1); }}
            />
          </aside>

          {/* Mobile Filters Trigger */}
          <div className="lg:hidden flex items-center justify-between w-full mb-4 gap-3">
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex-1 flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-800 py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
              >
                <Filter size={18} className="text-yellow-500" />
                {t('shop.filter_title')}
                {(filters.viscosities.length + filters.volumes.length + filters.approvals.length) > 0 && (
                  <span className="bg-yellow-500 text-black w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black">
                    {filters.viscosities.length + filters.volumes.length + filters.approvals.length}
                  </span>
                )}
              </button>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
                  className="bg-zinc-900 border border-zinc-800 py-3.5 px-5 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest appearance-none pr-10 shadow-xl outline-none"
                >
                   <option value="pop">{t('shop.sort_pop')}</option>
                   <option value="price_asc">{t('shop.sort_price_asc')}</option>
                   <option value="price_desc">{t('shop.sort_price_desc')}</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-500 pointer-events-none" />
              </div>
          </div>

          {/* Mobile Filters Drawer */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
               <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsMobileFiltersOpen(false)} />
               <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-zinc-950 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                  <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                     <h2 className="text-lg font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        <Filter size={18} className="text-yellow-500" /> {t('shop.filter_title')}
                     </h2>
                     <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1.5 bg-zinc-800 text-zinc-400 rounded-xl hover:text-white transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                     <Sidebar 
                        filters={filters} 
                        onFilterChange={(f) => { setFilters(f); setCurrentPage(1); }} 
                        onCategorySelect={(id) => { onCategoryChange(id); setCurrentPage(1); }}
                     />
                  </div>

                  <div className="p-5 border-t border-zinc-800 bg-zinc-900/50 grid grid-cols-2 gap-3">
                     <button 
                        onClick={handleResetAll}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl text-zinc-500 font-black uppercase text-[9px] tracking-widest hover:text-red-500 transition-colors"
                     >
                        <Trash2 size={14} /> {t('shop.clear_all')}
                     </button>
                     <button 
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="bg-yellow-500 text-black py-3 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg shadow-yellow-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                     >
                        <Check size={14} /> {t('shop.show_results')}
                     </button>
                  </div>
               </div>
            </div>
          )}

          <section className="flex-1 w-full relative" aria-label="Product list">
              <div className="flex items-center justify-between mb-6 border-b border-zinc-900 pb-4">
                 <div className="flex items-center gap-4">
                    <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter">
                        {getDisplayTitle()}
                    </h2>
                    {isLoading && <Loader2 className="animate-spin text-yellow-500" size={20} />}
                 </div>
                 <div className="text-[10px] text-zinc-400 font-black uppercase tracking-widest bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2">
                    <span className="text-white">{totalCount}</span> {t('common.items_short')}
                 </div>
              </div>

              {filteredProducts.length > 0 ? (
                 <div className={`${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-12" role="list">
                        {filteredProducts.map(product => (
                            <div key={product.id} role="listitem">
                                <ProductCard 
                                    product={product} 
                                    onAddToCart={onAddToCart} 
                                    onClick={onProductClick}
                                    onOneClickBuy={onOneClickBuy}
                                />
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav className="flex flex-col md:flex-row items-center justify-center gap-6 pb-12 border-t border-zinc-900 pt-8" aria-label={paginationLabel}>
                            <div className="flex items-center gap-2">
                                <button 
                                    disabled={currentPage === 1 || isLoading}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-white disabled:opacity-20 hover:border-yellow-500 transition-all active:scale-90 group"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                                        // Show max 5 page buttons with current in center for better UX
                                        if (totalPages > 7) {
                                            if (p > 1 && p < totalPages && (p < currentPage - 1 || p > currentPage + 1)) {
                                                if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="text-zinc-700">...</span>;
                                                return null;
                                            }
                                        }
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => handlePageChange(p)}
                                                disabled={isLoading}
                                                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${currentPage === p ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-white hover:border-zinc-400'}`}
                                                aria-current={currentPage === p ? 'page' : undefined}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button 
                                    disabled={currentPage === totalPages || isLoading}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-white disabled:opacity-20 hover:border-yellow-500 transition-all active:scale-90 group"
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                            
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                Page <span className="text-zinc-400">{currentPage}</span> of <span className="text-zinc-400">{totalPages}</span>
                            </div>
                        </nav>
                    )}
                 </div>
              ) : (
                  !isLoading && (
                    <div className="py-20 text-center flex flex-col items-center justify-center bg-zinc-900/10 rounded-[2.5rem] border-2 border-dashed border-zinc-900 shadow-inner">
                        <div className="bg-zinc-900 p-8 rounded-full mb-8 border border-zinc-800">
                           <Search size={56} className="text-zinc-800" strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tight">{t('shop.empty_title')}</h3>
                        <p className="text-zinc-500 mb-10 max-w-sm text-sm font-medium leading-relaxed">{language === 'ru' ? 'Попробуйте изменить параметры поиска или сбросить фильтры для лучшего результата.' : 'Спробуйте змінити параметри пошуку або скинути фільтри для кращого результату.'}</p>
                        <button onClick={handleResetAll} className="bg-yellow-500 text-black px-12 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/10 active:scale-95 flex items-center gap-3">
                           <Trash2 size={16} />
                           {t('shop.reset_filters')}
                        </button>
                    </div>
                  )
              )}

              {isLoading && filteredProducts.length === 0 && (
                <div className="py-40 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
                    <span className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Loading products...</span>
                </div>
              )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shop;
