import Vue from 'vue';
import VueI18n from 'vue-i18n';
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

// De,
// fr,
// ja,
// ru
const i18nConf = {
    locale,
    fallbackLocale: 'en',
    messages: { en, zh }
};

Vue.use(VueI18n);
export default new VueI18n(i18nConf);
