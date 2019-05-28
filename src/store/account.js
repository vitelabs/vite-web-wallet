import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { StatusMap } from 'wallet';
import { defaultTokenMap } from 'utils/constant';
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
        state.balance.balanceInfos = state.balance && state.balance.tokenBalanceInfoMap
            ? state.balance.tokenBalanceInfoMap
            : {};

        state.onroad = payload.onroad || {};
        state.onroad.balanceInfos = state.onroad && state.onroad.tokenBalanceInfoMap
            ? state.onroad.tokenBalanceInfoMap
            : {};
    },
    commitClearBalance(state) {
        state.balance = { balanceInfos: {} };
        state.onroad = { balanceInfos: {} };
    }
};
const actions = {
    startLoopBalance({
        commit,
        dispatch,
        rootState
    }) {
        dispatch('stopLoopBalance');
        balanceInfoInst = new timer(() => {
            const activeAcc = rootState.wallet.activeAcc;
            if (!activeAcc) {
                return;
            }

            if (rootState.wallet.status === StatusMap.UNLOCK) {
                return commit('commitBalanceInfo', activeAcc.balance);
            }

            return activeAcc.getBalance().then(data => {
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
        const exBalance = rootGetters.exBalanceList;
        // ------------------- show default token
        const list = Object.keys(defaultTokenMap).map(i => {
            const {
                availableExAmount = 0,
                totalExAmount = 0,
                onroadNum = '',
                totalAmount = 0,
                tokenName = '',
                totalSupply = '',
                isReIssuable = '',
                tokenSymbol,
                balance = '',
                fundFloat = '',
                decimals = '',
                owner = '',
                tokenId = i,
                icon,
                type = 'NATIVE',
                gateInfo = {}
            } = Object.assign({},
                defaultTokenMap[i],
                balanceInfo[i] || {},
                allToken[i] || {}, { gateInfo: { url: mapToken2Gate[i] && mapToken2Gate[i].url } },
                exBalance[i]);
            const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][rootState.env.currency];
            const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount, decimals), rate) : 0;
            const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount, decimals), rate) : 0;
            const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
            return {
                totalAsset,
                totalExAsset,
                walletAsset,
                availableExAmount,
                totalExAmount,
                onroadNum,
                totalAmount,
                tokenName,
                totalSupply,
                isReIssuable,
                tokenSymbol,
                balance,
                fundFloat,
                decimals,
                owner,
                tokenId,
                icon,
                type,
                gateInfo
            };
        });
        // force vite first
        const viteId = constant.Vite_TokenId;
        return list
            .splice(list.findIndex(v => v.tokenId === viteId), 1)
            .concat(list);
    },
    officalGateTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const mapToken2Gate = rootGetters.mapToken2Gate;
        const exBalance = rootGetters.exBalanceList;

        return Object.keys(mapToken2Gate).map(i => {
            const {
                availableExAmount = '',
                totalExAmount = '',
                onroadNum = '',
                tokenName = '',
                totalAmount = '',
                totalSupply = '',
                isReIssuable = '',
                tokenSymbol,
                balance = '',
                fundFloat = '',
                decimals = '',
                owner = '',
                tokenId = i,
                icon,
                type = 'OFFICAL_GATE',
                gateInfo = {}
            } = Object.assign({}, balanceInfo[i] || {}, allToken[i] || {}, {
                gateInfo: {
                    url: mapToken2Gate[i].url,
                    gataway: mapToken2Gate[i].gateway
                }
            }, exBalance[i]);
            const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][rootState.env.currency];
            const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount, decimals), rate) : 0;
            const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount, decimals), rate) : 0;
            const totalAsset = bigNumber.plus(totalExAsset, walletAsset);

            return {
                totalAsset,
                totalExAsset,
                walletAsset,
                availableExAmount,
                totalExAmount,
                onroadNum,
                tokenName,
                totalAmount,
                totalSupply,
                isReIssuable,
                tokenSymbol,
                balance,
                fundFloat,
                decimals,
                owner,
                tokenId,
                icon,
                type,
                gateInfo
            };
        });
    },
    userStorageTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const exBalance = rootGetters.exBalanceList;

        // const mapToken2Gate = rootGetters.mapToken2Gate;
        // ------- show user defined gate
        gateStorage.updateFromStorage();
        const userStorageTokenList = gateStorage.data;
        const res = userStorageTokenList
            .map(token => {
                const i = token.tokenId;
                const {
                    availableExAmount = '',
                    totalExAmount = '',
                    onroadNum = '',
                    tokenName = '',
                    totalAmount = '',
                    totalSupply = '',
                    isReIssuable = '',
                    tokenSymbol,
                    balance = '',
                    fundFloat = '',
                    decimals = '',
                    owner = '',
                    tokenId = i,
                    icon,
                    type = 'THIRD_GATE',
                    gateInfo = {}
                } = Object.assign({}, token, balanceInfo[i] || {}, allToken[i] || {}, exBalance[i]);
                const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][rootState.env.currency];
                const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount, decimals), rate) : 0;
                const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount, decimals), rate) : 0;
                const totalAsset = bigNumber.plus(totalExAsset, walletAsset);

                return {
                    totalAsset,
                    totalExAsset,
                    walletAsset,
                    availableExAmount,
                    totalExAmount,
                    onroadNum,
                    tokenName,
                    totalAmount,
                    totalSupply,
                    isReIssuable,
                    tokenSymbol,
                    balance,
                    fundFloat,
                    decimals,
                    owner,
                    tokenId,
                    icon,
                    type,
                    gateInfo
                };
            })
            .filter(t =>
                getters.officalGateTokenList
                    .map(t => t.tokenId)
                    .indexOf(t.tokenId) === -1);
        return res;
    },
    otherWhithBalance(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const mapToken2Gate = rootGetters.mapToken2Gate;
        const exBalance = rootGetters.exBalanceList;
        const contains = [
            ...getters.userStorageTokenList,
            ...getters.defaultTokenList,
            ...getters.officalGateTokenList
        ].map(t => t.tokenId);
        return Object.keys(allToken)
            .filter(i => {
                const walletAmount = getters.balanceInfo[i] ? getters.balanceInfo[i].totalAmount : 0;
                const exAmount = exBalance[i] ? exBalance[i].totalExAmount : 0;
                return (!bigNumber.isEqual(walletAmount, 0) || !bigNumber.isEqual(exAmount, 0)) && contains.indexOf(i) === -1;
            })
            .map(i => {
                const {
                    availableExAmount = '',
                    totalExAmount = '',
                    onroadNum = '',
                    tokenName = '',
                    totalAmount = '',
                    totalSupply = '',
                    isReIssuable = '',
                    tokenSymbol,
                    balance = '',
                    fundFloat = '',
                    decimals = '',
                    owner = '',
                    tokenId = i,
                    icon,
                    type = 'THIRD_GATE',
                    gateInfo = {}
                } = Object.assign({}, balanceInfo[i] || {}, allToken[i] || {}, { gateInfo: { url: mapToken2Gate[i] && mapToken2Gate[i].url } });
                const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][rootState.env.currency];
                const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount, decimals), rate) : 0;
                const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount, decimals), rate) : 0;
                const totalAsset = bigNumber.plus(totalExAsset, walletAsset);

                return {
                    totalAsset,
                    walletAsset,
                    totalExAmount,
                    availableExAmount,
                    totalExAsset,
                    onroadNum,
                    tokenName,
                    totalAmount,
                    totalSupply,
                    isReIssuable,
                    tokenSymbol,
                    balance,
                    fundFloat,
                    decimals,
                    owner,
                    tokenId,
                    icon,
                    type,
                    gateInfo
                };
            });
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
