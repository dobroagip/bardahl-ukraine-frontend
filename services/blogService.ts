
import { MasterBlogPost, BlogPost, Language } from '../types';
import { supabase } from './supabase';

const FALLBACK_BLOG: MasterBlogPost[] = [
  {
    id: 'oil-change-intervals-guide-2024',
    date: '2024-03-26',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2664&auto=format&fit=crop',
    locales: {
      ru: {
        title: 'Когда менять масло? Реальные интервалы в 2024 году',
        preview: 'Забудьте про 15 000 км. Рассказываем, почему в городских условиях масло Bardahl нужно менять чаще и как моточасы влияют на износ.',
        readMore: 'Маркетинговые интервалы в 15-20 тысяч километров — это путь к капитальному ремонту двигателя. \n\n1. Моточасы важнее пробега: В пробках двигатель работает, а пробег не растет. 250 моточасов — предел для самой качественной синтетики. \n2. Тяжелые условия: Короткие поездки, прогревы и зимний запуск приравнивают эксплуатацию в Украине к экстремальной. \n3. Окисление: Даже если машина стоит, присадки теряют свойства. Минимум один раз в год — обязательное правило. \n4. Цвет масла: Если масло почернело — оно работает (моет), но если оно стало густым — это сигнал к немедленной замене.'
      },
      uk: {
        title: 'Коли міняти оливу? Реальні інтервали у 2024 році',
        preview: 'Забудьте про 15 000 км. Розповідаємо, чому в міських умовах оливу Bardahl потрібно міняти частіше і як мотогодини впливають на знос.',
        readMore: 'Маркетингові інтервали у 15-20 тисяч кілометрів — це шлях до капітального ремонту двигуна. \n\n1. Мотогодини важливіші за пробіг: У заторах двигун працює, а пробіг не зростає. 250 мотогодин — межа для найякіснішої синтетики. \n2. Важкі умови: Короткі поїздки, прогрівання та зимовий запуск прирівнюють експлуатацію в Україні до екстремальної. \n3. Окислення: Навіть якщо машина стоїть, присадки втрачають властивості. Мінімум один раз на рік — обов’язкове правило. \n4. Колір оливи: Якщо олива почорніла — вона працює (миє), але якщо вона стала густою — це сигнал до негайної заміни.'
      }
    }
  },
  {
    id: 'how-to-spot-fake-bardahl',
    date: '2024-04-01',
    image: 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?q=80&w=2670&auto=format&fit=crop',
    locales: {
      ru: {
        title: 'Как отличить оригинальный Bardahl от подделки?',
        preview: 'Полный гайд по защитным элементам канистр Bardahl: батч-коды, пробки и особенности литья.',
        readMore: 'Популярность Bardahl привела к появлению низкокачественных копий. Как не убить мотор фальсификатом? \n\n1. Проверяйте батч-код: На нижней части канистры он должен быть выбит лазером (четко ощущается пальцем). \n2. Качество пластика: Оригинальная канистра имеет ровные швы и матовую поверхность. \n3. QR-код: На этикетке всегда есть ссылка на официальный сайт производителя в Бельгии. \n4. Цвет масла: Технология Fullerene C60 часто дает специфический оттенок, который сложно подделать.'
      },
      uk: {
        title: 'Як відрізнити оригінальний Bardahl від підробки?',
        preview: 'Повний гайд по захисним елементам каністр Bardahl: батч-коди, пробки та особливості лиття.',
        readMore: 'Популярність Bardahl призвела до появи низькоякісних копій. Як не вбити мотор фальсифікатом? \n\n1. Перевіряйте батч-код: На нижній частині каністри він має бути вибитий лазером (чітко відчувається пальцем). \n2. Якість пластику: Оригінальна каністра має рівні шви та матову поверхню. \n3. QR-код: На етикетці завжди є посилання на офіційний сайт виробника в Бельгії. \n4. Колір оливи: Технологія Fullerene C60 часто дає специфічний відтінок, який складно підробити.'
      }
    }
  }
];

export const blogService = {
  async getAllMaster(): Promise<MasterBlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        return FALLBACK_BLOG;
      }
      return data && data.length > 0 ? data : FALLBACK_BLOG;
    } catch (e) {
      return FALLBACK_BLOG;
    }
  },

  async getAll(lang: Language): Promise<BlogPost[]> {
    const masters = await this.getAllMaster();
    return masters.map(m => {
      const locale = m.locales[lang] || m.locales.ru;
      return {
        id: m.id,
        date: m.date,
        image: m.image,
        title: locale.title,
        preview: locale.preview,
        readMore: locale.readMore || '...',
        seo: locale.seo
      };
    });
  },

  async getById(id: string, lang: Language): Promise<MasterBlogPost | null> {
    const masters = await this.getAllMaster();
    return masters.find(m => m.id === id) || null;
  },

  async upsertPost(post: MasterBlogPost): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .upsert(post);
    
    if (error) throw new Error(error.message);
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },

  generateAiMarkup(post: MasterBlogPost, lang: Language = 'ru') {
    const locale = post.locales[lang] || post.locales.ru;
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": locale.title,
      "description": locale.preview,
      "image": post.image,
      "datePublished": post.date,
      "inLanguage": lang,
      "articleBody": locale.readMore,
      "author": {
        "@type": "Organization",
        "name": "Bardahl Ukraine Experts"
      }
    };
  }
};
