const state = {
    buy: [{
        pirce: 100000,
        num: 10
    },{
        pirce: 10000,
        num: 10
    },{
        pirce: 1000,
        num: 10
    },{
        pirce: 2389,
        num: 10
    },{
        pirce: 289,
        num: 10
    }],
    sell: [{
        pirce: 2389,
        num: 10
    },{
        pirce: 89,
        num: 10
    },{
        pirce: 4389,
        num: 10
    },{
        pirce: 2489,
        num: 10
    },{
        pirce: 389,
        num: 10
    }],
    isLoading: true
};

const mutations = {
    exSetDepth(state, depthData) {
        state.buy = depthData.buy;
        state.sell = depthData.sell;
    },
    exSetDepthLoading(state, isLoading) {
        state.isLoading = isLoading;
    }
};

const actions = {
    exFetchDepth({ commit, rootState }) {
        let activeTx = rootState.exchangeActiveTxPair.activeTx;
        if (!activeTx) {
            return;
        }
        commit('exSetDepthLoading', true);
    }
};

// const getters = {
//     tota(state) {

//     }
// };

export default {
    state,
    mutations,
    actions,
    // getters
};
