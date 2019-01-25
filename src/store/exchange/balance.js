import { timer } from 'utils/asyncFlow';

const loopTime = 2 * 1000;
let balanceTimer = null;

const state = {
    balanceList: {}
};

const mutations = {
    setExchangeBalance(state, balanceList) {
        state.balanceList = {};
        balanceList && balanceList.forEach((balanceInfo) => {
            state.balanceList[balanceInfo.tokenCode] = balanceInfo;
        });
    }
};

const actions = {
    startLoopExchangeBalance({ commit }, address) {
        let f = () => {
            return $ViteJS.request('dexfund_getAccountFundInfo', address).then((data) => {
                commit('setExchangeBalance', data);
            }).catch(err => {
                console.warn(err);
            });
        };

        f();
        balanceTimer = new timer(()=>{
            return f();
        }, loopTime);
        balanceTimer.start();
    },
    stopLoopExchangeBalance() {
        balanceTimer && balanceTimer.stop();
        balanceTimer = null;
    }
};

export default {
    state,
    mutations,
    actions
};
