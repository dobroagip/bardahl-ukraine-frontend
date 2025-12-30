
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Review, ProductVariant } from '../types';
import Breadcrumbs from './Breadcrumbs'; 
import { reviewService } from '../services/reviewService';
import { 
  ShoppingCart, Star, Truck, ShieldCheck, 
  Minus, Plus, Zap, Box, HelpCircle, ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SeoHead from './SeoHead';
import FAQ from './FAQ';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductSelect: (product: Product) => void;
  onOneClickBuy: (product: Product) => void;
  onBack: () => void;
  onGoHome: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onProductSelect, onOneClickBuy, onBack, onGoHome }) => {
  const { t, language, products } = useLanguage();
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [qty, setQty] = useState(1);
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.find(v => v.volume === product.volume) || null
  );
  const [isPriceAnimating, setIsPriceAnimating] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ count: 0, average: 0 });

  const recommendedProducts = useMemo(() => {
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  useEffect(() => {
    const fetchReviews = async () => {
        const r = await reviewService.getReviews(product.id);
        const s = await reviewService.getStats(product.id);
        setReviews(r);
        setStats(s);
    };
    fetchReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentVolume = selectedVariant ? selectedVariant.volume : product.volume;

  const handleVariantSelect = (v: ProductVariant) => {
    if (v.volume === currentVolume) return;
    setIsPriceAnimating(true);
    setSelectedVariant(v);
    setTimeout(() => setIsPriceAnimating(false), 500);
  };

  const handleAddToCart = () => {
    const cartProduct = { ...product, price: currentPrice, sku: currentSku, volume: currentVolume };
    for(let i=0; i<qty; i++) { onAddToCart(cartProduct); }
  };

  const labels = {
      ru: { country: 'Бельгия', original: 'Оригинальное качество', volume: 'Выберите объем', price: 'Актуальная цена', today: 'В день заказа до 15:00', warranty: 'Гарантия от импортера', recommended: 'С этим товаром покупают' },
      uk: { country: 'Бельгія', original: 'Оригінальна якість', volume: 'Оберіть об\'єм', price: 'Актуальна ціна', today: 'В день замовлення до 15:00', warranty: 'Гарантія від імпортера', recommended: 'З цим товаром купують' }
  }[language] || { country: 'Belgium', original: 'Original Quality', volume: 'Select Volume', price: 'Current Price', today: 'Same day shipping', warranty: 'Importer Warranty', recommended: 'Recommended Products' };

  const specs = product.specifications || {
    [language === 'ru' ? 'Вязкость' : 'В\'язкість']: product.viscosity || '-',
    [language === 'ru' ? 'Объем' : 'Об\'єм']: currentVolume,
    [language === 'ru' ? 'Тип' : 'Тип']: 'Синтетика',
    [language === 'ru' ? 'Страна' : 'Країна']: labels.country
  };

  return (
    <article className="animate-in fade-in duration-700 pb-24 lg:pb-32 bg-zinc-950 text-white min-h-screen">
       <SeoHead 
          type="product" 
          title={product.seo?.title || product.name} 
          description={product.seo?.description || product.description} 
          keywords={product.seo?.keywords}
          image={product.image} 
          price={currentPrice} 
          sku={currentSku} 
          categoryName={product.category} 
          path={`/product/${product.id}`} 
       />

       <div className="container mx-auto px-4 py-4 lg:py-6">
          <Breadcrumbs items={[{ label: 'Bardahl', onClick: onGoHome }, { label: product.category, onClick: onBack }, { label: product.name, isActive: true }]} />
       </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 items-start">
          <div className="w-full lg:w-[45%] xl:w-[48%] lg:sticky lg:top-32">
             <div className="bg-white rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl aspect-square flex items-center justify-center p-12 md:p-20 relative group">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-6 right-6 z-20"><div className="bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-2xl flex items-center gap-2"><ShieldCheck size={14} className="text-yellow-500" /><span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">{labels.original}</span></div></div>
             </div>
          </div>

          <div className="flex-1 w-full pt-4 lg:pt-0">
            <div className="max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 shadow-inner">
                         <div className="flex text-yellow-500">{[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i < Math.round(stats.average || 5) ? "currentColor" : "none"} />)}</div>
                         <span className="text-white text-[10px] font-black tracking-widest">{stats.average || '5.0'}</span>
                         <span className="text-zinc-500 text-[10px]">({stats.count})</span>
                    </div>
                    <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">SKU: {currentSku}</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter leading-[1.1]">{product.name}</h1>
                <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800/80 p-6 lg:p-8 rounded-3xl mb-8 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-6">
                        <div><span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] block mb-2">{labels.price}</span><div className={`text-4xl lg:text-5xl font-black leading-none flex items-baseline gap-2 ${isPriceAnimating ? 'text-yellow-400' : 'text-white'}`}>{currentPrice.toLocaleString()} <span className="text-base text-zinc-600 font-bold">₴</span></div></div>
                        <div className="flex items-center bg-black border border-zinc-800 rounded-xl h-12 p-1 group"><button onClick={() => setQty(Math.max(1, qty-1))} className="w-10 h-full flex items-center justify-center hover:bg-zinc-800 rounded-lg transition-all text-zinc-600 hover:text-white"><Minus size={14} /></button><input type="number" value={qty} readOnly className="w-12 bg-transparent text-center font-black text-white outline-none text-base" /><button onClick={() => setQty(qty+1)} className="w-10 h-full flex items-center justify-center hover:bg-zinc-800 rounded-lg transition-all text-zinc-600 hover:text-white"><Plus size={14} /></button></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3"><button onClick={handleAddToCart} className="sm:col-span-8 bg-yellow-500 hover:bg-yellow-400 text-black h-14 lg:h-16 rounded-xl font-black text-lg uppercase italic tracking-tighter flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] group/btn"><ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" strokeWidth={3} /> {t('product.buy')}</button><button onClick={() => onOneClickBuy({...product, price: currentPrice, volume: currentVolume, sku: currentSku})} className="sm:col-span-4 bg-zinc-800 hover:bg-zinc-700 text-white h-14 lg:h-16 rounded-xl font-black text-[10px] uppercase tracking-widest flex flex-col items-center justify-center border border-zinc-700 active:scale-[0.98] group/fast"><Zap size={18} className="fill-yellow-500 text-yellow-500 group-hover/fast:scale-110 transition-transform" /> {t('product.one_click')}</button></div>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
            <div className="flex border-b border-zinc-900 gap-8 lg:gap-12 overflow-x-auto no-scrollbar">
                {[ { id: 'desc', label: t('product.tab_desc') }, { id: 'specs', label: t('product.tab_specs') }, { id: 'reviews', label: `${t('product.tab_reviews')} (${stats.count})` } ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-yellow-500 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}>{tab.label}</button>
                ))}
            </div>
            <div className="py-10 lg:py-16">
                {activeTab === 'desc' && (<div className="max-w-4xl animate-in fade-in"><p className="text-zinc-400 leading-relaxed text-base lg:text-lg font-medium">{product.description}</p></div>)}
                {activeTab === 'specs' && (<div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in">{Object.entries(specs).map(([k, v]) => (<div key={k} className="flex border-b border-zinc-800 last:border-0 hover:bg-black/20 transition-colors"><div className="w-1/3 p-4 text-[9px] uppercase font-black text-zinc-500">{k}</div><div className="flex-1 p-4 text-xs font-bold text-zinc-200">{v}</div></div>))}</div>)}
                {activeTab === 'reviews' && (
                   <div className="space-y-6 max-w-4xl animate-in fade-in">
                      {reviews.length > 0 ? (
                        reviews.map((rev) => (
                           <div key={rev.id} className="bg-zinc-900/30 border border-zinc-800 p-6 lg:p-8 rounded-2xl group hover:border-yellow-500/20 transition-all">
                              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-yellow-500 font-black text-xl italic">{rev.userName[0]}</div>
                                    <div><div className="flex items-center gap-3 mb-1"><h4 className="text-white font-bold text-base leading-none">{rev.userName}</h4><div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] font-black uppercase tracking-widest"><CheckCircle2 size={10} /> {t('product.buyer')}</div></div><div className="flex items-center gap-4"><div className="flex text-yellow-500">{[...Array(5)].map((_, i) => (<Star key={i} size={11} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-zinc-800"} />))}</div><span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{rev.date}</span></div></div>
                                 </div>
                              </div>
                              <p className="text-zinc-300 text-sm lg:text-base leading-relaxed mb-6 italic pl-4 border-l-2 border-zinc-800">"{rev.comment}"</p>
                              {(rev.pros || rev.cons) && (
                                <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-800/50">
                                    {rev.pros && (<div><div className="flex items-center gap-2 text-green-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2"><ThumbsUp size={12} /> {t('product.pros')}</div><p className="text-zinc-400 text-xs font-medium">{rev.pros}</p></div>)}
                                    {rev.cons && (<div><div className="flex items-center gap-2 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2"><ThumbsDown size={12} /> {t('product.cons')}</div><p className="text-zinc-400 text-xs font-medium">{rev.cons}</p></div>)}
                                </div>
                              )}
                           </div>
                        ))
                      ) : (<div className="py-16 text-center text-zinc-700 border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center"><MessageSquare className="mb-4 opacity-10" size={48} /><p className="font-bold uppercase tracking-widest text-xs">{t('product.no_reviews')}</p></div>)}
                   </div>
                )}
            </div>
        </div>
      </div>
    </article>
  );
};

export default ProductDetail;
