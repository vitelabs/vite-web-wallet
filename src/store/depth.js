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
        let list = depthData || [];
        state.rawSell = [].concat(list).splice(0, state.listLimit);

        list.sort((a, b) => bigNumber.compared(b.price, a.price));
        list = list.splice(0, state.listLimit);
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
        commit('exSetDepthStep', step);
        dispatch('exFetchDepth');
    }
};

const getters = {
    exBuyOnePrice(state) {
        return state.buy && state.buy.length ? state.buy[0].price : '';
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
