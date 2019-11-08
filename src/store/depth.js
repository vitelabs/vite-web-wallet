import bigNumber from 'utils/bigNumber';
import { subTask } from 'utils/proto/subTask';

const time = 2000;
let depthTask = null;
let activeTxPair = null;

const state = {
    buy: [],
    sell: [],
    rawSell: [],
    isLoading: false,
    depthStep: '',
    listLimit: 100
};

const mutations = {
    exSetDepthBuy(state, depthData) {
        let list = depthData || [];
        list = list.splice(0, state.listLimit);
        state.buy = list;
    },
    exSetDepthSell(state, depthData) {
        const list = depthData || [];
        state.rawSell = [].concat(list).splice(0, state.listLimit);
        list.sort((a, b) => b.price - a.price);
        state.sell = list;
    },
    exSetDepthLoading(state, isLoading) {
        state.isLoading = isLoading;
    },
    exSetDepthStep(state, step) {
        state.depthStep = step;
    },
    exSetDepthListLimit(state, limit) {
        state.listLimit = limit;
    }
};

const actions = {
    exFetchDepth({ rootState, commit, getters, dispatch, state }) {
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

        depthTask.start(() => {
            return {
                limit: state.listLimit,
                step: state.depthStep,
                ...getters.exActiveTxPair
            };
        });
    },
    exStopDepthTimer({ commit }) {
        depthTask && depthTask.stop();
        depthTask = null;
        commit('exSetDepthSell', []);
        commit('exSetDepthBuy', []);
    },
    exSetDepthStep({ commit, dispatch }, step) {
        step = +step < 0 ? '' : step;
        commit('exSetDepthStep', step);
        dispatch('exFetchDepth');
    }
};

const getters = {
    exDepthBuyMiningSeparator(state, getters, rootState, rootGetters) {
        const miningPrice = rootGetters.activeTxPairBuyMiningPrice;
        if (!state.buy || !state.buy.length || !miningPrice) {
            return -1;
        }

        for (let i = 0; i < state.buy.length; i++) {
            const currPrice = state.buy[i].price;
            const nextPrice = i + 1 >= state.buy.length ? 0 : state.buy[i + 1].price;

            if (isInBuyMining(currPrice, miningPrice)
                && (
                    i + 1 >= state.buy.length
                    || !isInBuyMining(nextPrice, miningPrice)
                )
            ) {
                return i;
            }
        }

        return -1;
    },
    exDepthSellMiningSeparator(state, getters, rootState, rootGetters) {
        const miningPrice = rootGetters.activeTxPairSellMiningPrice;
        if (!state.sell || !state.sell.length || !miningPrice) {
            return -1;
        }

        for (let i = 0; i < state.sell.length; i++) {
            const currPrice = state.sell[i].price;
            if (isInSellMining(currPrice, miningPrice)) {
                return i;
            }
        }

        return -1;
    },
    exTxPairMaxStep(state, getters, rootState) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return -1;
        }

        const depthStepsLimit = rootState.exchangeLimit.depthStepsLimit;
        const symbol = activeTxPair.symbol;
        if (!depthStepsLimit[symbol]) {
            return -1;
        }

        return depthStepsLimit[symbol].max;
    },
    exTxPairMinStep(state, getters, rootState) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return 0;
        }

        const depthStepsLimit = rootState.exchangeLimit.depthStepsLimit;
        const symbol = activeTxPair.symbol;
        if (!depthStepsLimit[symbol]) {
            return 0;
        }

        return depthStepsLimit[symbol].min;
    }
};

function isInBuyMining(price, miningPrice) {
    if (!miningPrice || !price) {
        return false;
    }
    return bigNumber.compared(price, miningPrice) >= 0;
}

function isInSellMining(price, miningPrice) {
    if (!miningPrice || !price) {
        return false;
    }
    return bigNumber.compared(price, miningPrice) <= 0;
}

export default {
    state,
    mutations,
    actions,
    getters
};
