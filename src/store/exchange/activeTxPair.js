import BigNumber from 'utils/bigNumber';

const state = { activeTxPair: null };

const mutations = {
    exSetActiveTxPair(state, txPair) {
        const old = state.activeTxPair;
        let isChange = !old;
        for (const key in old) {
            if (txPair[key] !== old[key]) {
                isChange = true;
                break;
            }
        }
        isChange && (state.activeTxPair = Object.assign({}, txPair));
    }
};

const actions = {
    exFetchActiveTxPair({ state, dispatch, commit }, txPair) {
        const activeTxPair = state.activeTxPair;
        txPair && commit('exSetActiveTxPair', txPair);

        if (txPair && activeTxPair && activeTxPair.pairCode === txPair.pairCode) {
            return;
        }

        dispatch('exFetchLatestTx');
        dispatch('exFetchDepth');
        dispatch('exFetchActiveTokens');
    }
};

const getters = {
    exActiveTxPair(state) {
        if (!state.activeTxPair) {
            return null;
        }
        const activeTxPair = Object.assign({}, state.activeTxPair);
        const upDown = BigNumber.minus(activeTxPair.price || 0, activeTxPair.priceBefore24h || 0);
        const upDownPre = BigNumber.minus(activeTxPair.price || 0, activeTxPair.pricePrev || 0);

        activeTxPair.upDown = upDown;
        activeTxPair.upDownPercent = activeTxPair.price24hChange ? `${ BigNumber.multi(activeTxPair.price24hChange, 100, 2) }%` : '';
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
