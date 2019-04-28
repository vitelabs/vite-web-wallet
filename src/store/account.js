import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { wallet } from 'utils/wallet';
import { defaultTokenMap, OFFICAL_GATE_NAME } from 'utils/constant';
import { gateStorage } from 'services/gate';
import { constant } from '@vite/vitejs';

let balanceInfoInst = null;
const state = {
    onroad: { balanceInfos: {} },
    balance: { balanceInfos: {} }
};

const mutations = {
    commitBalanceInfo(state, payload) {
        if (!payload) {
            state.balance = { balanceInfos: {} };
            state.onroad = { balanceInfos: {} };
            return;
        }

        state.balance = payload.balance || {};
        state.balance.balanceInfos = state.balance && state.balance.tokenBalanceInfoMap ? state.balance.tokenBalanceInfoMap : {};

        state.onroad = payload.onroad || {};
        state.onroad.balanceInfos = state.onroad && state.onroad.tokenBalanceInfoMap ? state.onroad.tokenBalanceInfoMap : {};
    },
    commitClearBalance(state) {
        state.balance = { balanceInfos: {} };
        state.onroad = { balanceInfos: {} };
    }
};
const actions = {
    startLoopBalance({ commit, dispatch }) {
        dispatch('stopLoopBalance');
        balanceInfoInst = new timer(() => {
            const account = wallet.getActiveAccount();
            if (!account) {
                return;
            }
            if (account.type !== 'address') {
                return commit('commitBalanceInfo', account.syncGetBalance());
            }

            return account.getBalance().then(data => {
                commit('commitBalanceInfo', data);
            });
        }, 1000);
        balanceInfoInst.start();
    },
    stopLoopBalance({ commit }) {
        balanceInfoInst && balanceInfoInst.stop();
        balanceInfoInst = null;
        commit('commitClearBalance');
        commit('commitClearTransList');
        commit('commitClearPledge');
    }
};

const getters = {
    balanceInfo(state) {
        // -------- merge balance&onroad
        const balanceInfo = Object.create(null);
        for (const tokenId in state.balance.balanceInfos) {
            const item = state.balance.balanceInfos[tokenId];

            const tokenInfo = item.tokenInfo;
            const decimals = tokenInfo.decimals;
            const balance = bigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = tokenInfo[tokenId] || {};
            balanceInfo[tokenId].tokenId = tokenId;
            balanceInfo[tokenId].balance = balance;
            balanceInfo[tokenId].decimals = decimals;
            balanceInfo[tokenId].tokenSymbol = tokenInfo.tokenSymbol;
            balanceInfo[tokenId].transNum = item.number;
            balanceInfo[tokenId].totalAmount = item.totalAmount;
        }

        for (const tokenId in state.onroad.balanceInfos) {
            const item = state.onroad.balanceInfos[tokenId];

            const tokenInfo = item.tokenInfo;
            const decimals = tokenInfo.decimals;
            const balance = bigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = balanceInfo[tokenId] || {};
            balanceInfo[tokenId].tokenId = balanceInfo[tokenId].tokenId || tokenInfo.tokenId;
            balanceInfo[tokenId].fundFloat = balance;
            balanceInfo[tokenId].decimals = balanceInfo[tokenId].decimals || tokenInfo.decimals;
            balanceInfo[tokenId].tokenSymbol = balanceInfo[tokenId].tokenSymbol || tokenInfo.tokenSymbol;
            balanceInfo[tokenId].onroadNum = item.number;
        }
        return balanceInfo;
    },
    defaultTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const mapToken2Gate = rootGetters.mapToken2Gate;
        // ------------------- show default token
        const list = Object.keys(defaultTokenMap).map(i => {
            const { onroadNum = '', totalAmount = '', tokenName = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'NATIVE', gateInfo = {} } = Object.assign({}, defaultTokenMap[i], balanceInfo[i] || {}, allToken[i] || {}, { gateInfo: { url: mapToken2Gate[i] && mapToken2Gate[i].url } });
            return { onroadNum, totalAmount, tokenName, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
        });
        // force vite first
        const viteId = constant.Vite_TokenId;
        return list.splice(list.findIndex(v => v.tokenId === viteId), 1).concat(list);
    },
    officalGateTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const officalGateTokens = rootGetters.mapGate2Token[OFFICAL_GATE_NAME] ? rootGetters.mapGate2Token[OFFICAL_GATE_NAME].tokens : [];
        const mapToken2Gate = rootGetters.mapToken2Gate;
        return officalGateTokens.map(token => {
            const i = token['tokenId'];
            const { onroadNum = '', tokenName = '', totalAmount = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'OFFICAL_GATE', gateInfo = {} } = Object.assign({}, token[i], balanceInfo[i] || {}, allToken[i] || {}, { gateInfo: { url: mapToken2Gate[i] && mapToken2Gate[i].url } });
            return { onroadNum, tokenName, totalAmount, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
        });
    },
    userStorageTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        // const mapToken2Gate = rootGetters.mapToken2Gate;
        // ------- show user defined gate
        gateStorage.updateFromStorage();
        const userStorageTokenList = gateStorage.data;
        const res = userStorageTokenList.map(token => {
            const i = token.tokenId;
            const { onroadNum = '', tokenName = '', totalAmount = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'THIRD_GATE', gateInfo = {} } = Object.assign({}, token, balanceInfo[i] || {}, allToken[i] || {});
            return { onroadNum, tokenName, totalAmount, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
        }).filter(t => getters.officalGateTokenList.map(t => t.tokenId).indexOf(t.tokenId) === -1);
        return res;
    },
    otherWhithBalance(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const mapToken2Gate = rootGetters.mapToken2Gate;
        const contains = [ ...getters.userStorageTokenList, ...getters.defaultTokenList, ...getters.officalGateTokenList ].map(t => t.tokenId);
        return Object.keys(getters.balanceInfo).filter(i => !bigNumber.isEqual(getters.balanceInfo[i].totalAmount, 0) && contains.indexOf(i) === -1).map(i => {
            const { onroadNum = '', tokenName = '', totalAmount = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'THIRD_GATE', gateInfo = {} } = Object.assign({}, balanceInfo[i] || {}, allToken[i] || {}, { gateInfo: { url: mapToken2Gate[i] && mapToken2Gate[i].url } });
            return { onroadNum, tokenName, totalAmount, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
        });
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
