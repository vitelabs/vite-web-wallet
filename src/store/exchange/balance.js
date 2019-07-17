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

const updateExBalance = (commit, _address, getters) => {
    $ViteJS
        .request('dexfund_getAccountFundInfo', _address)
        .then(data => {
            if (getters.activeAddr === _address) {
                commit('setExchangeBalance', data);
            } else {
                commit('clearDexBalance');
            }
        })
        .catch(e => {
            const code = e && e.error && e.error.code;
            code === -32002 && commit('clearDexBalance');
        });
};

const actions = {
    startLoopExchangeBalance({ commit, dispatch, getters }) {
    // 1. Stop last loop
        dispatch('stopLoopExchangeBalance');
        const _address = getters.activeAddr;
        if (address !== _address) {
            commit('clearDexBalance');
            address = _address;
        }
        // 2. Restart
        balanceTimer = new timer(() => {
            updateExBalance(commit, _address, getters);
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
