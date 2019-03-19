import { tokenList } from 'services/exchange';

const state = {
    list: []
};

const mutations = {
    dexSetTokenList(state, list){
        state.list = list || [];
    },
};

const actions = {
    dexFetchTokenList({ commit }) {
        tokenList().then((data) => {
            commit('dexSetTokenList', data || []);
        });
    }
};

export default {
    state, mutations, actions
};
