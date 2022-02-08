import { getAccountBalance } from 'services/viteServer';
import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { defaultTokenMap } from 'utils/constant';

import env from 'h5Utils/envFromURL';
import { getTokenIcon } from 'utils/tokenParser';

let balanceInfoInst = null;

const state = {
    address: env.address || '',
    balance: {}
};

const mutations = {
    commitSetAddress(state, address) {
        if (!address) {
            return;
        }
        if (state.address === address) {
            return;
        }

        state.address = address;
    },
    commitBalanceInfo(state, payload) {
        if (!payload) {
            state.balance = {};
            return;
        }
        state.balance = payload.balance.balanceInfoMap || {};
    },
    commitClearBalance(state) {
        state.balance = {};
    }
};

const actions = {
    setAddress({ commit, dispatch }, address) {
        commit('commitSetAddress', address);
        dispatch('startLoopBalance');
    },
    startLoopBalance({ state, commit, dispatch }) {
        dispatch('stopLoopBalance');
        balanceInfoInst = new timer(() => {
            if (!state.address) {
                return;
            }
            return getAccountBalance(state.address).then(data => {
                commit('commitBalanceInfo', data);
            });
        }, 1000);
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
            const balance = bigNumber.toBasic(item.balance, decimals);

            balanceInfo[tokenId] = {
                ...tokenInfo,
                balance: balance,
                totalAmount: item.balance
            };
        }
        return balanceInfo;
    },
    // allBalanceInfoMap(state, getters, rootState, rootGetters) {
    //     return getters.allBalanceInfo.reduce((pre, cur) => {
    //         return {
    //             ...pre,
    //             [cur.tokenId]: cur
    //         };
    //     },
    //     {});
    // },
    allBalanceInfo(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo || {};
        const exBalance = rootGetters.exBalanceList || {};
        const allToken = Object.assign({},
            defaultTokenMap,
            exBalance,
            balanceInfo);

        return Object.keys(allToken).map(i => {
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
            } = Object.assign({},
                balanceInfo[i] || {},
                exBalance[i] || {},
                rootState.env.tokenMap[i] || {});

            const currencyRate = rootGetters.currencyRateList[i] || 0;
            const totalExAsset = bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                currencyRate);
            const walletAsset = bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                currencyRate);

            const btcRate = rootGetters.btcRateList[i] || 0;
            const totalExAssetBtc = bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                btcRate);
            const walletAssetBtc = bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                btcRate);

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
