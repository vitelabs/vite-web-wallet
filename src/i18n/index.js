import en from './en';
import zh from './zh';
import localStorage from 'utils/localStorage';

export default function() {
    let locale = localStorage.getItem('lang') || 'en';

    return {
        locale,
        fallbackLocale: 'en',
        messages: {
            en, 
            zh
        }
    };
}