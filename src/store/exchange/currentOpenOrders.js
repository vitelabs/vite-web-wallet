import { subTask } from 'utils/proto/subTask';

const state = { list: [] };
let task = null;

const mutations = {
    exSetCurrentOpenOrders(state, list) {
        state.list = list || [];
    }
};

const actions = {
    startOrderCurrent({ rootGetters, commit }, params) {
        task = task || new subTask('orderQueryCurrent', ({ args, data }) => {
            if (args.address !== rootGetters.activeAddr || params.symbol !== args.symbol || !data) {
                return;
            }
            commit('exSetCurrentOpenOrders', data.order || data || []);
        }, 2000);

        task.start(() => {
            return {
                address: rootGetters.activeAddr,
                ...params
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
