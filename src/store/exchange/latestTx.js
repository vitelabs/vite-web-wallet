const state = {
    txList: [{
        price: 10,
        num: 10,
        time: 1548150873040
    },{
        price: 10,
        num: 10,
        time: 1548150873040
    },{
        price: 10,
        num: 10,
        time: 1548150873040
    },{
        price: 10,
        num: 10,
        time: 1548150873040
    }],
    isLoading: true
};

// const mutations = {
//     commitS(state, pageIndex) {

//     }
// };

const actions = {
    exFetchLatestTx({ rootState, commit }) {
        let activeTx = rootState.exchangeActiveTxPair.activeTx;
        console.log(commit);
        console.log(activeTx);
    }
};

// const getters = {
//     tota(state) {

//     }
// };

export default {
    state,
    // mutations,
    actions,
    // getters
};
