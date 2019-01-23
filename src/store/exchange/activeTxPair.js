import BigNumber from 'utils/bigNumber';



const state = {
    activeTxPair: {
        'pairCode': '283904284',
        'fToken': '232323',
        'fTokenShow': 'ABHD',
        'tToken': 'tti_5649544520544f4b454e6e40',
        'tTokenShow': 'ABHD',
        'priceBefore24h': '341341', 
        'pricePrev': '2323232332', 
        'price': '34141', 
        'price24hChange': '2314141', 
        'price24hHigh': '2314341', 
        'price24hLow': '2314141', 
        'quantity24h': '2314134', 
        'amount24h': '231341413' 
    }
};

const mutations = {
    exSetActiveTxPair(state, txPair) {
        state.activeTxPair = Object.assign({}, txPair);
    }
};

const actions = {
    exFetchActiveTxPair({ dispatch, commit }, txPair) {
        txPair && commit('exSetActiveTxPair', txPair);
        dispatch('exFetchLatestTx');
        dispatch('exFetchDepth');
    }
};

const getters = {
    exActiveTxPair(state) {
        if (!state.activeTxPair) {
            return null;
        }
        let activeTxPair = Object.assign({}, state.activeTxPair);
        let upDown = BigNumber.minus(activeTxPair.price, activeTxPair.priceBefore24h).toString();
        let upDownPre = BigNumber.minus(activeTxPair.price, activeTxPair.pricePrev).toString();

        activeTxPair.upDown = upDown;
        activeTxPair.upDownPercent = BigNumber.dividedToNumber(upDown, activeTxPair.priceBefore24h * 100, 2).toString() + '%';
        activeTxPair.upDownPre = upDownPre;

        return activeTxPair;
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
