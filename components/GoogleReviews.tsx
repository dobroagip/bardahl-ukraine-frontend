
import React from 'react';
import { Star, MessageSquare, ExternalLink, Quote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  date: string;
  relativeDate: string;
}

const reviews: GoogleReview[] = [
  {
    author: "Александр К.",
    rating: 5,
    text: "Лучшее место для покупки оригинального масла Bardahl. Официальный представитель, всегда уверен в качестве. Пользуюсь присадками Full Metal уже 3 года, мотор работает как часы.",
    date: "2024-01-15",
    relativeDate: "1 месяц назад"
  },
  {
    author: "Dmitry V.",
    rating: 5,
    text: "Заказывал масло с подбором по VIN. Ребята профессионалы, подобрали именно то, что требует завод. Доставка в Киев на следующий день. Рекомендую всем владельцам BMW!",
    date: "2024-02-01",
    relativeDate: "2 недели назад"
  },
  {
    author: "Сергей Николаевич",
    rating: 5,
    text: "Беру здесь автохимию оптом для своего СТО. Клиенты довольны результатом, особенно промывками и Turbo Protect. Оригинал 100%, сертификаты в наличии.",
    date: "2023-12-10",
    relativeDate: "3 месяца назад"
  }
];

const GoogleReviews: React.FC = () => {
  const { language } = useLanguage();
  const mapsUrl = "https://maps.app.goo.gl/cYd19TgzmSMLPfdg8";
  
  const title = language === 'ru' ? "Отзывы в Google Maps" : "Відгуки в Google Maps";
  const subTitle = language === 'ru' ? "Что о нас говорят клиенты" : "Що про нас кажуть клієнти";
  const readAll = language === 'ru' ? "Читать все отзывы" : "Читати всі відгуки";

  // SEO JSON-LD Markup
  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "LocalBusiness",
    "name": "Bardahl Ukraine - ПП Добробут",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.author },
      "datePublished": r.date,
      "reviewBody": r.text,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating.toString(),
        "bestRating": "5"
      }
    }))
  };

  return (
    <section className="py-16 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Schema.org for SEO */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-[10px] mb-3">
              <Star size={14} fill="currentColor" />
              <span>Google Trusted Store</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
              {title}
            </h2>
            <p className="text-zinc-500 mt-2">{subTitle}</p>
          </div>
          
          <a 
            href={mapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-6 py-3 rounded-xl border border-zinc-800 transition-all group"
          >
            <div className="flex text-yellow-500 mr-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className="font-bold text-sm">4.9 / 5.0</span>
            <span className="w-px h-4 bg-zinc-700 mx-2"></span>
            <span className="text-sm font-medium">{readAll}</span>
            <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div 
              key={idx} 
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl relative group hover:border-yellow-500/30 transition-all hover:-translate-y-1 shadow-xl"
            >
              <Quote className="absolute top-6 right-8 text-zinc-800 group-hover:text-yellow-500/10 transition-colors" size={40} />
              
              <div className="flex items-center gap-1 text-yellow-500 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-8 italic">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 mt-auto border-t border-zinc-800 pt-6">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold border border-yellow-500/20">
                  {review.author[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{review.author}</h4>
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{review.relativeDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
    </section>
  );
};

export default GoogleReviews;
