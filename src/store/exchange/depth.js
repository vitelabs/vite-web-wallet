import bigNumber from 'utils/bigNumber';
import { subTask } from 'utils/proto/subTask';

const time = 2000;
let depthTask = null;
let activeTxPair = null;

const state = {
    buy: [],
    sell: [],
    isLoading: false
};

const mutations = {
    exSetDepthBuy(state, depthData) {
        state.buy = depthData || [];
    },
    exSetDepthSell(state, depthData) {
        const list = depthData || [];
        list.sort((a, b) => bigNumber.compared(b.price, a.price));
        state.sell = list;
    },
    exSetDepthLoading(state, isLoading) {
        state.isLoading = isLoading;
    }
};

const actions = {
    exFetchDepth({ rootState, commit, getters, dispatch }) {
        const _activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!_activeTxPair) {
            return;
        }

        dispatch('exStopDepthTimer');

        activeTxPair = _activeTxPair;
        commit('exSetDepthLoading', true);

        depthTask = depthTask || new subTask('depth', ({ args, data }) => {
            if (args.symbol !== activeTxPair.symbol) {
                return;
            }

            commit('exSetDepthLoading', false);
            commit('exSetDepthSell', data && data.asks ? data.asks || [] : []);
            commit('exSetDepthBuy', data && data.bids ? data.bids || [] : []);
        }, time);

        depthTask.start(() => getters.exActiveTxPair);
    },
    exStopDepthTimer({ commit }) {
        depthTask && depthTask.stop();
        depthTask = null;
        commit('exSetDepthSell', []);
        commit('exSetDepthBuy', []);
    }
};

export default {
    state,
    mutations,
    actions
};
