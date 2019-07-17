import { subTask } from 'utils/proto/subTask';

let latestOrderTask = null;

const state = { latestOrder: null };

const mutations = {
    exSetLatestOrder(state, order) {
        if (!order) {
            return;
        }
        state.latestOrder = order;
    },
    exClearLatestOrder(state) {
        state.latestOrder = null;
    }
};

const actions = {
    exFetchLatestOrder({ rootGetters, commit }) {
        stopLatestOrderTimer();
        commit('exClearLatestOrder');

        latestOrderTask = new subTask('latestOrder', ({ args, data }) => {
            if (rootGetters.activeAddr !== args.address || !data) {
                return;
            }
            commit('exSetLatestOrder', data);
        }, 2000);

        latestOrderTask.start(() => {
            return { address: rootGetters.activeAddr };
        });
    }
};

function stopLatestOrderTimer() {
    latestOrderTask && latestOrderTask.stop();
    latestOrderTask = null;
}

export default {
    state,
    mutations,
    actions
};
