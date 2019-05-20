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

        if (txPair) {
            history.replaceState(null, null, `${ location.origin }/trade?symbol=${ txPair.symbol }&tradeTokenSymbol=${ txPair.tradeTokenSymbol }&quoteTokenSymbol=${ txPair.quoteTokenSymbol }`);
            commit('exSetActiveTxPair', txPair);
        }

        if (txPair && activeTxPair && activeTxPair.symbol === txPair.symbol) {
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

        const upDown = BigNumber.minus(activeTxPair.closePrice || 0, activeTxPair.openPrice || 0);
        const upDownPrev = BigNumber.minus(activeTxPair.closePrice || 0, activeTxPair.prevClosePrice || 0);

        activeTxPair.upDown = upDown;
        activeTxPair.upDownPrev = +upDownPrev ? upDownPrev : '0';
        activeTxPair.upDownPercent = activeTxPair.priceChangePercent ? `${ BigNumber.multi(activeTxPair.priceChangePercent, 100, 2) }%` : '';

        return activeTxPair;
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
