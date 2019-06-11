import { timer } from 'utils/asyncFlow';
import { rateToken } from 'services/trade';

const loopTime = 10000;
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
        console.log(99999);
        const f = () => {
            console.log(8888);
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
    addRateTokens({ commit, state }, payload = []) {
        commit('setRateTokenIds', payload);
        console.log(7777);
        rateToken({ tokenIdList: state.rateTokenIds }).then(data => {
            commit('setExchangeRate', data);
        });
    }
};

export default {
    state,
    mutations,
    actions
};
