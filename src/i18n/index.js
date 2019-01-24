import en from './en';
import zh from './zh';
// import de from './de';
// import fr from './fr';
// import ja from './ja';
// import ru from './ru';
import localStorage from 'utils/localStorage';
import Vue from 'vue';

function i18nCon() {
    let appLocale = window.viteWalletI18n ? window.viteWalletI18n.locale : '';
    if (appLocale) {
        appLocale = appLocale.indexOf('zh') === 0 ? 'zh' : 'en';
    }
    let locale = localStorage.getItem('lang') || appLocale || 'en';

    return {
        locale,
        fallbackLocale: 'en',
        messages: {
            en, 
            zh,
            // de,
            // fr,
            // ja,
            // ru
        }
    };
}

import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
export const i18n = new VueI18n( i18nCon() );