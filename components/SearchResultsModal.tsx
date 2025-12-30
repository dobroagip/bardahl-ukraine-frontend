import React from 'react';
import { X, CheckCircle, Droplets, ShoppingCart } from 'lucide-react';
import { ExternalProduct } from '../types';

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ExternalProduct[];
  carDetails: { brand: string; model: string; year: string; fuel: string } | null;
  onAddToCart: (productName: string) => void;
}

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({ isOpen, onClose, results, carDetails, onAddToCart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 slide-in-from-bottom-5">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 border-b border-zinc-700 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-yellow-500"><CheckCircle /></span>
              Результаты подбора
            </h2>
            {carDetails && (
              <p className="text-zinc-400 text-sm mt-1">
                Для авто: <span className="text-white font-medium">{carDetails.brand} {carDetails.model} ({carDetails.year})</span>
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
          {results.length > 0 ? (
            results.map((product, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 hover:border-yellow-500/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-yellow-500/20">
                         {product.viscosity || 'SAE'}
                       </span>
                       <span className="text-zinc-500 text-xs flex items-center gap-1">
                         <Droplets size={12} /> Recommended
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {product.reason}
                    </p>
                  </div>

                  <button 
                    onClick={() => onAddToCart(product.name)}
                    className="flex-shrink-0 flex items-center gap-2 bg-white text-black hover:bg-yellow-500 font-bold text-sm px-6 py-3 rounded-full transition-all transform active:scale-95 shadow-lg"
                  >
                    <ShoppingCart size={16} />
                    Заказать
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-zinc-500">
              <p>К сожалению, мы не нашли точных результатов автоматического подбора.</p>
              <p className="text-sm mt-2">Пожалуйста, обратитесь к менеджеру.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-900 p-4 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
            Powered by Bardahl AI • Data from bardahloils.com/uk-ua
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsModal;