import React, { useEffect } from 'react';
import { CheckCircle, ShoppingBag, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ThankYouProps {
  orderId?: string;
  onNavigate: (view: 'shop' | 'cabinet') => void;
  onGoHome: () => void;
  isLoggedIn: boolean;
}

const ThankYou: React.FC<ThankYouProps> = ({ orderId, onNavigate, onGoHome, isLoggedIn }) => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-[80vh] bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      
      <div className="relative z-10 max-w-lg w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center backdrop-blur-xl animate-in zoom-in-95 duration-500">
        
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6">
          <CheckCircle className="text-green-500 w-10 h-10 md:w-12 md:h-12" strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase italic tracking-tight">
          {t('thank_you.title')}
        </h1>
        
        <p className="text-zinc-400 text-lg mb-8">
          {t('thank_you.subtitle')}
        </p>

        {orderId && (
          <div className="bg-black/40 border border-zinc-800 rounded-xl p-4 mb-8 inline-block w-full">
            <p className="text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">
              {t('thank_you.order_num')}
            </p>
            <p className="text-2xl font-mono font-bold text-yellow-500">#{orderId}</p>
          </div>
        )}

        <div className="space-y-4 mb-10 text-left">
           <h3 className="text-white font-bold text-sm uppercase tracking-wide border-b border-zinc-800 pb-2 mb-4">
             {t('thank_you.next_steps_title')}
           </h3>
           <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 flex-shrink-0">1</div>
              <p className="text-zinc-300 text-sm">{t('thank_you.step_1')}</p>
           </div>
           <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 flex-shrink-0">2</div>
              <p className="text-zinc-300 text-sm">{t('thank_you.step_2')}</p>
           </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onGoHome}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} /> {t('thank_you.btn_home')}
          </button>
          
          {isLoggedIn && (
            <button 
              onClick={() => onNavigate('cabinet')}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-700"
            >
              <User size={18} /> {t('thank_you.btn_cabinet')}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ThankYou;