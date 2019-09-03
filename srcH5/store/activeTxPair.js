import { subTask } from 'utils/proto/subTask';
import env from 'h5Utils/envFromURL';

let assignPairTask = null;

const state = {
    activeTxPair: null,
    isLoading: true
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
    setActiveTxPairLoading(state, isLoading) {
        state.isLoading = isLoading;
    }
};

const actions = {
    dexFetchActiveTxPair({ state, dispatch, commit, rootState }, txPair, isInit = true) {
        txPair = txPair || {
            symbol: rootState.exchangeMarket.currentSymbol,
            quoteToken: env.quoteToken,
            tradeToken: env.tradeToken
        };
        isInit && commit('setActiveTxPairLoading', true);

        assignPairTask && assignPairTask.stop();
        assignPairTask = null;

        assignPairTask = new subTask('assignPair', ({ data }) => {
            if (!data || !data.length) {
                return;
            }

            const activeTxPair = data[0];
            const currActiveTxPair = state.activeTxPair;
            if (currActiveTxPair && activeTxPair.symbol !== currActiveTxPair.symbol) {
                return;
            }

            commit('exSetActiveTxPair', activeTxPair);

            if (isInit) {
                isInit = false;
                commit('setActiveTxPairLoading', false);
                dispatch('exFetchActiveTokens');
                dispatch('exFetchDepth');
                dispatch('exFetchMarketInfo');
            }
        });
        assignPairTask.start(() => {
            return { symbol: txPair.symbol };
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
