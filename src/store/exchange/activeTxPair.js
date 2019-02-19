import BigNumber from 'utils/bigNumber';

const state = {
    activeTxPair: null
};

const mutations = {
    exSetActiveTxPair(state, txPair) {
        let old = state.activeTxPair;
        let isChange = !old;
        for (let key in old) {
            if (txPair[key] !==  old[key]) {
                isChange = true;
                break;
            }
        }
        isChange && (state.activeTxPair = Object.assign({}, txPair));
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
        let upDown = BigNumber.minus(activeTxPair.price || 0, activeTxPair.priceBefore24h || 0);
        let upDownPre = BigNumber.minus(activeTxPair.price || 0, activeTxPair.pricePrev || 0);

        activeTxPair.upDown = upDown;
        activeTxPair.upDownPercent = activeTxPair.priceBefore24h && activeTxPair.priceBefore24h !== 0 ?
            BigNumber.dividedToNumber(upDown, activeTxPair.priceBefore24h * 100, 2) + '%' : '';
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
