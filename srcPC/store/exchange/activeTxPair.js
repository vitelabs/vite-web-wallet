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

        if (txPair) {
            history.replaceState(null, null, `${ location.origin }/trade?symbol=${ txPair.symbol }`);
            commit('exSetActiveTxPair', txPair);
        }

        if (txPair && activeTxPair && activeTxPair.symbol === txPair.symbol) {
            return;
        }

        dispatch('exFetchActiveTokens');
        dispatch('exFetchLatestTx');
        dispatch('exFetchDepth');
        dispatch('exFetchMarketInfo');
    }
};

export default {
    state,
    mutations,
    actions
};
