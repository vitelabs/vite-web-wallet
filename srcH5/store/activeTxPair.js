import BigNumber from 'utils/bigNumber';

const state = {
    activeTxPair: null,
    realClosePrice: ''
};

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
    },
    exSetRealClosePrice(state, realClosePrice) {
        state.realClosePrice = realClosePrice || '';
    }
};

const actions = {
    h5DexFetchActiveTxPair({ state, dispatch, commit }, txPair) {
        const activeTxPair = state.activeTxPair;

        console.log(txPair);

        if (txPair) {
            commit('exSetActiveTxPair', txPair);
        }

        if (txPair && activeTxPair && activeTxPair.symbol === txPair.symbol) {
            return;
        }

        dispatch('exFetchActiveTokens');
        dispatch('exFetchDepth');
        dispatch('exFetchMarketInfo');
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
        activeTxPair.originQuoteTokenSymbol = activeTxPair.quoteTokenSymbol.split('-')[0] || '';
        activeTxPair.originTradeTokenSymbol = activeTxPair.tradeTokenSymbol.split('-')[0] || '';

        return activeTxPair;
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
