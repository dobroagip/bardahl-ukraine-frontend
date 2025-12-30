
import React, { useState, useEffect } from 'react';
import { User, Order, Car } from '../types';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { 
  User as UserIcon, Package, Car as CarIcon, LogOut, 
  Clock, MapPin, ChevronRight, Loader2, Plus, Trash2, 
  Edit2, Check, Truck, ShoppingBag, ArrowRight, RefreshCw,
  Box, CreditCard, ShieldCheck, LayoutDashboard
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UserCabinetProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: any) => void;
  onUserUpdate: (user: User) => void;
  onAddToCart?: (item: any) => void;
}

const UserCabinet: React.FC<UserCabinetProps> = ({ user, onLogout, onNavigate, onUserUpdate, onAddToCart }) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'shipping' | 'garage' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Shipping Form
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [shippingForm, setShippingForm] = useState(user.defaultShipping || {
    city: '',
    deliveryMethod: 'nova_poshta_dept',
    addressOrDept: ''
  });
  const [savingShipping, setSavingShipping] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      orderService.getByUser(user.id).then(data => {
        setOrders(data);
        setLoadingOrders(false);
      });
    }
  }, [activeTab, user.id]);

  const handleSaveShipping = async () => {
    setSavingShipping(true);
    try {
      const updatedUser = await authService.updateUser({ ...user, defaultShipping: shippingForm });
      onUserUpdate(updatedUser);
      setIsEditingShipping(false);
    } catch (e) {
      alert('Ошибка сохранения');
    } finally {
      setSavingShipping(false);
    }
  };

  const handleRepeatOrder = (order: Order) => {
    if (!onAddToCart) return;
    order.items.forEach(item => onAddToCart(item));
    onNavigate('shop');
  };

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP USER BANNER */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 md:p-10 mb-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
           
           <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-1 rotate-3 shadow-2xl">
                 <div className="w-full h-full bg-zinc-950 rounded-[1.4rem] flex items-center justify-center text-white font-black text-4xl md:text-5xl italic border border-white/10">
                   {user.firstName[0]}
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-zinc-900 border border-zinc-800 p-2 rounded-xl shadow-xl">
                 <ShieldCheck size={20} className="text-yellow-500" />
              </div>
           </div>

           <div className="text-center md:text-left flex-1 z-10">
             <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                   {user.firstName} {user.lastName || ''}
                </h1>
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0">
                   Platinum Member
                </span>
             </div>
             <p className="text-zinc-500 font-medium text-lg mb-6">{user.email}</p>
             
             <div className="flex flex-wrap justify-center md:justify-start gap-3">
               <div className="bg-black/50 backdrop-blur-md border border-zinc-800 px-5 py-2 rounded-2xl text-xs flex items-center gap-2">
                  <Box size={16} className="text-yellow-500" />
                  <span className="text-white font-black">{orders.length}</span>
                  <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">{language === 'ru' ? 'Заказов' : 'Замовлень'}</span>
               </div>
               <button onClick={onLogout} className="text-zinc-400 hover:text-red-500 transition-all bg-black/50 border border-zinc-800 px-5 py-2 rounded-2xl text-xs flex items-center gap-2 hover:bg-red-500/5 group">
                 <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> {t('cabinet.logout')}
               </button>
             </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDE NAV */}
          <div className="lg:w-64 flex-shrink-0">
             <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-3 sticky top-24 shadow-xl">
                {[
                  { id: 'orders', label: language === 'ru' ? 'Заказы' : 'Замовлення', icon: Package },
                  { id: 'shipping', label: language === 'ru' ? 'Доставка' : 'Доставка', icon: Truck },
                  { id: 'garage', label: language === 'ru' ? 'Гараж' : 'Гараж', icon: CarIcon },
                  { id: 'profile', label: language === 'ru' ? 'Профиль' : 'Профіль', icon: UserIcon },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all mb-1 ${
                      activeTab === tab.id 
                      ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/10' 
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}

                {/* ADMIN SHORTCUT */}
                {user.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all mt-4 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-black shadow-lg shadow-yellow-500/5"
                  >
                    <LayoutDashboard size={20} />
                    {language === 'ru' ? 'Админ-панель' : 'Адмін-панель'}
                  </button>
                )}
             </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            
            {activeTab === 'orders' && (
              <div className="space-y-6">
                 <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">{language === 'ru' ? 'Мои покупки' : 'Мої покупки'}</h2>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">Всего: {orders.length}</div>
                 </div>
                 
                 {loadingOrders ? (
                   <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-800">
                      <Loader2 className="animate-spin text-yellow-500 mb-4" size={40} />
                      <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Синхронизация...</span>
                   </div>
                 ) : orders.length === 0 ? (
                   <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-12 text-center">
                      <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700/50">
                        <ShoppingBag size={32} className="text-zinc-600" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Здесь пока пусто</h3>
                      <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Самое время обновить масло или добавить присадку для защиты двигателя.</p>
                      <button onClick={() => onNavigate('shop')} className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-wider transition-all active:scale-95 shadow-xl shadow-yellow-500/10 flex items-center gap-3 mx-auto">
                        В магазин <ArrowRight size={18} />
                      </button>
                   </div>
                 ) : (
                   orders.map(order => (
                     <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all shadow-lg">
                        <div className="p-6 border-b border-zinc-800 bg-black/40 flex flex-wrap items-center justify-between gap-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-yellow-500 border border-zinc-700"><Package size={24}/></div>
                              <div>
                                 <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Заказ #{order.id.slice(-6)}</div>
                                 <div className="text-white font-black text-xl italic tracking-tighter">{order.total.toLocaleString()} UAH</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                 {order.status}
                              </span>
                              <div className="bg-zinc-800 px-3 py-1.5 rounded-xl text-zinc-400 text-xs font-bold flex items-center gap-2">
                                 <Clock size={14} /> {new Date(order.date).toLocaleDateString()}
                              </div>
                           </div>
                        </div>
                        <div className="p-6 grid md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              {order.items.map((item, i) => (
                                 <div key={i} className="flex items-center gap-4 bg-black/30 p-2 rounded-2xl border border-zinc-800/50">
                                    <div className="w-10 h-10 bg-white rounded-xl p-1 flex-shrink-0"><img src={item.image} className="w-full h-full object-contain" /></div>
                                    <div className="flex-1 min-w-0">
                                       <div className="text-white font-bold text-xs truncate">{item.name}</div>
                                       <div className="text-zinc-500 text-[9px] uppercase font-black">{item.quantity} шт • {item.price} ₴</div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <div className="flex flex-col justify-between gap-4">
                              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                                 <div className="flex items-center gap-2 text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-2"><MapPin size={12}/> Доставка</div>
                                 <p className="text-zinc-300 text-xs font-bold">{order.customer.city}, {order.customer.comment}</p>
                              </div>
                              <button onClick={() => handleRepeatOrder(order)} className="w-full bg-zinc-800 hover:bg-yellow-500 hover:text-black text-white font-black uppercase tracking-widest text-[10px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group">
                                 <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> Повторить покупку
                              </button>
                           </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>
            )}

            {activeTab === 'shipping' && (
               <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                       <h2 className="text-3xl font-black text-white italic uppercase tracking-tight mb-2">Данные для отправки</h2>
                       <p className="text-zinc-500 text-sm">Ваш адрес будет сохранен для будущих заказов</p>
                    </div>
                    {!isEditingShipping && (
                        <button onClick={() => setIsEditingShipping(true)} className="bg-zinc-800 hover:bg-yellow-500 hover:text-black text-yellow-500 px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
                           <Edit2 size={16} /> Изменить
                        </button>
                    )}
                 </div>
                 
                 {isEditingShipping ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
                       <div className="space-y-2">
                          <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-2">Город доставки</label>
                          <input type="text" value={shippingForm.city} onChange={e => setShippingForm({...shippingForm, city: e.target.value})} placeholder="Киев" className="w-full bg-black border border-zinc-700 p-4 rounded-2xl text-white font-bold focus:border-yellow-500 outline-none transition-all" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-2">Служба</label>
                          <select value={shippingForm.deliveryMethod} onChange={e => setShippingForm({...shippingForm, deliveryMethod: e.target.value as any})} className="w-full bg-black border border-zinc-700 p-4 rounded-2xl text-white font-bold focus:border-yellow-500 outline-none appearance-none">
                             <option value="nova_poshta_dept">Новая Почта (Отделение)</option>
                             <option value="courier">Курьер (по адресу)</option>
                             <option value="pickup">Самовывоз (Одесса)</option>
                          </select>
                       </div>
                       <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-2">Адрес или № отделения</label>
                          <input type="text" value={shippingForm.addressOrDept} onChange={e => setShippingForm({...shippingForm, addressOrDept: e.target.value})} placeholder="Отделение №..." className="w-full bg-black border border-zinc-700 p-4 rounded-2xl text-white font-bold focus:border-yellow-500 outline-none transition-all" />
                       </div>
                       <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                          <button onClick={() => setIsEditingShipping(false)} className="px-6 py-4 text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-[10px]">Отмена</button>
                          <button onClick={handleSaveShipping} disabled={savingShipping} className="px-10 py-4 bg-yellow-500 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-yellow-400 flex items-center gap-2 shadow-xl shadow-yellow-500/10 active:scale-95 transition-all">
                             {savingShipping ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />} Сохранить
                          </button>
                       </div>
                    </div>
                 ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                       <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-3xl group hover:border-yellow-500/30 transition-colors">
                          <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-4">Основной город</div>
                          <div className="flex items-center gap-4"><MapPin className="text-yellow-500" size={24} /><span className="text-white font-black text-xl">{user.defaultShipping?.city || 'Не указан'}</span></div>
                       </div>
                       <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-3xl group hover:border-yellow-500/30 transition-colors">
                          <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-4">Способ</div>
                          <div className="flex items-center gap-4"><Truck className="text-blue-500" size={24} /><span className="text-white font-black text-sm uppercase">{user.defaultShipping?.deliveryMethod.replace(/_/g, ' ') || '-'}</span></div>
                       </div>
                       <div className="bg-zinc-950/50 border border-zinc-800 p-6 rounded-3xl group hover:border-yellow-500/30 transition-colors">
                          <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-4">Пункт выдачи</div>
                          <div className="flex items-center gap-4"><Box className="text-green-500" size={24} /><span className="text-white font-black text-sm truncate">{user.defaultShipping?.addressOrDept || 'Не указан'}</span></div>
                       </div>
                    </div>
                 )}
               </div>
            )}

            {activeTab === 'profile' && (
               <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12">
                 <h2 className="text-3xl font-black text-white italic uppercase tracking-tight mb-10">Личные данные</h2>
                 <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-1">
                       <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-2">Ваше имя</label>
                       <div className="bg-black border border-zinc-800 p-4 rounded-2xl text-white font-bold">{user.firstName}</div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-2">Фамилия</label>
                       <div className="bg-black border border-zinc-800 p-4 rounded-2xl text-white font-bold">{user.lastName || '-'}</div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-2">Email (ID)</label>
                       <div className="bg-zinc-800/30 border border-zinc-800 p-4 rounded-2xl text-zinc-500 font-bold">{user.email}</div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest ml-2">Телефон</label>
                       <div className="bg-black border border-zinc-800 p-4 rounded-2xl text-white font-bold">{user.phone || '-'}</div>
                    </div>
                 </div>
                 <div className="pt-8 border-t border-zinc-800 flex justify-between items-center">
                    <button className="text-red-500/40 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors">Удалить профиль</button>
                    <button className="bg-zinc-800 text-zinc-400 hover:text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Сменить пароль</button>
                 </div>
               </div>
            )}

            {activeTab === 'garage' && (
               <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Ваш гараж</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                     <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all cursor-pointer group">
                        <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:bg-yellow-500 group-hover:text-black transition-all"><Plus size={32} /></div>
                        <span className="font-black uppercase tracking-widest text-[10px] text-zinc-500 group-hover:text-white">Добавить авто</span>
                     </div>
                  </div>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCabinet;
