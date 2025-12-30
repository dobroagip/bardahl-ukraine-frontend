import React from 'react';
import { Home, ShoppingCart, AlertTriangle, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onNavigate: (view: any) => void;
  onGoHome: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onNavigate, onGoHome }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-black text-center px-4 py-20">
      
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* The 404 Number */}
        <div className="relative">
           <h1 className="text-[120px] md:text-[240px] font-black text-zinc-900 leading-none select-none tracking-tighter" style={{ textShadow: '0 0 2px rgba(255,255,255,0.1)' }}>
             404
           </h1>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <AlertTriangle className="text-yellow-500 w-16 h-16 md:w-24 md:h-24 animate-pulse" strokeWidth={1.5} />
           </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic mb-4 mt-[-20px] md:mt-[-40px]">
          Двигатель заглох...
        </h2>
        
        <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          Похоже, вы свернули не туда. Страница, которую вы ищете, была перемещена, удалена или находится на техобслуживании.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onGoHome}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-700 text-zinc-300 rounded-lg hover:border-white hover:text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group"
          >
            <Home size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            На главную
          </button>

          <button 
            onClick={onGoHome}
            className="w-full sm:w-auto px-8 py-4 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            В каталог
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;