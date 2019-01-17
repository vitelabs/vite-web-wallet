const state = {
    activeTx: {
        'parCode': '283904284', //交易对Id
        'fToken': '232323', //fromTokenId
        'fTokenShow': '323232', //fromToken简称 
        'tToken': '2323232', //toTokenId
        'tTokenShow': '23244234', //toToken简称 
        'priceBefore24h': '341341', 
        'pricePrev': '2323232', 
        'price': '313413', 
        'price24hChange': '2314141', 
        'price24hHigh': '2314341', 
        'price24hLow': '2314141', 
        'quantity24h': '2314134', 
        'amount24h': '231341413' 
    }
};

const mutations = {
    exSetActiveTxPair(state, transPair) {
        state.activeTx = transPair;
    }
};

const actions = {
    exFetchActiveTxPair({ dispatch, commit }, transPair) {
        commit('exSetActiveTxPair', transPair);
        dispatch('exFetchLatestTx');
        dispatch('exFetchDepth');
    }
};

export default {
    state,
    mutations,
    actions
};
