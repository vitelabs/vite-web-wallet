import Vue from 'vue';
import VueI18n from 'vue-i18n';
import env from 'h5Utils/envFromURL';

import en from 'i18n/en';
import zh from 'i18n/zh';
import id from 'i18n/id';
import zh_TW from 'i18n/zh_TW';

const locale = env.lang || 'en';

// de,
// fr,
// ja,
// ru
const i18nConf = {
    locale,
    fallbackLocale: 'en',
    silentFallbackWarn: true,
    messages: { en, zh, zh_TW, id_ID: id }
};

Vue.use(VueI18n);
const myVueI18n = new VueI18n(i18nConf);

export default myVueI18n;
