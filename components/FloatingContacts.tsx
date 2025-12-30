
import React, { useState } from 'react';
import { Phone, MessageCircle, X, MessageSquare } from 'lucide-react';

const FloatingContacts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 md:bottom-10 right-6 z-[80] flex flex-col items-end gap-3">
      {/* Menu Options */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
           {/* Viber */}
           <a 
            href="viber://chat?number=%2B380674862117"
            className="flex items-center gap-3 group"
           >
              <span className="bg-white text-black px-3 py-1 rounded-lg text-xs font-black uppercase shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">Viber</span>
              <div className="w-12 h-12 bg-[#7360f2] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform border-2 border-white/20">
                <img src="https://img.icons8.com/color/48/viber.png" className="w-6 h-6 brightness-200" alt="Viber" />
              </div>
           </a>

           {/* WhatsApp */}
           <a 
            href="https://wa.me/380674862117"
            className="flex items-center gap-3 group"
           >
              <span className="bg-white text-black px-3 py-1 rounded-lg text-xs font-black uppercase shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">WhatsApp</span>
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform border-2 border-white/20">
                <img src="https://img.icons8.com/color/48/whatsapp.png" className="w-6 h-6 brightness-200" alt="WhatsApp" />
              </div>
           </a>

           {/* Call */}
           <a 
            href="tel:+380674862117"
            className="flex items-center gap-3 group"
           >
              <span className="bg-white text-black px-3 py-1 rounded-lg text-xs font-black uppercase shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">Позвонить</span>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-110 transition-transform border-2 border-white/20">
                <Phone size={24} fill="black" />
              </div>
           </a>
        </div>
      )}

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(234,179,8,0.3)] transition-all duration-500 border-2 border-white/10 ${isOpen ? 'bg-zinc-800 text-white rotate-90' : 'bg-yellow-500 text-black hover:scale-110'}`}
      >
        {isOpen ? <X size={28} /> : (
          <div className="relative">
             <MessageSquare size={28} fill="currentColor" />
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-yellow-500 animate-ping"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingContacts;
