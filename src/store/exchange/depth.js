const state = {
    buy: [{
        pirce: 10,
        num: 10
    },{
        pirce: 10,
        num: 10
    },{
        pirce: 10,
        num: 10
    },{
        pirce: 10,
        num: 10
    },{
        pirce: 10,
        num: 10
    }],
    sell: [{
        pirce: 10,
        num: 10
    },{
        pirce: 10,
        num: 10
    },{
        pirce: 10,
        num: 10
    },{
        pirce: 10,
        num: 10
    },{
        pirce: 10,
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
        commit('exSetDepthLoading', true);
        
        console.log(activeTx);
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
