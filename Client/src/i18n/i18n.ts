import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import am from './locales/am.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import ja from './locales/ja.json';
import de from './locales/de.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      am: { translation: am },
      zh: { translation: zh },
      es: { translation: es },
      ar: { translation: ar },
      hi: { translation: hi },
      fr: { translation: fr },
      pt: { translation: pt },
      ru: { translation: ru },
      ja: { translation: ja },
      de: { translation: de },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'todo_lang',
    },
  });

export default i18n;
