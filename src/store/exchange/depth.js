import {subTask} from 'utils/proto/subTask';

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
        state.buy = depthData;
    },
    exSetDepthSell(state, depthData) {
        state.sell = depthData;
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
        let activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return;
        }

        dispatch('exFetchDepthBuy');
        dispatch('exFetchDepthSell');
    },
    exFetchDepthBuy({ commit,getters }) {
        commit('exSetDepthBuyLoading', true);
        buyTask=buyTask||new subTask('depthBuy',(data)=>{
            commit('exSetDepthBuyLoading', false);
            commit('exSetDepthBuy', data);
        });
        console.log('buy');
        buyTask.start(()=>getters.exActiveTxPair);
    },
    exFetchDepthSell({ commit,getters }) {
        commit('exSetDepthSellLoading', true);
        const dataCallback=(data) => {
            data && commit('exSetDepthSell', data);
            commit('exSetDepthSellLoading', false);
        };

        // Loop
        stopSellTimer();
        console.log('sell');
        sellTask =sellTask|| new subTask('depthSell',dataCallback,time);
        sellTask.start(()=>getters.exActiveTxPair);
    },
    exStopDepthTimer() {
        stopTimer();
    }
};

function stopBuyTimer() {
    buyTask && buyTask.stop();
}

function stopSellTimer() {
    buyTask && buyTask.stop();
}

function stopTimer() {
    stopBuyTimer();
    stopSellTimer();
}

export default {
    state,
    mutations,
    actions
};
