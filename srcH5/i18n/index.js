import Vue from 'vue';
import VueI18n from 'vue-i18n';
import env from 'h5Utils/envFromURL';

import en from 'i18n/en';
import zh from 'i18n/zh';
import id from 'i18n/id';
// import de from 'i18n/de';
// import fr from 'i18n/fr';
// import ja from 'i18n/ja';
// import ru from 'i18n/ru';

const locale = env.lang || 'en';

// de,
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
const myVueI18n = new VueI18n(i18nConf);

export default myVueI18n;
