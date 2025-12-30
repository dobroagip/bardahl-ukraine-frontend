
import React, { useState, useEffect } from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink, Image as ImageIcon, Camera, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { contentService } from '../services/contentService';

const SocialReviews: React.FC = () => {
  const { language } = useLanguage();
  const [photos, setPhotos] = useState<string[]>([]);
  const instagramUrl = "https://www.instagram.com/max_bardahl_ukraine";

  useEffect(() => {
    setPhotos(contentService.getGallery());
  }, []);

  const title = language === 'ru' ? "Мы в Instagram" : "Ми в Instagram";
  const subTitle = language === 'ru' ? "Фотоотзывы наших клиентов" : "Фотоотгуки наших клієнтів";
  const followBtn = language === 'ru' ? "Подписаться" : "Підписатися";

  return (
    <section className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Instagram Profile Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
              {/* Animated decorative ring */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                    <div className="bg-zinc-950 p-1 rounded-full">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-800 rounded-full flex items-center justify-center text-yellow-500 overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Profile" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-none mb-1">max_bardahl_ukraine</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Official Representative</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-white font-black text-lg">1.2k</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Posts</div>
                  </div>
                  <div className="text-center border-x border-zinc-800">
                    <div className="text-white font-black text-lg">8.5k</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-black text-lg">420</div>
                    <div className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Following</div>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8 italic">
                  "Делимся результатами тестов, новинками и честными отзывами о Bardahl в Украине. Присоединяйтесь к сообществу профессионалов!"
                </p>

                <a 
                  href={instagramUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-white hover:bg-yellow-500 text-black font-black uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                  <Instagram size={20} /> {followBtn}
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Photo Gallery */}
          <div className="lg:col-span-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-[0.2em] text-[10px] mb-3">
                  <Camera size={14} /> LIVE FROM ROADS
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                  {subTitle}
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Verified Reviews</span>
              </div>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {photos.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="relative aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800 group cursor-zoom-in"
                  >
                    <img src={img} alt={`Review ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                       <Heart className="text-white fill-white" size={20} />
                       <MessageCircle className="text-white fill-white" size={20} />
                    </div>
                    <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6">
                       <div className="bg-yellow-500 text-black p-1.5 md:p-2 rounded-xl shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                          <Instagram size={14} md:size={18} />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center text-zinc-600">
                 <ImageIcon size={48} className="mb-4 opacity-20" />
                 <p className="font-black uppercase tracking-widest text-xs">Галерея наполняется...</p>
              </div>
            )}
            
            <div className="mt-12 flex justify-center">
               <a 
                href={instagramUrl} 
                target="_blank" 
                className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px]"
               >
                 Смотреть больше в ленте <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SocialReviews;
