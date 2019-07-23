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
    }
};

const actions = {
    exFetchActiveTokens({ rootState, dispatch, commit }) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;

        if (!activeTxPair) {
            commit('exSetActiveTtoken', null);
            commit('exSetActiveFtoken', null);
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
