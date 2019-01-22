const state = {
    activeTxPair: {
        'pairCode': '283904284',
        'fToken': '232323',
        'fTokenShow': 'ABHD',
        'tToken': '2323232',
        'tTokenShow': 'ABHD',
        'priceBefore24h': '341341', 
        'pricePrev': '2323232', 
        'price': '341341', 
        'price24hChange': '2314141', 
        'price24hHigh': '2314341', 
        'price24hLow': '2314141', 
        'quantity24h': '2314134', 
        'amount24h': '231341413' 
    }
};

const mutations = {
    exSetActiveTxPair(state, txPair) {
        state.activeTxPair = txPair;
    }
};

const actions = {
    exFetchActiveTxPair({ dispatch, commit }, txPair) {
        commit('exSetActiveTxPair', txPair);
        dispatch('exFetchLatestTx');
        dispatch('exFetchDepth');
    }
};

export default {
    state,
    mutations,
    actions
};
