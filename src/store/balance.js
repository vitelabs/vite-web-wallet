import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import { getAccountDexBalance } from 'services/viteServer';
import { VX_TOKENID, VITE_TOKENID } from 'utils/constant';

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

const actions = {
    startLoopExchangeBalance({ commit, dispatch, rootGetters }) {
        // 1. Stop last loop
        dispatch('stopLoopExchangeBalance');

        // 2. Restart
        balanceTimer = new timer(() => {
            if (address && rootGetters.activeAddr !== address) {
                commit('clearDexBalance');
            }
            address = rootGetters.activeAddr;

            getAccountDexBalance(address).then(data => {
                // If address changed, return
                if (rootGetters.activeAddr !== address) {
                    return;
                }
                data && commit('setExchangeBalance', data);
            }).catch(e => {
                const code = e && e.error && e.error.code;
                code === -32002 && commit('clearDexBalance');
            });
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
            balance[k] = {
                availableExAmount: state.balanceList[k].available,
                available: BigNumber.toBasic(state.balanceList[k].available, state.balanceList[k].tokenInfo.decimals),
                lock: BigNumber.toBasic(state.balanceList[k].locked, state.balanceList[k].tokenInfo.decimals),
                totalExAmount: BigNumber.plus(state.balanceList[k].available, state.balanceList[k].locked, 0),
                ...state.balanceList[k].tokenInfo
            };
        });

        return balance;
    },
    exVXBalanceInfo(state) {
        if (!state.balanceList || !state.balanceList[VX_TOKENID]) {
            return {};
        }
        return state.balanceList[VX_TOKENID];
    },
    exViteBalanceInfo(state) {
        if (!state.balanceList || !state.balanceList[VITE_TOKENID]) {
            return {};
        }
        return state.balanceList[VITE_TOKENID];
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
