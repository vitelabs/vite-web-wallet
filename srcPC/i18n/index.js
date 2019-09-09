import Vue from 'vue';
import VueI18n from 'vue-i18n';
import localStorage from 'pcUtils/store';

import en from 'i18n/en';
import zh from 'i18n/zh';
import id from 'i18n/id';
// Import de from 'i18n/de';
// import fr from 'i18n/fr';
// import ja from 'i18n/ja';
// import ru from 'i18n/ru';


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
    silentFallbackWarn: true,
    messages: { en, zh, id_ID: id }
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
