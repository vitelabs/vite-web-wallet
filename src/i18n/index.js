import en from './en';
import zh from './zh';
import localStorage from 'utils/localStorage';

let locale = localStorage.getItem('lang') || 'en';

export default {
    locale,
    fallbackLocale: 'en',
    messages: {
        en, 
        zh
    }
};