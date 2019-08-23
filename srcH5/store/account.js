import { constant, addrAccount } from '@vite/vitejs';

import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { defaultTokenMap } from 'utils/constant';
import client from 'utils/viteClient';
import env from 'h5Utils/envFromURL';
import { getTokenIcon } from 'h5Utils/tokenParser';

let balanceInfoInst = null;
const activeAcc = new addrAccount({ address: env.address, client });

const state = {
    address: env.address || '',
    balance: {}
};

const mutations = {
    commitBalanceInfo(state, payload) {
        if (!payload) {
            state.balance = {};
            return;
        }
        state.balance = payload.tokenBalanceInfoMap || {};
    },
    commitClearBalance(state) {
        state.balance = {};
    }
};

const actions = {
    startLoopBalance({ commit, dispatch }) {
        dispatch('stopLoopBalance');
        balanceInfoInst = new timer(() => activeAcc.getAccountBalance().then(data => {
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
        // -------- merge balance
        const balanceInfo = Object.create(null);
        for (const tokenId in state.balance) {
            const item = state.balance[tokenId];

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
        return balanceInfo;
    },
    defaultTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const exBalance = rootGetters.exBalanceList;

        // ------------------- show default token
        const list = Object.keys(defaultTokenMap).map(i => {
            const {
                availableExAmount = 0,
                totalExAmount = 0,
                totalAmount = 0,
                tokenName = '',
                totalSupply = '',
                isReIssuable = '',
                tokenSymbol,
                balance = '',
                decimals = '',
                owner = '',
                tokenId = i,
                icon = getTokenIcon(i)
            } = Object.assign({},
                defaultTokenMap[i] || {},
                balanceInfo[i] || {},
                exBalance[i] || {});

            const currencyRate = rootGetters.currencyRateList[i] || 0;
            const totalExAsset = bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), currencyRate);
            const walletAsset = bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), currencyRate);

            const btcRate = rootGetters.btcRateList[i] || 0;
            const totalExAssetBtc = bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), btcRate);
            const walletAssetBtc = bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), btcRate);

            return {
                totalExAssetBtc,
                walletAssetBtc,
                totalExAsset,
                walletAsset,
                availableExAmount,
                totalExAmount,
                totalAmount,
                tokenName,
                totalSupply,
                isReIssuable,
                tokenSymbol,
                balance,
                decimals,
                owner,
                tokenId,
                icon,
                totalAsset: bigNumber.plus(totalExAsset, walletAsset),
                totalAssetBtc: bigNumber.plus(totalExAssetBtc, walletAssetBtc)
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
                const exAmount = exBalance[i] ? exBalance[i].totalExAmount || 0 : 0;
                return (!bigNumber.isEqual(walletAmount, 0) || !bigNumber.isEqual(exAmount, 0)) && contains.indexOf(i) === -1;
            })
            .map(i => {
                const {
                    availableExAmount = '',
                    totalExAmount = '',
                    tokenName = '',
                    totalAmount = '',
                    totalSupply = '',
                    isReIssuable = '',
                    tokenSymbol,
                    balance = '',
                    decimals = '',
                    owner = '',
                    tokenId = i,
                    icon = getTokenIcon(i)
                } = Object.assign({}, balanceInfo[i] || {}, exBalance[i] || {});

                const currencyRate = rootGetters.currencyRateList[i] || 0;
                const totalExAsset = bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), currencyRate);
                const walletAsset = bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), currencyRate);

                const btcRate = rootGetters.btcRateList[i] || 0;
                const totalExAssetBtc = bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), btcRate);
                const walletAssetBtc = bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), btcRate);

                return {
                    totalExAssetBtc,
                    walletAssetBtc,
                    walletAsset,
                    totalExAmount,
                    availableExAmount,
                    totalExAsset,
                    tokenName,
                    totalAmount,
                    totalSupply,
                    isReIssuable,
                    tokenSymbol,
                    balance,
                    decimals,
                    owner,
                    tokenId,
                    icon,
                    totalAsset: bigNumber.plus(totalExAsset, walletAsset),
                    totalAssetBtc: bigNumber.plus(totalExAssetBtc, walletAssetBtc)
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
