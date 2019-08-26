import { assignPair } from 'services/trade';

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
    dexFetchActiveTxPair({ state, dispatch, commit }, txPair) {
        if (!txPair) {
            return;
        }

        const activeTxPair = state.activeTxPair;
        if (activeTxPair && activeTxPair.symbol === txPair.symbol) {
            return;
        }

        assignPair({ symbols: [txPair.symbol] }).then(data => {
            if (!data || !data.length) {
                return;
            }

            commit('exSetActiveTxPair', data[0]);

            dispatch('exFetchActiveTokens');
            dispatch('exFetchDepth');
            dispatch('exFetchMarketInfo');
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
