
import React, { useState } from 'react';
import { Send, CheckCircle, UserCheck } from 'lucide-react'; 
import { useLanguage } from '../contexts/LanguageContext';
import { requestService } from '../services/requestService';

const VinDecoder: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
      car: '',
      engine: '',
      year: '',
      phone: '',
      honeypot: '' // Поле защиты
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      requestService.create({
          type: 'vin_check',
          contact: {
              phone: formData.phone,
              name: 'Клиент'
          },
          details: {
              car: formData.car,
              engine: formData.engine,
              year: formData.year
          },
          honeypot: formData.honeypot
      });

      setIsSent(true);
      
      setTimeout(() => {
          setFormData({ car: '', engine: '', year: '', phone: '', honeypot: '' });
          setIsSent(false);
      }, 5000);
  };

  return (
    <section className="py-10 bg-zinc-900 relative overflow-hidden border-b border-zinc-800">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2600&auto=format&fit=crop" 
          alt="Engine Background" 
          className="w-full h-full object-cover opacity-20 animate-zoom-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        
        <div className="max-w-2xl w-full">
           <div className="flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] mb-3">
              <UserCheck size={14} />
              <span>{t('vin.label')}</span>
           </div>
           <h2 className="text-2xl md:text-4xl font-black text-white mb-4 italic transform -skew-x-6 leading-none">
             {t('vin.title_start')} <span className="text-yellow-500">{t('vin.title_end')}</span>
           </h2>
           <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6 border-l-2 border-zinc-700 pl-4 max-w-lg">
             {t('vin.desc')}
           </p>

           {!isSent ? (
               <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                    {/* HONEYPOT FIELD */}
                    <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden">
                        <input 
                            autoComplete="off" 
                            type="text" 
                            name="user_website" 
                            value={formData.honeypot} 
                            onChange={e => setFormData({...formData, honeypot: e.target.value})} 
                            tabIndex={-1} 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-bold ml-1 uppercase">{t('vin.lbl_car')}</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white focus:border-yellow-500 outline-none transition-colors"
                            placeholder="BMW X5"
                            value={formData.car}
                            onChange={e => setFormData({...formData, car: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-bold ml-1 uppercase">{t('vin.lbl_year')}</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white focus:border-yellow-500 outline-none transition-colors"
                            placeholder="2018"
                            value={formData.year}
                            onChange={e => setFormData({...formData, year: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-bold ml-1 uppercase">{t('vin.lbl_engine')}</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-black border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white focus:border-yellow-500 outline-none transition-colors"
                            placeholder="3.0 Diesel"
                            value={formData.engine}
                            onChange={e => setFormData({...formData, engine: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-bold ml-1 uppercase">{t('vin.lbl_phone')}</label>
                        <input 
                            type="tel" 
                            required
                            className="w-full bg-black border border-zinc-700 rounded-lg py-2 px-3 text-sm text-white focus:border-yellow-500 outline-none transition-colors"
                            placeholder="+380..."
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    
                    <button type="submit" className="sm:col-span-2 mt-2 h-11 bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] text-xs md:text-sm">
                        <Send size={16} /> {t('vin.btn_show')}
                    </button>
               </form>
           ) : (
               <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl flex items-center gap-4 max-w-xl animate-in fade-in">
                   <div className="bg-green-500 text-black p-2 rounded-full">
                       <CheckCircle size={24} />
                   </div>
                   <div>
                       <h3 className="text-lg font-bold text-white mb-1">Запрос отправлен!</h3>
                       <p className="text-zinc-400 text-sm">Наш специалист свяжется с вами в ближайшее время.</p>
                   </div>
               </div>
           )}
        </div>

        <div className="hidden md:block relative">
            <div className="w-48 h-48 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center relative">
               <div className="absolute inset-0 border-t-2 border-yellow-500 rounded-full opacity-50 animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
               <UserCheck size={48} className="text-zinc-700" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default VinDecoder;
