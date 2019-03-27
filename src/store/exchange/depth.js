import { subTask } from 'utils/proto/subTask';

const time = 2000;
let buyTask = null;
let sellTask = null;

const state = {
    buy: [],
    sell: [],
    isBuyLoading: false,
    isSellLoading: false
};

const mutations = {
    exSetDepthBuy(state, depthData) {
        state.buy = depthData || [];
    },
    exSetDepthSell(state, depthData) {
        state.sell = depthData || [];
    },
    exSetDepthBuyLoading(state, isLoading) {
        state.isBuyLoading = isLoading;
    },
    exSetDepthSellLoading(state, isLoading) {
        state.isSellLoading = isLoading;
    }
};

const actions = {
    exFetchDepth({ rootState, dispatch }) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return;
        }

        dispatch('exFetchDepthBuy');
        dispatch('exFetchDepthSell');
    },
    exFetchDepthBuy({ commit, getters }) {
        commit('exSetDepthBuyLoading', true);

        buyTask = buyTask || new subTask('depthBuy', ({ data }) => {
            commit('exSetDepthBuyLoading', false);
            commit('exSetDepthBuy', data);
        }, time);

        buyTask.start(() => getters.exActiveTxPair);
    },
    exFetchDepthSell({ commit, getters }) {
        commit('exSetDepthSellLoading', true);

        sellTask = sellTask || new subTask('depthSell', ({ data }) => {
            commit('exSetDepthSellLoading', false);
            commit('exSetDepthSell', data);
        }, time);

        sellTask.start(() => getters.exActiveTxPair);
    },
    exStopDepthTimer() {
        stopBuyTimer();
        stopSellTimer();
    }
};

function stopBuyTimer() {
    buyTask && buyTask.stop();
}

function stopSellTimer() {
    sellTask && sellTask.stop();
}

export default {
    state,
    mutations,
    actions
};
