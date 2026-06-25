import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ur from './locales/ur/translation.json';
import it from './locales/it/translation.json';
import tr from './locales/tr/translation.json';
import ar from './locales/ar/translation.json';
import ru from './locales/ru/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ur: { translation: ur },
    it: { translation: it },
    tr: { translation: tr },
    ar: { translation: ar },
    ru: { translation: ru },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;