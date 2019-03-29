import BigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { wallet } from 'utils/wallet';

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
    tokenBalanceList(state) {
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
            balanceInfo[tokenId].symbol = tokenInfo.tokenSymbol;
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
            balanceInfo[tokenId].symbol = balanceInfo[tokenId].symbol || tokenInfo.tokenSymbol;
            balanceInfo[tokenId].onroadNum = item.number;
        }

        return balanceInfo;
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
