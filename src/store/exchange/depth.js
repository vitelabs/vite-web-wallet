import { depthBuy, depthSell } from 'services/exchange';
import { timer } from 'utils/asyncFlow';

const time = 2000;
let buyTimer = null;
let sellTimer = null;

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
    exFetchDepthBuy({ rootState, commit }) {
        let activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;

        let _f = (cb) => {
            return depthBuy({
                ftoken: activeTxPair.ftoken,
                ttoken: activeTxPair.ttoken
            }).then((data) => {
                cb && cb();
                commit('exSetDepthBuy', data);
            }).catch(err => {
                console.warn(err);
                cb && cb();
            });
        };

        // Init
        commit('exSetDepthBuyLoading', true);
        _f(() => {
            commit('exSetDepthBuyLoading', false);
        });

        // Loop
        stopBuyTimer();
        buyTimer = new timer(()=>{
            return _f();
        }, time);
        buyTimer.start();
    },
    exFetchDepthSell({ rootState, commit }) {
        let activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;

        let _f = (cb) => {
            return depthSell({
                ftoken: activeTxPair.ftoken,
                ttoken: activeTxPair.ttoken
            }).then((data) => {
                cb && cb();
                commit('exSetDepthSell', data);
            }).catch(err => {
                console.warn(err);
                cb && cb();
            });
        };

        // Init
        commit('exSetDepthSellLoading', true);
        _f(() => {
            commit('exSetDepthSellLoading', false);
        });

        // Loop
        stopSellTimer();
        sellTimer = new timer(()=>{
            return _f();
        }, time);
        sellTimer.start();
    },
    exStopDepthTimer() {
        stopTimer();
    }
};

function stopBuyTimer() {
    buyTimer && buyTimer.stop();
    buyTimer = null;
}

function stopSellTimer() {
    sellTimer && sellTimer.stop();
    sellTimer = null;
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
