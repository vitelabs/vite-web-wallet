import { timer } from 'utils/asyncFlow';
import { rateFiat } from 'services/exchange';

const loopTime = 2 * 60 * 1000 * 1000;
let rateTimer = null;

const state = {
    rateMap: {},
    coins: {
        en: 'usd',
        zh: 'cny'
    }
};

const mutations = {
    setExchangeRate(state, rateList) {
        console.log(rateList);
        state.rateList = {};
        rateList && rateList.forEach((rate) => {
            state.rateList[rate.tokenId] = rate;
        });
    }
};

const actions = {
    startLoopExchangeRate({ commit }) {
        let f = () => {
            return rateFiat().then((data) => {
                commit('setExchangeRate', data);
            }).catch((err) => {
                console.warn(err);
            });
        };

        f();
        rateTimer = new timer(()=>{
            return f(); 
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
