const maxDigit = 8;

const state = {
    quoteToken: 0,
    tradeToken: 0
};

const mutations = {
    exSetQuoteTokenDecimals(state, decimals) {
        state.quoteToken = decimals;
    },
    exSetTradeTokenDecimals(state, decimals) {
        state.tradeToken = decimals;
    }
};

const actions = {
    exSetQuoteTokenDecimals({ rootState, commit }) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        const quoteTokenDetail = rootState.exchangeTokens.ttoken;

        if (!activeTxPair) {
            commit('exSetQuoteTokenDecimals', 0);
            return;
        }

        if (!quoteTokenDetail) {
            const pricePrecision = activeTxPair.pricePrecision;
            commit('exSetQuoteTokenDecimals', pricePrecision > maxDigit ? maxDigit : pricePrecision);
            return;
        }

        const minDecimals = getMinDecimals(quoteTokenDetail.tokenDecimals, activeTxPair.pricePrecision);
        commit('exSetQuoteTokenDecimals', minDecimals);
    },
    exSetTradeTokenDecimals({ rootState, commit }) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        const tradeTokenDetail = rootState.exchangeTokens.ftoken;

        if (!activeTxPair) {
            commit('exSetQuoteTokenDecimals', 0);
            return;
        }

        if (!tradeTokenDetail) {
            const quantityPrecision = activeTxPair.quantityPrecision;
            commit('exSetQuoteTokenDecimals', quantityPrecision > maxDigit ? maxDigit : quantityPrecision);
            return;
        }

        const minDecimals = getMinDecimals(tradeTokenDetail.tokenDecimals, activeTxPair.quantityPrecision);
        commit('exSetTradeTokenDecimals', minDecimals);
    },
    exSetTokenDecimals({ dispatch }) {
        dispatch('exSetQuoteTokenDecimals');
        dispatch('exSetTradeTokenDecimals');
    }
};

export default { state, mutations, actions };


function getMinDecimals(tokenDecimals, pairDecimals) {
    const digit = tokenDecimals > pairDecimals ? pairDecimals : tokenDecimals;
    return digit > maxDigit ? maxDigit : digit;
}
