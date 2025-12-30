
import React from 'react';
import { X, ShoppingCart, Minus, Plus, ChevronLeft, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string, volume?: string) => void;
  onUpdateQty: (id: string, delta: number, volume?: string) => void;
  onCheckout: () => void;
  onGoToCatalog: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty, onCheckout, onGoToCatalog }) => {
  const { t } = useLanguage();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 w-full h-full">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-zoom-in flex flex-col max-h-[85vh]">
        
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
             <ShoppingCart className="text-yellow-500" /> {t('cart.title')}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-950 custom-scrollbar">
          {items.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 flex flex-col items-center justify-center h-full">
              <div className="bg-zinc-900 p-6 rounded-full mb-4">
                 <ShoppingCart size={48} className="opacity-20" />
              </div>
              <p className="text-xl font-bold text-white mb-2">{t('cart.empty_title')}</p>
              <p className="text-sm mb-6 max-w-xs mx-auto">{t('cart.empty_desc')}</p>
              <button onClick={onGoToCatalog} className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors">
                {t('cart.go_catalog')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
               {items.map((item, index) => (
                 <div key={`${item.id}-${item.volume}-${index}`} className="group flex flex-col sm:flex-row items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors">
                    
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-lg p-2 flex-shrink-0 flex items-center justify-center border border-zinc-800">
                       <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 text-center sm:text-left min-w-0">
                       <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Bardahl</div>
                       <h3 className="text-base font-bold text-white mb-1 leading-tight line-clamp-2">
                          {item.name}
                       </h3>
                       <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-zinc-400">
                          <span className="bg-zinc-800 px-2 rounded text-yellow-500 font-bold">{item.volume}</span>
                          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                          <span>{t('cart.art')}: {item.sku || 'N/A'}</span>
                       </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-8 bg-zinc-900 sm:bg-transparent p-3 sm:p-0 rounded-lg">
                        <div className="flex items-center bg-black border border-zinc-800 rounded-lg h-9">
                           <button 
                              onClick={() => onUpdateQty(item.id, -1, item.volume)}
                              className="w-9 h-full flex items-center justify-center hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                           >
                              <Minus size={14} />
                           </button>
                           <div className="w-10 text-center font-bold text-white text-sm">{item.quantity}</div>
                           <button 
                              onClick={() => onUpdateQty(item.id, 1, item.volume)}
                              className="w-9 h-full flex items-center justify-center hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                           >
                              <Plus size={14} />
                           </button>
                        </div>

                        <div className="text-right min-w-[80px]">
                           <div className="text-lg font-bold text-white whitespace-nowrap">
                              {(item.price * item.quantity).toLocaleString()} <span className="text-xs font-normal text-zinc-500">{t('common.uah')}</span>
                           </div>
                           {item.quantity > 1 && (
                               <div className="text-[10px] text-zinc-500">{item.price} {t('cart.price_per_piece')}</div>
                           )}
                        </div>
                        
                        <button 
                             onClick={() => onRemove(item.id, item.volume)} 
                             className="text-zinc-600 hover:text-red-500 transition-colors p-2"
                             title="Удалить"
                         >
                             <Trash2 size={18} />
                         </button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
           <div className="p-5 bg-zinc-900 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  <div className="text-zinc-400 font-medium">{t('cart.total_pay')}:</div>
                  <div className="text-3xl font-black text-white">
                      {total.toLocaleString('ru-RU')} <span className="text-xl text-zinc-500 font-bold">{t('common.uah')}</span>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                    onClick={onClose}
                    className="order-2 sm:order-1 px-6 py-4 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                 >
                    <ChevronLeft size={18} /> {t('cart.continue')}
                 </button>

                 <button 
                    onClick={onCheckout}
                    className="order-1 sm:order-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-lg font-black uppercase tracking-wider text-base shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-2"
                 >
                    {t('cart.checkout')}
                 </button>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
