import { timer } from 'utils/asyncFlow';
import { rateToken } from 'services/trade';

const loopTime = 5000;
let rateTimer = null;

const state = { rateMap: {}, rateTokenIds: [] };

const mutations = {
    setExchangeRate(state, rateList) {
        state.rateMap = {};
        rateList && rateList.forEach(rate => {
            state.rateMap[rate.tokenId] = rate;
        });
    },
    setRateTokenIds(state, payload) {
        state.rateTokenIds = Array.from(new Set([ ...state.rateTokenIds, ...payload ]));
    }
};

const actions = {
    startLoopExchangeRate({ commit, dispatch, state }) {
        dispatch('stopLoopExchangeRate');

        const f = () => {
            if (!state.rateTokenIds || !state.rateTokenIds.length) {
                return;
            }
            return rateToken({ tokenIdList: state.rateTokenIds }).then(data => {
                commit('setExchangeRate', data);
            });
        };

        rateTimer = new timer(f, loopTime);
        rateTimer.start();
    },
    stopLoopExchangeRate() {
        rateTimer && rateTimer.stop();
        rateTimer = null;
    },
    addRateTokens({ commit }, payload = []) {
        commit('setRateTokenIds', payload);
    }
};

export default {
    state,
    mutations,
    actions
};
