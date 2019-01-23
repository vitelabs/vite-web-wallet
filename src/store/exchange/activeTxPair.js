import BigNumber from 'utils/bigNumber';

const state = {
    activeTxPair: null
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

        activeTxPair.price = BigNumber.toBasic(activeTxPair.price);
        activeTxPair.price24hHigh = BigNumber.toBasic(activeTxPair.price24hHigh);
        activeTxPair.price24hLow = BigNumber.toBasic(activeTxPair.price24hLow);
        activeTxPair.quantity24h = BigNumber.toBasic(activeTxPair.quantity24h);
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
