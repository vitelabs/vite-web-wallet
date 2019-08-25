import { addrAccount } from '@vite/vitejs';

import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import client from 'utils/viteClient';
import { defaultTokenMap } from 'utils/constant';
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
        const balanceInfo = Object.create(null);
        for (const tokenId in state.balance) {
            const item = state.balance[tokenId];

            const tokenInfo = item.tokenInfo;
            const decimals = tokenInfo.decimals;
            const balance = bigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = {
                ...tokenInfo,
                balance: balance,
                totalAmount: item.totalAmount
            };
        }
        return balanceInfo;
    },
    allBalanceInfo(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const exBalance = rootGetters.exBalanceList;
        const allToken = Object.assign({}, defaultTokenMap, exBalance, balanceInfo);

        return Object.keys(allToken)
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
                } = Object.assign({}, balanceInfo[i] || {}, exBalance[i] || {}, rootState.env.tokenMap[i] || {});

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
