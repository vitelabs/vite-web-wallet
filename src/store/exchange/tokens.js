import { tokenDetail } from 'services/trade';

const state = {
    ttoken: null,
    ftoken: null
};

const mutations = {
    exSetActiveTtoken(state, ttoken) {
        state.ttoken = ttoken;
    },
    exSetActiveFtoken(state, ftoken) {
        state.ftoken = ftoken;
    },
    exClearActiveToken(state, activeTxPair) {
        if (!activeTxPair) {
            state.ttoken = null;
            state.ftoken = null;
            return;
        }

        if (!state.ttoken || state.ttoken.tokenId !== activeTxPair.quoteToken) {
            state.ttoken = {
                tokenId: activeTxPair.quoteToken,
                symbol: activeTxPair.quoteTokenSymbol,
                originalSymbol: activeTxPair.quoteTokenSymbol.split('-')[0]
            };
        }

        if (!state.ftoken || state.ftoken.tokenId !== activeTxPair.tradeToken) {
            state.ftoken = {
                tokenId: activeTxPair.tradeToken,
                symbol: activeTxPair.tradeTokenSymbol,
                originalSymbol: activeTxPair.tradeTokenSymbol.split('-')[0]
            };
        }
    }
};

const actions = {
    exFetchActiveTokens({ rootState, dispatch, commit }) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        commit('exClearActiveToken', activeTxPair);

        if (!activeTxPair) {
            return;
        }

        dispatch('exFetchActiveFtoken', activeTxPair.tradeToken);
        dispatch('exFetchActiveTtoken', activeTxPair.quoteToken);
    },
    exFetchActiveTtoken({ rootState, commit }, tokenId) {
        tokenDetail({ tokenId }).then(data => {
            const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
            if (tokenId !== activeTxPair.quoteToken) {
                return;
            }

            commit('exSetActiveTtoken', data);
        }).catch(err => {
            console.warn(err);
        });
    },
    exFetchActiveFtoken({ rootState, commit }, tokenId) {
        tokenDetail({ tokenId }).then(data => {
            const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
            if (tokenId !== activeTxPair.tradeToken) {
                return;
            }

            commit('exSetActiveFtoken', data);
        }).catch(err => {
            console.warn(err);
        });
    }
};

export default {
    state,
    mutations,
    actions
};
