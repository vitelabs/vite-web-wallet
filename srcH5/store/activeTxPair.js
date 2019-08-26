import { assignPair } from 'services/trade';
import env from 'h5Utils/envFromURL';

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
    dexFetchActiveTxPair({ state, dispatch, commit, rootState }, txPair) {
        txPair = txPair || {
            symbol: rootState.exchangeMarket.currentSymbol,
            quoteToken: env.quoteToken,
            tradeToken: env.tradeToken
        };

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
