import en from './en';
import zh from './zh';
import localStorage from 'utils/localStorage';

export default function() {
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
            zh
        }
    };
}