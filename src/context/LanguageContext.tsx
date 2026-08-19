import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationSchema, translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationSchema;
  isEnglish: boolean;
  isPortuguese: boolean;
  getDimenuvelText: (id: number) => {
    name: string;
    subtitle: string;
    description: string;
    contemplativeFocus: string;
    presetDescription: string;
  };
  getPresetText: (presetId: string, defaultName: string, defaultDesc: string, dimenuvelId?: number) => {
    name: string;
    description: string;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'dimenuveis_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (stored === 'pt' || stored === 'en') {
        return stored;
      }
      // Check browser language
      const browserLang = navigator.language?.toLowerCase() || '';
      if (browserLang.startsWith('en')) {
        return 'en';
      }
    }
    return 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const currentTranslations = translations[language];

  const getDimenuvelText = (id: number) => {
    const d = currentTranslations.dimenuveis[id] || translations.pt.dimenuveis[id];
    const ordSuffix = id === 1 ? 'st' : id === 2 ? 'nd' : id === 3 ? 'rd' : 'th';
    return d || {
      name: language === 'en' ? `Dimenuous ${id}` : `Dimenúvel ${id}`,
      subtitle: language === 'en' ? `${id}${ordSuffix} Dimenuous` : `${id}ª Dimenúvel`,
      description: '',
      contemplativeFocus: '',
      presetDescription: '',
    };
  };

  const getPresetText = (presetId: string, defaultName: string, defaultDesc: string, dimenuvelId?: number) => {
    if (dimenuvelId && currentTranslations.dimenuveis[dimenuvelId]) {
      const dim = currentTranslations.dimenuveis[dimenuvelId];
      return {
        name: `${dimenuvelId}. ${dim.name}`,
        description: dim.presetDescription || dim.description,
      };
    }
    if (currentTranslations.contemplativePresetsData[presetId]) {
      return currentTranslations.contemplativePresetsData[presetId];
    }
    return {
      name: defaultName,
      description: defaultDesc,
    };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: currentTranslations,
        isEnglish: language === 'en',
        isPortuguese: language === 'pt',
        getDimenuvelText,
        getPresetText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
