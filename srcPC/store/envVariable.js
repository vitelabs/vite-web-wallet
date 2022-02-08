import { storage as localStorage, constant } from 'pcUtils/store';
import { getSymbol, lowerSymbolList } from 'src/utils/currenySymbol';

import { getApiConfig } from 'services/dnsHostIP';
import d from 'dayjs';

const {
    LangKey,
    GateKey,
    ThemeKey,
    AutoLogoutKey,
    currencyKey,
    CustomNodes,
    CurrentNode,
    PowLimit
} = constant;
const HideZeroAssets = constant.HideZeroAssets;

const theme = localStorage.getItem(ThemeKey);
let customNodes = localStorage.getItem(CustomNodes);
customNodes = Array.isArray(customNodes) ? customNodes : [];
const defaultNode = process.env.goViteServer;
const defaultPowLimit = localStorage.getItem(PowLimit) || {};
const defaultPowMaxTimes = process.env.NODE_ENV === 'production' ? 100 : 5;

const state = {
    clientStatus: -1,
    lang: '',
    currency: localStorage.getItem(currencyKey) || '',
    autoLogoutTime: localStorage.getItem(AutoLogoutKey) || 5,
    gate: +localStorage.getItem(GateKey) || 0,
    theme: theme === null ? 1 : +theme,
    lastPage: '',
    isShowCompliance: false,
    hideZeroAssets: +localStorage.getItem(HideZeroAssets) || 0,
    customNodes,
    officialNodes: [],
    currentNode: '',
    powMaxTimes: defaultPowMaxTimes,
    powLimit: defaultPowLimit
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
            state.currency = 'usd';
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
        if (lowerSymbolList.indexOf(currency) === -1) {
            return;
        }
        state.currency = currency;
        localStorage.setItem(currencyKey, currency);
    },
    setAutoLogoutTime(state, time) {
        localStorage.setItem(AutoLogoutKey, time);
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
    },
    setCurrentNode(state, node) {
        state.currentNode = node;
    },
    setPowLimit(state, powLimit) {
        localStorage.setItem(PowLimit, powLimit);
        state.powLimit = powLimit;
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
        const customNodes = state.customNodes
            .concat([newNode])
            .filter(item => item);
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
        commit('setCurrentNode', node);
    },
    updatePowLimit({ commit, state }, { address, time = 1 }) {
        const { powLimit } = state;
        const today = d().format('DD-MM-YYYY');
        let addrPowLimit = { ...powLimit[address] };
        if (addrPowLimit && addrPowLimit.lastUpdate === today) {
            addrPowLimit = {
                time: addrPowLimit.time + time,
                lastUpdate: today
            };
        } else {
            addrPowLimit = {
                time,
                lastUpdate: today
            };
        }
        commit('setPowLimit', {
            ...powLimit,
            [address]: addrPowLimit
        });
    }
};

const getters = {
    currencySymbol(state) {
        return getSymbol[state.currency];
    },
    allRpcNodes(state) {
        const all = state.officialNodes.concat(state.customNodes);
        return Array.from(new Set(all));
    },
    powTimesLeft(state, getters) {
        const addr = getters.activeAddr;
        const tmp = state.powLimit[addr];
        const today = d().format('DD-MM-YYYY');

        if (tmp && tmp.lastUpdate === today) {
            return state.powMaxTimes - tmp.time;
        }
        return state.powMaxTimes;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
