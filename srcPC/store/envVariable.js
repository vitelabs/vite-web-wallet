import {
    storage as localStorage,
    constant
} from 'pcUtils/store';

const currencyKey = constant.CurrencyKey;
const autoLogoutKey = constant.AutoLogoutKey;
const LangKey = constant.LangKey;
const GateKey = constant.GateKey;
const ThemeKey = constant.ThemeKey;
const HideZeroAssets = constant.HideZeroAssets;

const state = {
    clientStatus: -1,
    lang: '',
    currency: localStorage.getItem(currencyKey) || '',
    autoLogoutTime: localStorage.getItem(autoLogoutKey) || 5,
    gate: +localStorage.getItem(GateKey) || 0,
    theme: +localStorage.getItem(ThemeKey) || 0,
    lastPage: '',
    isShowCompliance: false,
    hideZeroAssets: +localStorage.getItem(HideZeroAssets) || 0
};

const mutations = {
    setComplianceShow(state) {
        state.isShowCompliance = true;
    },
    setClientNetStatus(state, clientStatus) {
        state.clientStatus = clientStatus;
    },
    setLang(state, lang) {
        localStorage.setItem(LangKey, lang);
        state.lang = lang;
        if (!state.currency) {
            state.currency = lang === 'zh' ? 'cny' : 'usd';
        }
    },
    setGate(state, isOpen) {
        localStorage.setItem(GateKey, isOpen ? 1 : 0);
        state.gate = isOpen ? 1 : 0;
    },
    setTheme(state, theme) {
        localStorage.setItem(ThemeKey, theme);
        state.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
    },
    setCurrency(state, currency) {
        currency = currency.toLowerCase();
        if ([ 'cny', 'usd' ].indexOf(currency) === -1) {
            return;
        }
        state.currency = currency;
        localStorage.setItem(currencyKey, currency);
    },
    setAutoLogoutTime(state, time) {
        localStorage.setItem(autoLogoutKey, time);
        state.autoLogoutTime = time;
    },
    setLastPage(state, lastPage) {
        state.lastPage = lastPage;
    },
    setHideZeroAssets(state, isHide) {
        const _isHide = +isHide || 0;
        localStorage.setItem(HideZeroAssets, _isHide);
        state.hideZeroAssets = _isHide;
    }
};

const actions = {
    onNetStatus({ commit }) {
        window.addEventListener('online', () => {
            commit('setClientNetStatus', navigator.onLine);
        });
        window.addEventListener('offline', () => {
            commit('setClientNetStatus', navigator.onLine);
        });
    }
};

const getters = {
    currencySymbol(state) {
        const symbolMap = {
            cny: '¥',
            usd: '$'
        };
        return symbolMap[state.currency];
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
