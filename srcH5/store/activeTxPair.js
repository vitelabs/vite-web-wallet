import { subTask } from 'utils/proto/subTask';

let assignPairTask = null;

const state = {
    activeTxPair: null,
    isLoading: true
};

const mutations = {
    exSetActiveTxPair(state, txPair) {
        if (!txPair) {
            state.activeTxPair = null;
            return;
        }

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
        txPair = txPair || { symbol: rootState.exchangeMarket.currentSymbol };
        isInit && commit('setActiveTxPairLoading', true);
        commit('exSetActiveTxPair', null);

        assignPairTask && assignPairTask.stop();
        assignPairTask = null;

        assignPairTask = new subTask('assignPair', ({ data }) => {
            commit('setActiveTxPairLoading', false);

            let activeTxPair = null;
            if (data instanceof Array) {
                activeTxPair = data.length ? data[0] : null;
            } else {
                activeTxPair = data;
            }

            if (!activeTxPair) {
                return;
            }

            const currActiveTxPair = state.activeTxPair;
            if (currActiveTxPair && activeTxPair.symbol !== currActiveTxPair.symbol) {
                return;
            }

            commit('exSetActiveTxPair', activeTxPair);
            if (isInit) {
                isInit = false;
                dispatch('addRateTokens', [activeTxPair.quoteToken]);
                dispatch('exFetchActiveTokens');
                dispatch('exFetchDepth');
                dispatch('exFetchMarketInfo');
            }
        });

        assignPairTask.start(() => {
            return { symbol: txPair.symbol };
        }).catch(err => {
            commit('setActiveTxPairLoading', false);
            console.warn(err);
        });
    }
};

export default {
    state,
    mutations,
    actions
};
