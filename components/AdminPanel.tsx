
import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { User, Order, Product as ProductUI, MasterProduct, CustomerRequest, MasterBlogPost, Language, AbandonedCart, Category, Review, BlogLocale } from '../types';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { requestService } from '../services/requestService';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';
import { blogService } from '../services/blogService';
import { categoryService } from '../services/categoryService';
import { reviewService } from '../services/reviewService';
import { 
  Package, LogOut, LayoutDashboard, CheckCircle, Trash2, 
  ShoppingBag, Loader2, Inbox, 
  RefreshCw, Search, Plus, FileText, BookOpen, 
  Users, Edit2, X, Save, Globe, Info, Upload, Image as ImageIcon,
  TrendingUp, CreditCard, Clock, ChevronRight, ShoppingCart, Send, AlertCircle, Hash, Tag, Star, MessageSquare, Download, FileSpreadsheet, Play, AlertTriangle, Database, Activity, FolderTree, DollarSign, Calendar
} from 'lucide-react';

interface AdminPanelProps {
  user: User;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'blog' | 'requests' | 'reviews'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<MasterProduct[]>([]);
  const [blogPosts, setBlogPosts] = useState<MasterBlogPost[]>([]);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<MasterBlogPost> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<MasterProduct> | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<Language>('ru');

  useEffect(() => {
    refreshAllData();
  }, [activeTab]);

  const refreshAllData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
        const [o, p, b, r, c, rev] = await Promise.all([
            orderService.getAll(),
            productService.getAllMaster(),
            blogService.getAllMaster(),
            requestService.getAll(),
            categoryService.getAll('ru'),
            reviewService.getAll()
        ]);
        setOrders(o);
        setProducts(p);
        setBlogPosts(b);
        setRequests(r);
        setAvailableCategories(c);
        setReviews(rev);
    } catch (e: any) {
        setErrorMsg("Ошибка синхронизации данных: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  const handleSaveReview = async () => {
    if (!editingReview?.productId || !editingReview?.userName || !editingReview?.comment) {
        alert("Заполните основные поля (Товар, Имя, Текст)");
        return;
    }
    setLoading(true);
    try {
        await reviewService.adminUpsertReview(editingReview);
        setIsReviewModalOpen(false);
        refreshAllData();
    } catch (e: any) {
        alert(e.message);
    } finally {
        setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (confirm('Удалить отзыв навсегда?')) {
        await reviewService.deleteReview(id);
        refreshAllData();
    }
  };

  const handleImportXLS = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const newProducts: Partial<MasterProduct>[] = data.map((row: any) => ({
          sku: String(row.sku || row.SKU || '').trim(),
          price: Number(row.price || row.Price || 0),
          category: row.category || 'motor-oil',
          volume: row.volume || '1L',
          image: row.image || '',
          inStock: true,
          locales: {
            ru: { name: row.name_ru || 'Untitled', description: row.desc_ru || '', specifications: {}, seo: {} },
            uk: { name: row.name_uk || row.name_ru || 'Untitled', description: row.desc_uk || '', specifications: {}, seo: {} }
          }
        }));

        await productService.upsertProducts(newProducts);
        alert(`Импорт завершен: ${newProducts.length} товаров.`);
        refreshAllData();
      } catch (err: any) {
        alert("Ошибка импорта: " + err.message);
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveBlogPost = async () => {
    if (!editingPost?.id || !editingPost?.locales?.ru?.title) {
        alert("Заполните ID и заголовок RU");
        return;
    }
    setLoading(true);
    try {
        await blogService.upsertPost(editingPost as MasterBlogPost);
        setIsBlogModalOpen(false);
        refreshAllData();
    } catch (e: any) {
        alert(e.message);
    } finally {
        setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.sku) return;
    setLoading(true);
    try {
        await productService.upsertProducts([editingProduct as MasterProduct]);
        setIsProductModalOpen(false);
        refreshAllData();
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  };

  const deleteBlogPost = async (id: string) => {
    if (confirm('Удалить статью навсегда?')) {
        await blogService.deletePost(id);
        refreshAllData();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans">
      <aside className="w-64 bg-black border-r border-zinc-800 flex flex-col fixed h-full z-20">
         <div className="p-6 border-b border-zinc-800">
            <div className="text-yellow-500 font-black text-2xl italic tracking-tighter">BARDAHL <span className="text-white text-[10px] font-normal not-italic tracking-normal bg-zinc-800 px-2 py-0.5 rounded ml-2">ADMIN</span></div>
         </div>
         <nav className="flex-1 p-4 space-y-1">
            {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Дашборд' },
                { id: 'orders', icon: Package, label: 'Заказы' },
                { id: 'products', icon: ShoppingBag, label: 'Товары' },
                { id: 'blog', icon: BookOpen, label: 'Блог / Статьи' },
                { id: 'reviews', icon: MessageSquare, label: 'Отзывы' },
                { id: 'requests', icon: Inbox, label: 'Заявки' }
            ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all uppercase text-[10px] tracking-widest ${activeTab === tab.id ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                    <tab.icon size={18} />
                    {tab.label}
                </button>
            ))}
         </nav>
         <div className="p-4 border-t border-zinc-800">
             <button onClick={onLogout} className="flex items-center gap-2 text-zinc-500 hover:text-red-500 w-full px-4 py-2 transition-colors font-bold text-xs uppercase"><LogOut size={16} /> Выйти</button>
         </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">{activeTab}</h1>
            <div className="flex gap-3">
                {activeTab === 'products' && (
                    <>
                        <input type="file" ref={fileInputRef} onChange={handleImportXLS} accept=".xlsx,.xls,.csv" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-zinc-800 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-zinc-700 transition-all"><FileSpreadsheet size={16} /> Импорт XLS</button>
                        <button onClick={() => { setEditingProduct({ sku: '', price: 0, category: 'motor-oil', locales: { ru: { name: '', description: '', specifications: {}, seo: {} }, uk: { name: '', description: '', specifications: {}, seo: {} } } }); setIsProductModalOpen(true); }} className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg"><Plus size={16} /> Добавить товар</button>
                    </>
                )}
                {activeTab === 'blog' && (
                    <button onClick={() => { setEditingPost({ id: '', date: new Date().toISOString().split('T')[0], locales: { ru: { title: '', preview: '', readMore: '' }, uk: { title: '', preview: '', readMore: '' } } }); setIsBlogModalOpen(true); }} className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95"><Plus size={16} /> Создать статью</button>
                )}
                {activeTab === 'reviews' && (
                    <button onClick={() => { setEditingReview({ productId: products[0]?.id || '', userName: '', rating: 5, date: new Date().toISOString().split('T')[0], comment: '' }); setIsReviewModalOpen(true); }} className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95"><Plus size={16} /> Добавить отзыв</button>
                )}
                <button onClick={refreshAllData} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
            </div>
         </div>

         {errorMsg && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                 <AlertCircle size={18} /> {errorMsg}
             </div>
         )}

         {loading && !isBlogModalOpen && !isProductModalOpen && !isReviewModalOpen ? (
             <div className="py-24 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-yellow-500" size={48} /></div>
         ) : (
            <div className="animate-in fade-in duration-500">
                {activeTab === 'blog' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogPosts.map(post => (
                            <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:border-yellow-500/30 transition-all flex flex-col">
                                <div className="h-44 bg-zinc-800 overflow-hidden relative">
                                    <img src={post.image} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="" />
                                    <div className="absolute top-4 left-4 bg-black/80 text-white text-[8px] font-black uppercase px-2 py-1 rounded">{post.date}</div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-white font-black uppercase italic tracking-tight mb-4 line-clamp-2">{post.locales.ru.title}</h3>
                                    <div className="flex gap-2 mt-auto pt-4 border-t border-zinc-800">
                                        <button onClick={() => { setEditingPost(post); setIsBlogModalOpen(true); }} className="flex-1 bg-zinc-800 hover:bg-yellow-500 hover:text-black text-white py-2.5 rounded-xl text-[9px] font-black uppercase transition-all">Редактировать</button>
                                        <button onClick={() => deleteBlogPost(post.id)} className="p-2.5 bg-zinc-800 text-zinc-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(p => (
                            <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col hover:border-yellow-500/20 transition-all">
                                <div className="h-48 bg-white p-6 flex items-center justify-center relative">
                                    <img src={p.image} className="max-h-full object-contain" alt="" />
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-[8px] font-mono px-2 py-0.5 rounded">{p.sku}</div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{p.locales.ru.name}</h3>
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase mb-4">{p.category}</div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-yellow-500 font-black text-lg">{p.price} ₴</div>
                                        <div className="flex gap-1">
                                            <button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="p-2 bg-zinc-800 hover:bg-yellow-500 hover:text-black rounded-lg transition-colors"><Edit2 size={14}/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/50 text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800">
                                    <th className="p-5">Товар</th>
                                    <th className="p-5">Клиент / Рейтинг</th>
                                    <th className="p-5">Дата</th>
                                    <th className="p-5">Комментарий</th>
                                    <th className="p-5">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {reviews.map(rev => {
                                    const prod = products.find(p => p.id === rev.productId);
                                    return (
                                        <tr key={rev.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-white rounded p-1 flex-shrink-0"><img src={prod?.image} className="w-full h-full object-contain" /></div>
                                                    <div className="text-[11px] font-bold text-zinc-300 max-w-[150px] truncate">{prod?.locales.ru.name || rev.productId}</div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="font-bold text-white text-sm">{rev.userName}</div>
                                                <div className="flex text-yellow-500 mt-1">
                                                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} />)}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="text-zinc-500 text-xs font-mono">{rev.date}</div>
                                            </td>
                                            <td className="p-5">
                                                <p className="text-zinc-400 text-xs line-clamp-2 max-w-md italic">"{rev.comment}"</p>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setEditingReview(rev); setIsReviewModalOpen(true); }} className="p-2 bg-zinc-800 hover:bg-yellow-500 hover:text-black rounded-lg transition-all"><Edit2 size={14} /></button>
                                                    <button onClick={() => deleteReview(rev.id)} className="p-2 bg-zinc-800 hover:bg-red-500 hover:text-white rounded-lg transition-all"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {reviews.length === 0 && (
                            <div className="p-20 text-center text-zinc-500 uppercase font-black tracking-widest text-xs">Отзывов пока нет</div>
                        )}
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
                            <div className="text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-4">Статей в блоге</div>
                            <div className="text-5xl font-black text-white italic">{blogPosts.length}</div>
                        </div>
                        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
                            <div className="text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-4">Товаров в базе</div>
                            <div className="text-5xl font-black text-yellow-500 italic">{products.length}</div>
                        </div>
                        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
                            <div className="text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-4">Заказов за период</div>
                            <div className="text-5xl font-black text-white italic">{orders.length}</div>
                        </div>
                    </div>
                )}
            </div>
         )}
      </main>

      {/* REVIEW MODAL */}
      {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsReviewModalOpen(false)} />
              <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                  <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                      <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2"><MessageSquare className="text-yellow-500" /> Редактор отзыва</h2>
                      <button onClick={() => setIsReviewModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Выберите товар</label>
                          <select 
                            value={editingReview?.productId} 
                            onChange={e => setEditingReview({...editingReview!, productId: e.target.value})} 
                            className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white font-bold focus:border-yellow-500 outline-none appearance-none"
                          >
                            {products.map(p => <option key={p.id} value={p.id}>{p.sku} | {p.locales.ru.name}</option>)}
                          </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Имя клиента</label>
                            <input type="text" value={editingReview?.userName} onChange={e => setEditingReview({...editingReview!, userName: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white font-bold focus:border-yellow-500 outline-none" placeholder="Александр" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Дата публикации</label>
                            <div className="relative">
                                <input type="date" value={editingReview?.date} onChange={e => setEditingReview({...editingReview!, date: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white font-mono text-sm focus:border-yellow-500 outline-none" />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={16} />
                            </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Рейтинг (1-5)</label>
                          <div className="flex gap-4 items-center bg-black border border-zinc-800 p-4 rounded-xl">
                              {[1,2,3,4,5].map(star => (
                                  <button key={star} onClick={() => setEditingReview({...editingReview!, rating: star})} className={`transition-all ${editingReview?.rating! >= star ? 'text-yellow-500 scale-125' : 'text-zinc-800'}`}>
                                      <Star size={24} fill={editingReview?.rating! >= star ? "currentColor" : "none"} />
                                  </button>
                              ))}
                              <span className="ml-auto text-white font-black text-xl italic">{editingReview?.rating}.0</span>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Текст отзыва</label>
                          <textarea rows={4} value={editingReview?.comment} onChange={e => setEditingReview({...editingReview!, comment: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-300 text-sm leading-relaxed focus:border-yellow-500 outline-none" placeholder="Ваш отзыв..." />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-green-500 tracking-widest ml-1">Плюсы</label>
                            <input type="text" value={editingReview?.pros} onChange={e => setEditingReview({...editingReview!, pros: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-400 text-xs outline-none focus:border-green-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-red-500 tracking-widest ml-1">Минусы</label>
                            <input type="text" value={editingReview?.cons} onChange={e => setEditingReview({...editingReview!, cons: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-400 text-xs outline-none focus:border-red-500" />
                        </div>
                      </div>
                  </div>
                  <div className="p-6 border-t border-zinc-800 bg-zinc-900 flex justify-end gap-3">
                      <button onClick={() => setIsReviewModalOpen(false)} className="px-6 py-3 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest">Отмена</button>
                      <button onClick={handleSaveReview} className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] shadow-xl flex items-center gap-2 active:scale-95 transition-all"><Save size={16}/> Сохранить отзыв</button>
                  </div>
              </div>
          </div>
      )}

      {/* BLOG MODAL */}
      {isBlogModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsBlogModalOpen(false)} />
              <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                  <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                      <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2"><BookOpen className="text-yellow-500" /> Редактор статьи</h2>
                      <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl">
                          {['ru', 'uk'].map(l => <button key={l} onClick={() => setActiveLangTab(l as any)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeLangTab === l ? 'bg-yellow-500 text-black' : 'text-zinc-500'}`}>{l}</button>)}
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">ID (URL Slug)</label>
                            <input type="text" value={editingPost?.id} onChange={e => setEditingPost({...editingPost!, id: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white font-mono text-sm focus:border-yellow-500 outline-none" placeholder="how-to-fix" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Обложка (URL)</label>
                            <input type="text" value={editingPost?.image} onChange={e => setEditingPost({...editingPost!, image: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white text-sm focus:border-yellow-500 outline-none" placeholder="https://..." />
                        </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Заголовок ({activeLangTab})</label>
                          <input type="text" value={editingPost?.locales?.[activeLangTab]?.title} onChange={e => { const loc = {...editingPost!.locales!}; loc[activeLangTab].title = e.target.value; setEditingPost({...editingPost!, locales: loc}); }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white font-bold focus:border-yellow-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Превью текст</label>
                          <textarea rows={2} value={editingPost?.locales?.[activeLangTab]?.preview} onChange={e => { const loc = {...editingPost!.locales!}; loc[activeLangTab].preview = e.target.value; setEditingPost({...editingPost!, locales: loc}); }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-400 text-sm focus:border-yellow-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Полный текст</label>
                          <textarea rows={10} value={editingPost?.locales?.[activeLangTab]?.readMore} onChange={e => { const loc = {...editingPost!.locales!}; loc[activeLangTab].readMore = e.target.value; setEditingPost({...editingPost!, locales: loc}); }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-zinc-300 text-sm leading-relaxed focus:border-yellow-500 outline-none" />
                      </div>
                  </div>
                  <div className="p-6 border-t border-zinc-800 bg-zinc-900 flex justify-end gap-3">
                      <button onClick={() => setIsBlogModalOpen(false)} className="px-6 py-3 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest">Отмена</button>
                      <button onClick={handleSaveBlogPost} className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] shadow-xl flex items-center gap-2 active:scale-95 transition-all"><Save size={16}/> Сохранить и опубликовать</button>
                  </div>
              </div>
          </div>
      )}

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in" onClick={() => setIsProductModalOpen(false)} />
              <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
                  <h2 className="text-2xl font-black text-white mb-8 uppercase italic border-l-4 border-yellow-500 pl-4">Товар: {editingProduct?.sku || 'Новый артикул'}</h2>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">SKU / Артикул</label>
                              <input type="text" placeholder="SKU" value={editingProduct?.sku} onChange={e => setEditingProduct({...editingProduct!, sku: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white font-mono focus:border-yellow-500 outline-none" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Цена (₴)</label>
                              <input type="number" placeholder="Цена" value={editingProduct?.price} onChange={e => setEditingProduct({...editingProduct!, price: Number(e.target.value)})} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white font-black focus:border-yellow-500 outline-none" />
                          </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Категория</label>
                              <select value={editingProduct?.category} onChange={e => setEditingProduct({...editingProduct!, category: e.target.value})} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white outline-none appearance-none focus:border-yellow-500">
                                  {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                              </select>
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Изображение (URL)</label>
                              <input type="text" value={editingProduct?.image} onChange={e => setEditingProduct({...editingProduct!, image: e.target.value})} placeholder="https://..." className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white text-xs focus:border-yellow-500 outline-none" />
                          </div>
                      </div>
                      <div className="space-y-2 pt-4 border-t border-zinc-800">
                          <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl w-fit mb-4">
                              {['ru', 'uk'].map(l => <button key={l} onClick={() => setActiveLangTab(l as any)} className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${activeLangTab === l ? 'bg-yellow-500 text-black' : 'text-zinc-500'}`}>{l}</button>)}
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Название товара ({activeLangTab})</label>
                              <input type="text" value={editingProduct?.locales?.[activeLangTab]?.name} onChange={e => {
                                  const locs = {...editingProduct!.locales!};
                                  locs[activeLangTab].name = e.target.value;
                                  setEditingProduct({...editingProduct!, locales: locs});
                              }} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-white font-bold focus:border-yellow-500 outline-none" />
                          </div>
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-8 border-t border-zinc-800 mt-6 bg-zinc-950">
                      <button onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Отмена</button>
                      <button onClick={handleSaveProduct} className="bg-yellow-500 text-black px-10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2"><Save size={16}/> Сохранить товар</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminPanel;
