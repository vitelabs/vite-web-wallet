import { subTask } from 'utils/proto/subTask';

const state = { list: [] };
let task = null;

const mutations = {
    exSetCurrentOpenOrders(state, list) {
        state.list = list || [];
    }
};

const actions = {
    startOrderCurrent({ rootGetters, rootState, commit }) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair || !activeTxPair.symbol) {
            return;
        }

        task = task || new subTask('orderQueryCurrent', ({ args, data }) => {
            if (!activeTxPair || args.address !== rootGetters.activeAddr || activeTxPair.symbol !== args.symbol || !data) {
                return;
            }
            commit('exSetCurrentOpenOrders', data.order || data || []);
        }, 2000);

        task.start(() => {
            return {
                address: rootGetters.activeAddr,
                symbol: activeTxPair.symbol
            };
        });
    },
    stopOrderCurrent() {
        task && task.stop();
        task = null;
    }
};

export default {
    state,
    actions,
    mutations
};
