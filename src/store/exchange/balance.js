import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';

const loopTime = 2 * 1000;
let balanceTimer = null;

const state = {
    balanceList: {}
};

const mutations = {
    setExchangeBalance(state, balanceList) {
        state.balanceList = balanceList;
    }
};

const actions = {
    startLoopExchangeBalance({ commit }, address) {
        let f = () => {
            return $ViteJS.request('dexfund_getAccountFundInfo', address).then((data) => {
                commit('setExchangeBalance', data);
            }).catch(() => {
                // console.warn(err);
            });
        };

        f();
        balanceTimer = new timer(() => {
            return f();
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
            balance[k]={};
            balance[k].available= BigNumber.toBasic(state.balanceList[k].available,state.balanceList[k].tokenInfo.decimals);
            balance[k].lock= BigNumber.toBasic(state.balanceList[k].lock,state.balanceList[k].tokenInfo.decimals);
            balance[k].tokenInfo=state.balanceList[k].tokenInfo;
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
