import { timer } from 'utils/asyncFlow';
import { tokenRateFromCMC } from 'services/trade';

const loopTime = 2 * 60 * 60 * 1000;
let rateTimer = null;

const state = { rateMap: {} };

const mutations = {
    setWorldRate(state, rateList) {
        state.rateMap = {};
        rateList && rateList.forEach(rate => {
            state.rateMap[rate.tokenId] = rate;
        });
    }
};

const actions = {
    startLoopWorldRate({ commit, dispatch }) {
        dispatch('stopLoopWorldRate');
        const f = () => tokenRateFromCMC().then(data => {
            commit('setWorldRate', data);
        });

        rateTimer = new timer(f, loopTime);
        rateTimer.start();
    },
    stopLoopWorldRate() {
        rateTimer && rateTimer.stop();
        rateTimer = null;
    }
};

export default {
    state,
    mutations,
    actions
};
