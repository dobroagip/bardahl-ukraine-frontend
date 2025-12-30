
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldCheck, MapPin, Award, Zap } from 'lucide-react';

const HomeSeoContent: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    ru: {
      h2: "Почему выбирают моторные масла и присадки Bardahl?",
      p1: "Bardahl Ukraine (ПП Добробут) — официальный дилер продукции Bardahl в Украине с 2011 года. Мы обеспечиваем прямые поставки премиальных смазочных материалов напрямую с завода в Бельгии, гарантируя 100% оригинальность каждой канистры.",
      p2: "В нашем интернет-магазине вы можете купить моторное масло Bardahl (Бардаль) для любых типов двигателей: бензиновых, дизельных, с турбонаддувом и без. Широкий ассортимент вязкостей (5W-30, 5W-40, 10W-40) и наличие официальных допусков ведущих автопроизводителей позволяют подобрать идеальную защиту для вашего авто.",
      p3: "Уникальные формулы Fullerene C60 и Polar Plus создают неразрушимый молекулярный щит, который снижает трение и износ деталей двигателя до минимума. Это защита, которую не может предоставить ни одно стандартное масло массового сегмента.",
      p4: "Мы осуществляем профессиональный подбор продукции по допускам OEM и VIN-коду. Собственный склад в Одессе позволяет отправлять заказы в день оформления. Доставка осуществляется в Киев, Харьков, Днепр, Львов и по всей территории Украины в кратчайшие сроки.",
      features: [
        { icon: Award, text: "Официальный импортер с 2011 года" },
        { icon: ShieldCheck, text: "Гарантия оригинальности (Бельгия)" },
        { icon: Zap, text: "Технологии Fullerene C60 и Polar Plus" },
        { icon: MapPin, text: "Склад в Одессе, доставка по всей Украине" }
      ]
    },
    uk: {
      h2: "Чому обирають моторні оливи та присадки Bardahl?",
      p1: "Bardahl Ukraine (ПП Добробут) — офіційний дилер продукції Bardahl в Україні з 2011 року. Ми забезпечуємо прямі поставки преміальних мастильних матеріалів безпосередньо з заводу в Бельгії, гарантуючи 100% оригінальність кожної каністри.",
      p2: "У нашому інтернет-магазині ви можете купити моторну оливу Bardahl (Бардаль) для будь-яких типів двигунів: бензинових, дизельних, з турбонаддувом та без. Широкий асортимент в'язкостей (5W-30, 5W-40, 10W-40) та наявність офіційних допусків провідних автовиробників дозволяють підібрати ідеальний захист для вашого авто.",
      p3: "Унікальні формули Fullerene C60 та Polar Plus створюють неруйнівний молекулярний щит, який знижує тертя та знос деталей двигуна до мінімуму. Це захист, який не може надати жодна стандартна олива масового сегменту.",
      p4: "Ми здійснюємо професійний підбір продукції за допусками OEM та VIN-кодом. Власний склад в Одесі дозволяє відправляти замовлення в день оформлення. Доставка здійснюється в Київ, Харків, Дніпро, Львів та по всій території України в найкоротші терміни.",
      features: [
        { icon: Award, text: "Офіційний імпортер з 2011 року" },
        { icon: ShieldCheck, text: "Гарантія оригінальності (Бельгія)" },
        { icon: Zap, text: "Технології Fullerene C60 та Polar Plus" },
        { icon: MapPin, text: "Склад в Одесі, доставка по всій Україні" }
      ]
    }
  };

  const cur = content[language] || content.ru;

  return (
    <section className="bg-zinc-950 py-16 border-t border-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-10 border-l-4 border-yellow-500 pl-6">
            {cur.h2}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm leading-[1.8] font-medium">
                {cur.p1}
              </p>
              <p className="text-zinc-400 text-sm leading-[1.8] font-medium">
                {cur.p2}
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm leading-[1.8] font-medium">
                {cur.p3}
              </p>
              <p className="text-zinc-400 text-sm leading-[1.8] font-medium">
                {cur.p4}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-zinc-900">
            {cur.features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <f.icon className="text-yellow-500 mb-3" size={24} />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-tight">
                  {f.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSeoContent;
