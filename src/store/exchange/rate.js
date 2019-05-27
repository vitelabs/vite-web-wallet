import { timer } from 'utils/asyncFlow';
import { rateFiat } from 'services/trade';

const loopTime = 2 * 60 * 60 * 1000;
let rateTimer = null;

const state = { rateMap: {} };

const mutations = {
    setExchangeRate(state, rateList) {
        state.rateMap = {};
        rateList && rateList.forEach(rate => {
            state.rateMap[rate.tokenId] = rate;
        });
    }
};

const actions = {
    startLoopExchangeRate({ commit, dispatch }) {
        dispatch('stopLoopExchangeRate');
        const f = () => rateFiat().then(data => {
            commit('setExchangeRate', data);
        });

        rateTimer = new timer(f, loopTime);
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
