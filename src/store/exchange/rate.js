import { timer } from 'utils/asyncFlow';
import { rate } from 'services/exchange';

const coins = {
    en: 'cny',
    zh: 'usd'
};
const loopTime = 2 * 60 * 1000 * 1000;
let rateTimer = null;

const state = {
    rateList: []
};
// {
//     "tokenCode": "", //tokenId
//     "tokenName": "", //tokenName
//     "usd": 0.00000000, //与usd汇率
//     "cny": 0.00000000 //与cny汇率
//   }

const mutations = {
    setExchangeRate(state, rateList) {
        state.rateList = [];
        rateList && rateList.forEach((rate) => {
            if (!rate) {
                return;
            }
            for(let _c in coins) {
                rate[_c] = rate[coins[_c]];
            }
            state.rateList.push(rate);
        });
    }
};

const actions = {
    startLoopExchangeRate({ commit }) {
        rateTimer = new timer(()=>{
            return rate().then((data) => {
                commit('setExchangeRate', data);
            });
        }, loopTime);
        rateTimer.start();
    },
    stopLoopExchangeRate() {
        rateTimer && rateTimer.stop();
        rateTimer = null;
    }
};

export default {
    state,
    mutations,
    actions
};
