import localStorage from 'utils/localStorage';

import en from './en';
import zh from './zh';
// Import de from './de';
// import fr from './fr';
// import ja from './ja';
// import ru from './ru';


let appLocale = window.viteWalletI18n ? window.viteWalletI18n.locale : '';
if (appLocale) {
    appLocale = appLocale.indexOf('zh') === 0 ? 'zh' : 'en';
}
const locale = localStorage.getItem('lang') || appLocale || 'en';

export default {
    locale,
    fallbackLocale: 'en',
    messages: {
        en,
        zh
        // De,
        // fr,
        // ja,
        // ru
    }
};
