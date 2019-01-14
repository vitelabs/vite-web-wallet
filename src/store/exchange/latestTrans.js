const state = {
    trans: [{
        price: 10,
        num: 10,
        time: 293023
    },{
        price: 10,
        num: 10,
        time: 293023
    },{
        price: 10,
        num: 10,
        time: 293023
    },{
        price: 10,
        num: 10,
        time: 293023
    }]
};

// const mutations = {
//     commitS(state, pageIndex) {

//     }
// };

const actions = {
    exFetchLatestTrans({ rootState, commit }) {
        let activeTrans = rootState.exchangeTransPairs.activeTrans;
        console.log(commit);
        console.log(activeTrans);
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
