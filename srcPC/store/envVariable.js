import {
    storage as localStorage,
    constant
} from 'pcUtils/store';
import { getApiConfig } from 'services/dnsHostIP';

const { LangKey, GateKey, ThemeKey, autoLogoutKey, currencyKey, CustomNodes, CurrentNode } = constant;
const HideZeroAssets = constant.HideZeroAssets;

const theme = localStorage.getItem(ThemeKey);
let customNodes = localStorage.getItem(CustomNodes);
customNodes = Array.isArray(customNodes) ? customNodes : [];
const defaultNode = process.env.goViteServer;

const state = {
    clientStatus: -1,
    lang: '',
    currency: localStorage.getItem(currencyKey) || '',
    autoLogoutTime: localStorage.getItem(autoLogoutKey) || 5,
    gate: +localStorage.getItem(GateKey) || 0,
    theme: theme === null ? 1 : +theme,
    lastPage: '',
    isShowCompliance: false,
    hideZeroAssets: +localStorage.getItem(HideZeroAssets) || 0,
    customNodes,
    officialNodes: []
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
    },
    setOfficialNodes(state, nodes) {
        if (nodes.indexOf(defaultNode) === -1) {
            nodes.push(defaultNode);
        }
        state.officialNodes = nodes;
    },
    setCustomNodes(state, nodes) {
        state.customNodes = nodes;
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
    },
    getApiConfig({ commit }) {
        getApiConfig().then(data => {
            const officialNodes = data['WALLETWSAPI'].hostNameList;
            commit('setOfficialNodes', officialNodes);
        });
    },
    addCustomNode({ commit, state }, newNode) {
        if (!newNode) return;
        const customNodes = state.customNodes.concat([newNode]).filter(item => item);
        commit('setCustomNodes', customNodes);
        localStorage.setItem(CustomNodes, customNodes);
    },
    deleteCustomNode({ commit }, node) {
        const customNodes = state.customNodes.filter(item => item !== node);
        commit('setCustomNodes', customNodes);
        localStorage.setItem(CustomNodes, customNodes);
    },
    changeNode({ commit }, node) {
        localStorage.setItem(CurrentNode, node);
    }
};

const getters = {
    currencySymbol(state) {
        const symbolMap = {
            cny: '¥',
            usd: '$'
        };
        return symbolMap[state.currency];
    },
    allRpcNodes(state) {
        const all = state.officialNodes.concat(state.customNodes);
        return Array.from(new Set(all));
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
