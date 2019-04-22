import BigNumber from 'utils/bigNumber';
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
            const balance = BigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = tokenInfo[tokenId] || {};
            balanceInfo[tokenId].id = tokenId;
            balanceInfo[tokenId].balance = balance;
            balanceInfo[tokenId].decimals = decimals;
            balanceInfo[tokenId].tokenSymbol = tokenInfo.tokenSymbol;
            balanceInfo[tokenId].transNum = item.number;
        }

        for (const tokenId in state.onroad.balanceInfos) {
            const item = state.onroad.balanceInfos[tokenId];

            const tokenInfo = item.tokenInfo;
            const decimals = tokenInfo.decimals;
            const balance = BigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = balanceInfo[tokenId] || {};
            balanceInfo[tokenId].id = balanceInfo[tokenId].id || tokenInfo.id;
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
        // ------------------- show default token
        const list = Object.keys(defaultTokenMap).map(i => {
            const { tokenName = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'NATIVE', gateInfo = {} } = Object.assign({}, defaultTokenMap[i], balanceInfo[i] || {}, allToken[i] || {});
            return { tokenName, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
        });
        // force vite first
        const viteId = constant.Vite_TokenId;
        return list.splice(list.findIndex(v => v.tokenId === viteId), 1).concat(list);
    },
    officalGateTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const officalGateTokens = rootGetters.mapGate2Token[OFFICAL_GATE_NAME] ? rootGetters.mapGate2Token[OFFICAL_GATE_NAME].tokens : [];
        return officalGateTokens.map(token => {
            const i = token['tokenId'];
            const { tokenName = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'OFFICAL_GATE', gateInfo = {} } = Object.assign({}, token[i], balanceInfo[i] || {}, allToken[i] || {});
            return { tokenName, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
        });
    },
    userStorageTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const userStorageTokenMap = gateStorage.data;
        // ------- show user defined gate
        const userStorageTokenList = Object.keys(userStorageTokenMap).map(i => {
            const { tokenName = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'THRID_GATE', gateInfo = {} } = Object.assign({}, userStorageTokenMap[i], balanceInfo[i] || {}, allToken[i] || {});
            return { tokenName, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
        });
        return userStorageTokenList;
    },
    otherWhithBalance(state, getters) {
        const contains = [ ...getters.userStorageTokenList, ...getters.defaultTokenList, ...getters.officalGateTokenList ].map(t => t.tokenId);
        return Object.keys(getters.balanceInfo).filter(i => contains.indexOf(i) === -1);
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
