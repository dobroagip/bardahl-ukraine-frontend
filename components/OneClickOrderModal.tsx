
import React, { useState } from 'react';
import { X, Phone, User, CheckCircle, Zap, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface OneClickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (name: string, phone: string, honeypot?: string) => Promise<void>;
}

const OneClickOrderModal: React.FC<OneClickOrderModalProps> = ({ isOpen, onClose, product, onSubmit }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
        setError(t('checkout.error_fill'));
        return;
    }
    if (phone.length < 10) {
        setError(t('checkout.error_fill'));
        return;
    }

    setLoading(true);
    setError('');
    
    try {
        await onSubmit(name, phone, honeypot);
        setName('');
        setPhone('');
        setHoneypot('');
    } catch (e) {
        setError('Error submitting order');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-md bg-zinc-950 border border-yellow-500/30 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.15)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 flex justify-between items-center">
            <h3 className="font-black text-black uppercase tracking-wider flex items-center gap-2">
                <Zap size={20} fill="black" /> {t('product.one_click')}
            </h3>
            <button onClick={onClose} className="text-black/60 hover:text-black transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="p-6">
            <div className="flex gap-4 mb-6 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm line-clamp-2 leading-tight mb-1">{product.name}</h4>
                    <div className="text-yellow-500 font-bold">{product.price} {t('common.uah')}</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* HONEYPOT FIELD */}
                <div className="opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden">
                    <input 
                        autoComplete="off" 
                        type="text" 
                        name="mid_name" 
                        value={honeypot} 
                        onChange={(e) => setHoneypot(e.target.value)} 
                        tabIndex={-1} 
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">{t('checkout.lbl_name')}</label>
                    <div className="flex items-center bg-black border border-zinc-700 rounded-xl px-4 py-3 focus-within:border-yellow-500 transition-colors">
                        <User size={18} className="text-zinc-500 mr-3" />
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-transparent w-full text-white outline-none placeholder:text-zinc-700"
                            placeholder="Ваше имя"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase ml-1">{t('checkout.lbl_phone')}</label>
                    <div className="flex items-center bg-black border border-zinc-700 rounded-xl px-4 py-3 focus-within:border-yellow-500 transition-colors">
                        <Phone size={18} className="text-zinc-500 mr-3" />
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-transparent w-full text-white outline-none placeholder:text-zinc-700"
                            placeholder="+380..."
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-xs text-center font-bold bg-red-500/10 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : t('checkout.confirm')}
                </button>
            </form>
            
            <p className="text-[10px] text-zinc-600 text-center mt-4">
                Менеджер свяжется с вами для уточнения деталей доставки.
            </p>
        </div>
      </div>
    </div>
  );
};

export default OneClickOrderModal;
