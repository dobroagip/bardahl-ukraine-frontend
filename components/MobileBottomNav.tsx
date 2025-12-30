
import React from 'react';
import { Phone, Search, ShoppingCart, User, MessageSquare } from 'lucide-react';

interface MobileBottomNavProps {
  onNavigate: (view: any) => void;
  onSearchClick: () => void;
  onCartClick: () => void;
  onProfileClick: () => void;
  onChatClick: () => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  onNavigate, 
  onSearchClick, 
  onCartClick, 
  onProfileClick, 
  onChatClick, 
  cartCount 
}) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[70] bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 pb-safe md:hidden transform translate-z-0"
      style={{ boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.5)' }}
    >
      <div className="flex justify-between items-center px-2 py-2">
         {/* 1. Phone / Call directly */}
         <a 
            href="tel:+380674862117" 
            className="flex flex-col items-center justify-center p-2 text-yellow-500 hover:text-white active:scale-95 transition-all flex-1"
         >
            <Phone size={22} fill="currentColor" className="opacity-80" />
            <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">Связь</span>
         </a>

         {/* 2. Search */}
         <button 
            onClick={onSearchClick} 
            className="flex flex-col items-center justify-center p-2 text-zinc-500 hover:text-white active:scale-95 transition-all flex-1"
         >
            <Search size={22} />
            <span className="text-[9px] font-bold mt-1 uppercase">Поиск</span>
         </button>

         {/* 3. Cart */}
         <button 
            onClick={onCartClick} 
            className="flex flex-col items-center justify-center p-2 text-zinc-500 hover:text-white active:scale-95 transition-all flex-1 relative"
         >
            <div className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-500 text-black text-[9px] font-black flex items-center justify-center rounded-full border border-black animate-in zoom-in">
                      {cartCount}
                  </span>
              )}
            </div>
            <span className="text-[9px] font-bold mt-1 uppercase">Корзина</span>
         </button>

         {/* 4. Profile */}
         <button 
            onClick={onProfileClick} 
            className="flex flex-col items-center justify-center p-2 text-zinc-500 hover:text-white active:scale-95 transition-all flex-1"
         >
            <User size={22} />
            <span className="text-[9px] font-bold mt-1 uppercase">Кабинет</span>
         </button>

         {/* 5. Chat */}
         <button 
            onClick={onChatClick} 
            className="flex flex-col items-center justify-center p-2 text-zinc-500 hover:text-yellow-500 active:scale-95 transition-all flex-1"
         >
            <MessageSquare size={22} />
            <span className="text-[9px] font-bold mt-1 uppercase">FAQ</span>
         </button>
      </div>
    </div>
  );
};
