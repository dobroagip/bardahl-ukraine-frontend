
import { Category, Language } from '../types';
import { translateToUA } from '../constants';
import { supabase } from './supabase';

const FALLBACK_CATEGORIES: any[] = [
  { 
    id: 'motor-oil', 
    name: 'Моторные масла', 
    description: 'Премиальные масла из Бельгии для легковых авто', 
    image: 'https://images.unsplash.com/photo-1635773054018-208365902b78?q=80&w=2000&auto=format&fit=crop', 
    slug: 'motor-oil', 
    is_header: true,
    master_seo: {
        ru: { title: 'Купить моторное масло Bardahl (Бардаль) в Украине — Официальный сайт', description: 'Широкий выбор оригинальных моторных масел Bardahl 5W-30, 5W-40, 10W-40. Прямые поставки из Бельгии, технологии Fullerene C60 и Polar Plus. Доставка по Украине.', keywords: 'моторное масло bardahl, купить масло бардаль, bardahl 5w30, bardahl 5w40, моторное масло бельгия' },
        uk: { title: 'Купити моторну оливу Bardahl (Бардаль) в Україні — Офіційний сайт', description: 'Великий вибір оригінальних моторних олив Bardahl 5W-30, 5W-40, 10W-40. Прямі поставки з Бельгії, технології Fullerene C60 та Polar Plus. Доставка по Україні.', keywords: 'моторна олива bardahl, купити оливу бардаль, олива бельгія' }
    }
  },
  { 
    id: 'additives', 
    name: 'Присадки', 
    description: 'Технологии C60 и Polar Plus для максимальной защиты', 
    image: 'https://images.unsplash.com/photo-1597838816882-4435b1977fbe?q=80&w=2670&auto=format&fit=crop', 
    slug: 'additives', 
    is_header: true,
    master_seo: {
        ru: { title: 'Присадки Bardahl (Бардаль) для двигателя и топлива — Купить оригинал', description: 'Высокотехнологичные присадки Bardahl Full Metal, Turbo Protect, BDC. Защита двигателя, очистка топливной системы, снижение расхода масла. Бельгийское качество.', keywords: 'присадки bardahl, бардаль фул метал, присадка в топливо bardahl, turbo protect, присадки для двигателя' },
        uk: { title: 'Присадки Bardahl (Бардаль) для двигуна та палива — Купити оригінал', description: 'Високотехнологічні присадки Bardahl Full Metal, Turbo Protect, BDC. Захист двигуна, очищення паливної системи. Бельгійська якість.', keywords: 'присадки bardahl, бардаль фул метал, присадка в паливо' }
    }
  },
  { 
    id: 'gear-oil', 
    name: 'Трансмиссия', 
    description: 'Защита КПП и редукторов', 
    image: 'https://images.unsplash.com/photo-1517524008436-bbdb53c57d2d?q=80&w=2670&auto=format&fit=crop', 
    slug: 'gear-oil', 
    is_header: true,
    master_seo: {
        ru: { title: 'Трансмиссионные масла Bardahl — Для МКПП и редукторов', description: 'Обеспечьте плавное переключение и защиту трансмиссии с маслами Bardahl. Подбор масел для механических коробок передач и дифференциалов.', keywords: 'трансмиссионное масло bardahl, масло в кпп бардаль, 75w90 bardahl, масло для редуктора' },
        uk: { title: 'Трансмісійні оливи Bardahl — Для МКПП та редукторів', description: 'Забезпечте плавне перемикання та захист трансмісії з оливами Bardahl. Підбір оливи для механічних коробок передач та диференціалів.', keywords: 'трансмісійна олива bardahl, олива в кпп бардаль' }
    }
  },
  { 
    id: 'atf-fluid', 
    name: 'Масла для АКПП', 
    description: 'Специализированные жидкости для автоматических трансмиссий всех типов', 
    image: 'https://images.unsplash.com/photo-1598209279122-8541213a03a7?q=80&w=2000&auto=format&fit=crop', 
    slug: 'atf-fluid', 
    is_header: true,
    master_seo: {
        ru: { title: 'Масла АКПП Bardahl (ATF) — Жидкости для автоматических коробок', description: 'Высококачественные ATF жидкости Bardahl для современных автоматических трансмиссий. Соответствие допускам ZF, Aisin, GM Dexron. Продлите жизнь вашей АКПП.', keywords: 'масло акпп bardahl, жидкость atf бардаль, bardahl multi atf, замена масла в акпп' },
        uk: { title: 'Оливи АКПП Bardahl (ATF) — Рідини для автоматичних коробок', description: 'Високоякісні ATF рідини Bardahl для сучасних автоматичних трансмісій. Відповідність допускам ZF, Aisin, GM Dexron.', keywords: 'олива акпп bardahl, рідина atf бардаль' }
    }
  },
  { 
    id: 'racing-oil', 
    name: 'Спортивная олива', 
    description: 'Racing серия для экстремальных нагрузок и высоких оборотов', 
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2000&auto=format&fit=crop', 
    slug: 'racing-oil', 
    is_header: true,
    master_seo: {
        ru: { title: 'Спортивные масла Bardahl Racing — Технологии Formula 1', description: 'Масла серии XTC C60 Racing для автоспорта и мощных гражданских авто. Максимальная защита при экстремальных температурах и нагрузках.', keywords: 'спортивное масло bardahl, bardahl racing 10w60, xtc c60 racing, масло для гонок' },
        uk: { title: 'Спортивні оливи Bardahl Racing — Технології Formula 1', description: 'Оливи серії XTC C60 Racing для автоспорту та потужних цивільних авто. Максимальний захист при екстремальних навантаженнях.', keywords: 'спортивна олива bardahl, мастило для гонок' }
    }
  },
  { 
    id: 'moto', 
    name: 'Мото', 
    description: 'Специальная серия для 2T и 4T мототехники', 
    image: 'https://images.unsplash.com/photo-1558981403-c5f97dbbe480?q=80&w=2670&auto=format&fit=crop', 
    slug: 'moto', 
    is_header: true,
    master_seo: {
        ru: { title: 'Мотомасла Bardahl — Для мотоциклов, скутеров и квадроциклов', description: 'Защитите свой байк с премиальными маслами Bardahl Moto. Линейка 2T и 4T масел для любой мототехники. Плавная работа сцепления и чистота двигателя.', keywords: 'мотомасло bardahl, масло для мотоцикла бардаль, 10w40 moto bardahl, масло 2t bardahl' },
        uk: { title: 'Мотооливи Bardahl — Для мотоциклів та квадроциклів', description: 'Захистіть свій байк з преміальними оливами Bardahl Moto. Лінійка 2T та 4T олив для будь-якої мототехніки.', keywords: 'мотоолива bardahl, олива для мотоцикла бардаль' }
    }
  },
  { 
    id: 'car-care', 
    name: 'Автохимия', 
    description: 'Уход и профессиональный сервис', 
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2671&auto=format&fit=crop', 
    slug: 'car-care', 
    is_header: true,
    master_seo: {
        ru: { title: 'Автохимия и косметика Bardahl — Профессиональный уход', description: 'Очистители, промывки, антифризы и средства по уходу за авто от Bardahl. Профессиональные решения для детейлинга и обслуживания систем автомобиля.', keywords: 'автохимия bardahl, очиститель кондиционера бардаль, промывка двигателя bardahl, антифриз бардаль' },
        uk: { title: 'Автохімія та косметика Bardahl — Професійний догляд', description: 'Очищувачі, промивки, антифризи та засоби для догляду за авто від Bardahl. Професійні рішення для обслуговування авто.', keywords: 'автохімія bardahl, промивка двигуна bardahl' }
    }
  }
];

export const categoryService = {
  async getAll(lang: Language): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      const source = (data && data.length > 0) ? data : FALLBACK_CATEGORIES;
      
      return source
        .filter(cat => cat.id !== 'truck-oil')
        .map(cat => {
         const localizedSeo = cat.master_seo ? cat.master_seo[lang] : undefined;
         let name = cat.name;
         if (cat.id === 'racing-oil') {
            name = lang === 'uk' ? 'Спортивна олива' : 'Спортивная олива';
         }

         return {
             id: cat.id,
             image: cat.image,
             name: lang === 'uk' ? (cat.id === 'racing-oil' ? 'Спортивна олива' : cat.name_uk || translateToUA(cat.name)) : name,
             description: lang === 'uk' ? (cat.description_uk || translateToUA(cat.description)) : cat.description,
             slug: cat.slug,
             isHeader: cat.is_header ?? true,
             seo: localizedSeo
         };
      });
    } catch (e) {
      return FALLBACK_CATEGORIES.map(cat => ({
          id: cat.id,
          image: cat.image,
          name: lang === 'uk' ? translateToUA(cat.name) : cat.name,
          description: lang === 'uk' ? translateToUA(cat.description) : cat.description,
          slug: cat.slug,
          isHeader: true,
          seo: cat.master_seo ? cat.master_seo[lang] : undefined
      }));
    }
  },

  async getById(id: string, lang: Language): Promise<Category | undefined> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
          const fb = FALLBACK_CATEGORIES.find(c => c.id === id);
          if (!fb) return undefined;
          return {
              id: fb.id,
              image: fb.image,
              name: lang === 'uk' ? translateToUA(fb.name) : fb.name,
              description: lang === 'uk' ? translateToUA(fb.description) : fb.description,
              slug: fb.slug,
              isHeader: true,
              seo: fb.master_seo ? fb.master_seo[lang] : undefined
          };
      }

      const localizedSeo = data.master_seo ? data.master_seo[lang] : undefined;
      let name = data.name;
      if (id === 'racing-oil') name = lang === 'uk' ? 'Спортивна олива' : 'Спортивная олива';

      return {
          id: data.id,
          image: data.image,
          name: lang === 'uk' ? (id === 'racing-oil' ? 'Спортивна олива' : data.name_uk || translateToUA(data.name)) : name,
          description: lang === 'uk' ? (data.description_uk || translateToUA(data.description)) : data.description,
          slug: data.slug,
          isHeader: data.is_header ?? true,
          seo: localizedSeo
      };
    } catch (e) {
      const fb = FALLBACK_CATEGORIES.find(c => c.id === id);
      if (!fb) return undefined;
      return {
          id: fb.id,
          image: fb.image,
          name: lang === 'uk' ? translateToUA(fb.name) : fb.name,
          description: lang === 'uk' ? translateToUA(fb.description) : fb.description,
          slug: fb.slug,
          isHeader: true,
          seo: fb.master_seo ? fb.master_seo[lang] : undefined
      };
    }
  }
};
