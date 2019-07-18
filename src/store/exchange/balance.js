import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import $ViteJS from 'utils/viteClient';

const loopTime = 2 * 1000;
let balanceTimer = null;
let address = null;

const state = { balanceList: {} };

const mutations = {
    setExchangeBalance(state, balanceList) {
        state.balanceList = balanceList;
    },
    clearDexBalance(state) {
        state.balanceList = {};
    }
};

const updateExBalance = (commit, rootGetters) => {
    $ViteJS
        .request('dexfund_getAccountFundInfo', address)
        .then(data => {
            // If address didn't change, set balance directly.
            if (rootGetters.activeAddr === address) {
                commit('setExchangeBalance', data);
            // If address changed, clear balance and reset address
            } else {
                commit('clearDexBalance');
                address = rootGetters.activeAddr;
            }
        })
        .catch(e => {
            const code = e && e.error && e.error.code;
            code === -32002 && commit('clearDexBalance');
        });
};

const actions = {
    startLoopExchangeBalance({ commit, dispatch, rootGetters }) {
        // 1. Stop last loop
        dispatch('stopLoopExchangeBalance');
        address = rootGetters.activeAddr;

        // 2. Restart
        balanceTimer = new timer(() => {
            updateExBalance(commit, rootGetters);
        }, loopTime);
        balanceTimer.start();
    },
    stopLoopExchangeBalance() {
        balanceTimer && balanceTimer.stop();
        balanceTimer = null;
    }
};

const getters = {
    exBalanceList(state) {
        const balance = {};
        Object.keys(state.balanceList).forEach(k => {
            balance[k] = {};
            balance[k].availableExAmount = state.balanceList[k].available;
            balance[k].available = BigNumber.toBasic(state.balanceList[k].available,
                state.balanceList[k].tokenInfo.decimals);
            balance[k].lock = BigNumber.toBasic(state.balanceList[k].locked,
                state.balanceList[k].tokenInfo.decimals);
            balance[k].totalExAmount = BigNumber.plus(state.balanceList[k].available,
                state.balanceList[k].locked,
                0);
            balance[k].tokenInfo = state.balanceList[k].tokenInfo;
        });

        return balance;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
