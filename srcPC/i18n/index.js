import Vue from 'vue';
import VueI18n from 'vue-i18n';
import localStorage from 'pcUtils/store';

import en from 'i18n/en';
import zh from 'i18n/zh';
import id from 'i18n/id';
import zh_TW from 'i18n/zh_TW';

const locale = localStorage.getItem('lang') || getDefaultLang() || 'en';

const enabledLangs = [ 'en', 'zh', 'zh_TW', 'id_ID' ];

// De,
// fr,
// ja,
// ru
const i18nConf = {
    locale,
    fallbackLocale: 'en',
    silentFallbackWarn: true,
    messages: { en, zh_TW, zh, id_ID: id }
};

Vue.use(VueI18n);
export default new VueI18n(i18nConf);


function getDefaultLang() {
    try {
        const type = navigator.appName;

        // type == 'Netscape' ? !IE : IE5+ == navigator.systemLanguage
        const lang = type === 'Netscape' ? navigator.language : navigator.userLanguage;

        if (enabledLangs.indexOf(lang) > -1) {
            return lang;
        }
        const shortLang = lang.substr(0, 2);
        if (enabledLangs.indexOf(shortLang) > -1) {
            return lang;
        }
        return 'en';
    } catch (err) {
        console.warn(err);
        return 'en';
    }
}
