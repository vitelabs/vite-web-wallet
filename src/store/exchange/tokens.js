import { tokenDetail } from 'services/exchange';

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
        let activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            commit('exSetActiveTtoken', null);
            commit('exSetActiveFtoken', null);
            return;
        }

        dispatch('exFetchActiveTtoken', activeTxPair.ttoken);
        dispatch('exFetchActiveFtoken', activeTxPair.ftoken);
    },
    exFetchActiveTtoken({ rootState, commit }, tokenId) {
        let activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;

        tokenDetail({ tokenId }).then((data) => {
            if (tokenId !== activeTxPair.ttoken) {
                return;
            }
            commit('exSetActiveTtoken', data);
        }).catch((err) => {
            console.warn(err);
        });
    },
    exFetchActiveFtoken({ rootState, commit }, tokenId) {
        let activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;

        tokenDetail({ tokenId }).then((data) => {
            if (tokenId !== activeTxPair.ftoken) {
                return;
            }
            commit('exSetActiveFtoken', data);
        }).catch((err) => {
            console.warn(err);
        });
    }
};

export default {
    state,
    mutations,
    actions
};
