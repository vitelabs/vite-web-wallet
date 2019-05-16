import localStorage from 'utils/store';

// [TODO] utils/store 统一

const currencyKey = 'currency';
const autoLogoutKey = 'autoLogoutTime';

// coins: {
//     en: 'usd',
//     zh: 'cny'
// }

const state = {
    clientStatus: -1,
    lang: '',
    currency: localStorage.getItem(currencyKey) || '',
    autoLogoutTime: localStorage.getItem(autoLogoutKey) || 5,
    lastPage: ''
};

const mutations = {
    setClientNetStatus(state, clientStatus) {
        state.clientStatus = clientStatus;
    },
    setLang(state, lang) {
        localStorage.setItem('lang', lang);
        state.lang = lang;
        if (!state.currency) {
            state.currency = lang === 'zh' ? 'cny' : 'usd';
        }
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

export default { state, mutations, actions };
