import { constant, addrAccount } from '@vite/vitejs';

import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { defaultTokenMap } from 'utils/constant';
import { getTokenIcon } from 'utils/tokenParser';
import client from 'utils/viteClient';
import env from 'h5Utils/envFromURL';

let balanceInfoInst = null;
const activeAcc = new addrAccount({ address: env.address, client });

const state = {
    address: env.address || '',
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
    startLoopBalance({ commit, dispatch }) {
        dispatch('stopLoopBalance');
        balanceInfoInst = new timer(() => activeAcc.getBalance().then(data => {
            commit('commitBalanceInfo', data);
        }), 1000);
        balanceInfoInst.start();
    },
    stopLoopBalance() {
        balanceInfoInst && balanceInfoInst.stop();
        balanceInfoInst = null;
    }
};

const getters = {
    activeAddr(state) {
        return state.address || '';
    },
    balanceInfo(state) {
        // -------- merge balance & onroad
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
        const exBalance = rootGetters.exBalanceList;

        // ------------------- show default token
        const list = Object.keys(defaultTokenMap).map(i => {
            const {
                index,
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
                icon = getTokenIcon(i),
                type = 'NATIVE'
            } = Object.assign({},
                defaultTokenMap[i],
                balanceInfo[i] || {},
                exBalance[i]);
            const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][`${ rootState.env.currency }Rate`];
            const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rate) : 0;
            const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rate) : 0;
            const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
            const rateBtc = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i]['btcRate'];
            const totalExAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rateBtc) : 0;
            const walletAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rateBtc) : 0;
            const totalAssetBtc = bigNumber.plus(totalExAssetBtc, walletAssetBtc);
            return {
                totalExAssetBtc,
                walletAssetBtc,
                totalAssetBtc,
                index,
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
                type
            };
        });
        // force vite first
        const viteId = constant.Vite_TokenId;
        return list
            .splice(list.findIndex(v => v.tokenId === viteId), 1)
            .concat(list);
    },
    otherWithBalance(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const exBalance = rootGetters.exBalanceList;
        const contains = (getters.defaultTokenList || []).map(t => t.tokenId);

        const allToken = Object.assign({}, exBalance, balanceInfo);

        return Object.keys(allToken)
            .filter(i => {
                const walletAmount = getters.balanceInfo[i] ? getters.balanceInfo[i].totalAmount : 0;
                const exAmount = exBalance[i] ? exBalance[i].totalExAmount : 0;
                return (!bigNumber.isEqual(walletAmount, 0) || !bigNumber.isEqual(exAmount, 0)) && contains.indexOf(i) === -1;
            })
            .map(i => {
                const {
                    index,
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
                    icon = getTokenIcon(i),
                    type = 'THIRD_GATE'
                } = Object.assign({}, balanceInfo[i] || {}, allToken[i] || {});
                const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][`${ rootState.env.currency }Rate`];
                const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rate) : 0;
                const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rate) : 0;
                const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
                const rateBtc = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i]['btcRate'];
                const totalExAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rateBtc) : 0;
                const walletAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rateBtc) : 0;
                const totalAssetBtc = bigNumber.plus(totalExAssetBtc, walletAssetBtc);
                return {
                    totalExAssetBtc,
                    walletAssetBtc,
                    totalAssetBtc,
                    index,
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
                    type: (tokenSymbol === 'VCP' && !index) ? 'NATIVE' : type
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
