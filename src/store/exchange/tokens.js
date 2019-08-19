import { operatorTradepair } from 'services/trade';

const state = {
    ttoken: null,
    ftoken: null,
    operator: null,
    isLoading: true
};

const mutations = {
    exSetActiveTtoken(state, ttoken) {
        state.ttoken = ttoken;
    },
    exSetActiveFtoken(state, ftoken) {
        state.ftoken = ftoken;
    },
    exSetActiveOperator(state, operator) {
        state.operator = operator;
    },
    exClearActiveToken(state, activeTxPair) {
        if (!activeTxPair) {
            state.ttoken = null;
            state.ftoken = null;
            state.operator = null;
            return;
        }

        if (!state.ttoken || state.ttoken.tokenId !== activeTxPair.quoteToken) {
            state.ttoken = {
                tokenId: activeTxPair.quoteToken,
                symbol: activeTxPair.quoteTokenSymbol,
                originalSymbol: activeTxPair.quoteTokenSymbol.split('-')[0]
            };
            state.operator = null;
        }

        if (!state.ftoken || state.ftoken.tokenId !== activeTxPair.tradeToken) {
            state.ftoken = {
                tokenId: activeTxPair.tradeToken,
                symbol: activeTxPair.tradeTokenSymbol,
                originalSymbol: activeTxPair.tradeTokenSymbol.split('-')[0]
            };
            state.operator = null;
        }
    },
    exSetOperatorTxPairLoading(state, isLoading) {
        state.isLoading = isLoading;
    }
};

const actions = {
    exFetchActiveTokens({ rootState, commit }) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        commit('exClearActiveToken', activeTxPair);

        if (!activeTxPair) {
            return;
        }

        commit('exSetOperatorTxPairLoading', true);
        operatorTradepair({
            quoteToken: activeTxPair.quoteToken,
            tradeToken: activeTxPair.tradeToken
        }).then(data => {
            commit('exSetOperatorTxPairLoading', false);
            if (!data) {
                return;
            }

            commit('exSetActiveFtoken', data.tradeTokenDetail);
            commit('exSetActiveTtoken', data.quoteTokenDetail);
            commit('exSetActiveOperator', data.operatorInfo);
        }).catch(err => {
            commit('exSetOperatorTxPairLoading', false);
            console.warn(err);
        });
    }
};

export default {
    state,
    mutations,
    actions
};
