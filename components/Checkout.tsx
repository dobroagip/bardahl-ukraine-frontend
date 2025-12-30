
import React, { useState, useEffect } from 'react';
import { CartItem, CustomerDetails } from '../types';
import { User, Phone, Mail, MapPin, Truck, CreditCard, CheckCircle, ArrowLeft, Package, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CustomerDetailsSchema } from '../schemas/validationSchemas';

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onPlaceOrder: (details: CustomerDetails) => void;
  onBack: () => void;
  onGuestUpdate?: (details: CustomerDetails) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, total, onPlaceOrder, onBack, onGuestUpdate }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    deliveryMethod: 'nova_poshta_dept',
    paymentMethod: 'cod',
    comment: '',
    honeypot: '' 
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  useEffect(() => {
    if (formData.email && onGuestUpdate) {
      onGuestUpdate(formData);
    }
  }, [formData, onGuestUpdate]);

  const validate = () => {
    const result = CustomerDetailsSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onPlaceOrder(formData);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerDetails]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = (fieldName: keyof CustomerDetails) => `
    flex items-center bg-black border rounded-xl px-4 py-3.5 transition-all
    ${errors[fieldName] ? 'border-red-500 bg-red-500/5' : 'border-zinc-800 focus-within:border-yellow-500'}
  `;

  return (
    <div className="min-h-screen bg-zinc-950 pt-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-widest">
            <ArrowLeft size={16} /> {t('checkout.back_to_shop')}
          </button>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight italic">{t('checkout.title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-6">
                <div className="bg-yellow-500 text-black w-10 h-10 rounded-2xl flex items-center justify-center font-black italic transform -rotate-3 shadow-lg shadow-yellow-500/20">01</div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">{t('checkout.sec_contact')}</h2>
              </div>
              
              <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden">
                  <input autoComplete="off" type="text" name="honeypot" value={formData.honeypot} onChange={handleInputChange} tabIndex={-1} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">{t('checkout.lbl_name')} *</label>
                  <div className={inputClass('firstName')}>
                    <User size={18} className="text-zinc-600 mr-3" />
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="..." className="bg-transparent w-full text-white outline-none font-bold" />
                  </div>
                  {errors.firstName && <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-tighter"><AlertCircle size={12}/> {errors.firstName}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">{t('checkout.lbl_surname')} *</label>
                  <div className={inputClass('lastName')}>
                    <User size={18} className="text-zinc-600 mr-3" />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="..." className="bg-transparent w-full text-white outline-none font-bold" />
                  </div>
                  {errors.lastName && <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-tighter"><AlertCircle size={12}/> {errors.lastName}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">{t('checkout.lbl_phone')} *</label>
                  <div className={inputClass('phone')}>
                    <Phone size={18} className="text-zinc-600 mr-3" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+380..." className="bg-transparent w-full text-white outline-none font-bold" />
                  </div>
                  {errors.phone && <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-tighter"><AlertCircle size={12}/> {errors.phone}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">{t('checkout.lbl_email')}</label>
                  <div className={inputClass('email')}>
                    <Mail size={18} className="text-zinc-600 mr-3" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@mail.com" className="bg-transparent w-full text-white outline-none font-bold" />
                  </div>
                  {errors.email && <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-tighter"><AlertCircle size={12}/> {errors.email}</span>}
                </div>
              </div>
            </div>

            {/* Доставка и Оплата */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl">
               <div className="flex items-center gap-4 mb-10 border-b border-zinc-800 pb-6">
                <div className="bg-zinc-800 text-yellow-500 w-10 h-10 rounded-2xl flex items-center justify-center font-black italic transform rotate-3 border border-zinc-700">02</div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Доставка и Оплата</h2>
              </div>
              
              <div className="space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Способ получения</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {[
                         { id: 'nova_poshta_dept', label: 'Отделение НП', icon: Package },
                         { id: 'courier', label: 'Курьер НП', icon: Truck },
                         { id: 'pickup', label: 'Самовывоз', icon: MapPin }
                       ].map(m => (
                         <button key={m.id} type="button" onClick={() => setFormData({...formData, deliveryMethod: m.id as any})} className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 ${formData.deliveryMethod === m.id ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/10 scale-105' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                            <m.icon size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 {formData.deliveryMethod !== 'pickup' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Город и адрес/отделение *</label>
                       <div className={inputClass('city')}>
                          <MapPin size={18} className="text-zinc-600 mr-3" />
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Киев, отделение №..." className="bg-transparent w-full text-white outline-none font-bold" />
                       </div>
                       {errors.city && <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 mt-1 ml-1 uppercase tracking-tighter"><AlertCircle size={12}/> {errors.city}</span>}
                    </div>
                 )}

                 <div className="space-y-4 pt-6 border-t border-zinc-800">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Способ оплаты</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {[
                         { id: 'cod', label: 'При получении', icon: Package },
                         { id: 'card_online', label: 'Онлайн (LiqPay)', icon: CreditCard }
                       ].map(m => (
                         <button key={m.id} type="button" onClick={() => setFormData({...formData, paymentMethod: m.id as any})} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${formData.paymentMethod === m.id ? 'bg-zinc-800 border-yellow-500 text-white shadow-xl' : 'bg-black border-zinc-800 text-zinc-600 hover:border-zinc-700'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.paymentMethod === m.id ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-zinc-700'}`}><m.icon size={18}/></div>
                            <span className="text-xs font-black uppercase tracking-widest">{m.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Боковая панель итога */}
          <div className="lg:w-96 w-full sticky top-28">
             <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-black text-white uppercase italic mb-8 border-b border-zinc-800 pb-4">Ваш заказ</h3>
                <div className="space-y-4 mb-8">
                   {items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center gap-4">
                         <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-white rounded-lg p-1 shrink-0"><img src={item.image} className="w-full h-full object-contain" /></div>
                            <div className="truncate text-xs text-zinc-300 font-bold">{item.name}</div>
                         </div>
                         <div className="text-xs font-black text-white shrink-0">{item.price} ₴</div>
                      </div>
                   ))}
                </div>
                <div className="border-t border-zinc-800 pt-6 mb-8 flex justify-between items-end">
                   <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Итого к оплате</div>
                   <div className="text-3xl font-black text-yellow-500 italic tracking-tighter">{total.toLocaleString()} <span className="text-sm not-italic font-bold">UAH</span></div>
                </div>
                <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-5 rounded-2xl font-black uppercase italic tracking-tighter shadow-2xl shadow-yellow-500/20 active:scale-95 transition-all text-lg flex items-center justify-center gap-3">
                   Оформить заказ <CheckCircle size={24} />
                </button>
                <p className="text-[9px] text-zinc-600 text-center mt-6 font-bold uppercase tracking-widest leading-relaxed">Нажимая на кнопку, вы соглашаетесь с условиями публичной оферты и обработки персональных данных</p>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
