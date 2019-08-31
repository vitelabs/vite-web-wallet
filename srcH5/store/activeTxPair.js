import { subTask } from 'utils/proto/subTask';
import env from 'h5Utils/envFromURL';

let assignPairTask = null;

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
    dexFetchActiveTxPair({ state, dispatch, commit, rootState }, txPair, isInit = true) {
        txPair = txPair || {
            symbol: rootState.exchangeMarket.currentSymbol,
            quoteToken: env.quoteToken,
            tradeToken: env.tradeToken
        };

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
                dispatch('exFetchActiveTokens');
                dispatch('exFetchDepth');
                dispatch('exFetchMarketInfo');
            }
        });
        assignPairTask.start(() => {
            return { symbol: txPair.symbol };
        });
    }
};

export default {
    state,
    mutations,
    actions
};
