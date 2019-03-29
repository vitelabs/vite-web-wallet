import { subTask } from 'utils/proto/subTask';

const time = 2000;
let depthTask = null;

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
        state.sell = depthData || [];
    },
    exSetDepthLoading(state, isLoading) {
        state.isLoading = isLoading;
    }
};

const actions = {
    exFetchDepth({ rootState, commit, getters }) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return;
        }

        commit('exSetDepthLoading', true);

        depthTask = depthTask || new subTask('depth', ({ data }) => {
            commit('exSetDepthLoading', false);
            commit('exSetDepthBuy', data && data.asks ? data.asks || [] : []);
            commit('exSetDepthSell', data && data.bids ? data.bids || [] : []);
        }, time);

        depthTask.start(() => getters.exActiveTxPair);
    },
    exStopDepthTimer() {
        depthTask && depthTask.stop();
        depthTask = null;
    }
};

export default {
    state,
    mutations,
    actions
};
