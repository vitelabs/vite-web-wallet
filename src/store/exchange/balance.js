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


// .catch(() => {
//     commit('setExchangeBalance', []);
// });
const updateExBalance = (commit, address) =>
    $ViteJS.request('dexfund_getAccountFundInfo', address).then(data => {
        commit('setExchangeBalance', data);
    });

const actions = {
    startLoopExchangeBalance({ commit, dispatch, rootState }) {
        const activeAccount = rootState.wallet.activeAcc;
        const _address = activeAccount ? activeAccount.address : '';

        if (address !== _address) {
            commit('clearDexBalance');
            address = _address;
        }

        // 1. Stop last loop
        dispatch('stopLoopExchangeBalance');

        // 2. FetchAll
        updateExBalance(commit, address);

        // 3. Restart
        balanceTimer = new timer(() => updateExBalance(commit, address), loopTime);
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
            balance[k].available = BigNumber.toBasic(state.balanceList[k].available, state.balanceList[k].tokenInfo.decimals);
            balance[k].lock = BigNumber.toBasic(state.balanceList[k].locked, state.balanceList[k].tokenInfo.decimals);
            balance[k].totalExAmount = BigNumber.toBasic(BigNumber.plus(state.balanceList[k].available, state.balanceList[k].locked), state.balanceList[k].tokenInfo.decimals);
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
