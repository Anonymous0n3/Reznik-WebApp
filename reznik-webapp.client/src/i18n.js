import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import českých textů
import navCS from './locales/cs/nav.json';
import homeCS from './locales/cs/home.json';
import dogsCS from './locales/cs/dogs.json';
import litterCS from './locales/cs/litters.json';
import galleryCS from './locales/cs/gallery.json';
import contactCS from './locales/cs/contact.json';

// Import anglických textů
import navEN from './locales/en/nav.json';
import homeEN from './locales/en/home.json';
import dogsEN from './locales/en/dogs.json';
import litterEN from './locales/en/litters.json';
import galleryEN from './locales/en/gallery.json';
import contactEN from './locales/en/contact.json';

const resources = {
    cs: {
        translation: {
            nav: navCS,
            home: homeCS,
            dogs: dogsCS,
            litters: litterCS,
            gallery: galleryCS,
            contact: contactCS
        }
    },
    en: {
        translation: {
            nav: navEN,
            home: homeEN,
            dogs: dogsEN,
            litters: litterEN,
            gallery: galleryEN,
            contact: contactEN
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'cs',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;