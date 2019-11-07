import { limit } from 'services/trade';

const state = {
    minAmount: {},
    depthStepsLimit: {}
};

const mutations = {
    exSetLimitAmounts(state, minAmount) {
        state.minAmount = minAmount || {};
    },
    exSetDepthStepsLimit(state, depthStepsLimit) {
        state.depthStepsLimit = depthStepsLimit || {};
    }
};

const actions = {
    exFetchLimitAmounts({ commit }) {
        limit().then(data => {
            if (!data) {
                return;
            }
            commit('exSetLimitAmounts', data.minAmount);
            commit('exSetDepthStepsLimit', data.depthStepsLimit);
        }).catch(err => {
            console.warn(err);
        });
    }
};

export default {
    state,
    mutations,
    actions
};
