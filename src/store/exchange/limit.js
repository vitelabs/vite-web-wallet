import { limit } from 'services/trade';

const state = { minAmount: {} };

const mutations = {
    exSetLimitAmounts(state, data) {
        state.minAmount = data && data.minAmount ? data.minAmount : {};
    }
};

const actions = {
    exFetchLimitAmounts({ commit }) {
        limit().then(data => {
            commit('exSetLimitAmounts', data);
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
