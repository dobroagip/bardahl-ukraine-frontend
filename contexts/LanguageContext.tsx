
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Product, Category, Promotion } from '../types';
import { UI_TEXT } from '../constants';
import { productService } from '../services/productService';
import { promotionService } from '../services/promotionService';
import { categoryService } from '../services/categoryService';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('bardahl_lang') as Language) || 'ru';
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    localStorage.setItem('bardahl_lang', language);
    
    const loadContent = async () => {
      try {
        // Все сервисы теперь асинхронные, используем Promise.all для скорости
        const [prodList, catList, promoList] = await Promise.all([
          productService.getAll(language),
          categoryService.getAll(language),
          promotionService.getAll(language)
        ]);

        setProducts(prodList);
        setCategories(catList);
        setPromotions(promoList);
      } catch (error) {
        console.error("Failed to load content from Supabase:", error);
      }
    };

    loadContent();
  }, [language]);

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = UI_TEXT[language];
    for (const k of keys) {
      if (!current || current[k] === undefined) return path;
      current = current[k];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, products, categories, promotions, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
