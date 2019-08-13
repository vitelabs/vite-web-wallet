import Vue from 'vue';
import VueI18n from 'vue-i18n';
import localStorage from 'utils/store';

import en from './en';
import zh from './zh';
import id from './id';
// Import de from './de';
// import fr from './fr';
// import ja from './ja';
// import ru from './ru';


let appLocale = window.viteWalletI18n ? window.viteWalletI18n.locale : '';
if (appLocale) {
    appLocale = appLocale.indexOf('zh') === 0 ? 'zh' : 'en';
}
const locale = localStorage.getItem('lang') || appLocale || getDefaultLang() || 'en';

// De,
// fr,
// ja,
// ru
const i18nConf = {
    locale,
    fallbackLocale: 'en',
    messages: { en, zh, id }
};

Vue.use(VueI18n);
export default new VueI18n(i18nConf);


function getDefaultLang() {
    try {
        const type = navigator.appName;

        // type == 'Netscape' ? !IE : IE5+ == navigator.systemLanguage
        let lang = type === 'Netscape' ? navigator.language : navigator.userLanguage;
        lang = lang.substr(0, 2);

        return lang === 'zh' ? 'zh' : 'en';
    } catch (err) {
        console.warn(err);
        return 'en';
    }
}
