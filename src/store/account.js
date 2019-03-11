import BigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { wallet } from 'utils/walletInstance';
import loopTime from 'config/loopTime';

let balanceInfoInst = null;
const state = {
    onroad: {
        balanceInfos: {}
    },
    balance: {
        balanceInfos: {}
    }
};

const mutations = {
    commitBalanceInfo(state, payload) {
        if (!payload) {
            state.balance = {
                balanceInfos: {}
            };
            state.onroad = {
                balanceInfos: {}
            };
            return;
        }

        state.balance = payload.balance || {};
        state.balance.balanceInfos = state.balance && state.balance.tokenBalanceInfoMap ? state.balance.tokenBalanceInfoMap : {};

        state.onroad = payload.onroad || {};
        state.onroad.balanceInfos = state.onroad && state.onroad.tokenBalanceInfoMap ? state.onroad.tokenBalanceInfoMap : {};
    },
    commitClearBalance(state) {
        state.balance = {
            balanceInfos: {}
        };
        state.onroad = {
            balanceInfos: {}
        };
    }
};
const actions = {
    startLoopBalance({ commit, dispatch }) {
        dispatch('stopLoopBalance');
        balanceInfoInst = new timer(() => {
            let account = wallet.getActiveAccount();
            if (!account) {
                return;
            }
            if (account.type !== 'address') {
                return commit('commitBalanceInfo', account.syncGetBalance());
            }
            return account.getBalance().then((data) => {
                commit('commitBalanceInfo', data);
            });
        }, loopTime.ledger_getBalance);
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
        let balanceInfo = Object.create(null);

        for (let tokenId in state.balance.balanceInfos) {
            let item = state.balance.balanceInfos[tokenId];

            let tokenInfo = item.tokenInfo;
            let decimals = tokenInfo.decimals;
            let balance = BigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = tokenInfo[tokenId] || {};
            balanceInfo[tokenId].id = tokenId;
            balanceInfo[tokenId].balance = balance;
            balanceInfo[tokenId].decimals = decimals;
            balanceInfo[tokenId].symbol = tokenInfo.tokenSymbol;
            balanceInfo[tokenId].transNum = item.number;
        }

        for (let tokenId in state.onroad.balanceInfos) {
            let item = state.onroad.balanceInfos[tokenId];

            let tokenInfo = item.tokenInfo;
            let decimals = tokenInfo.decimals;
            let balance = BigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = balanceInfo[tokenId] || {};
            balanceInfo[tokenId].id = balanceInfo[tokenId].id || tokenInfo.id;
            balanceInfo[tokenId].fundFloat = balance;
            balanceInfo[tokenId].decimals = balanceInfo[tokenId].decimals || tokenInfo.decimals;
            balanceInfo[tokenId].symbol = balanceInfo[tokenId].symbol || tokenInfo.tokenSymbol;
            balanceInfo[tokenId].onroadNum = item.number;
        }

        for (let tokenId in viteWallet.Ledger.defaultTokenIds) {
            if (!viteWallet.Ledger.tokenInfoMaps[tokenId] && !balanceInfo[tokenId]) {
                break;
            }

            let defaultToken = viteWallet.Ledger.defaultTokenIds[tokenId];
            let symbol = viteWallet.Ledger.tokenInfoMaps[tokenId].tokenSymbol || defaultToken.tokenSymbol;
            balanceInfo[tokenId] = balanceInfo[tokenId] || {
                balance: '0',
                fundFloat: '0',
                symbol,
                decimals: '0'
            };
            balanceInfo[tokenId].icon = defaultToken.icon;
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
