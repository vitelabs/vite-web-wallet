import { subTask } from 'utils/proto/subTask';

const latestTxTime = 2000;
let latestTxTask = null;

const state = {
    txList: [],
    isLoading: false
};

const mutations = {
    exSetLatestTxList(state, list) {
        state.txList = list || [];
    },
    exSetLatestTxLoading(state, isLoading) {
        state.isLoading = isLoading;
    }
};

const actions = {
    exFetchLatestTx({ getters, commit }) {
        commit('exSetLatestTxLoading', true);
        commit('exSetLatestTxList', []);

        stopLatestTimer();
        latestTxTask = new subTask('latestTx', ({ args, data }) => {
            if (getters.exActiveTxPair.ftoken !== args.ftoken
                || getters.exActiveTxPair.ttoken !== args.ttoken) {
                return;
            }
            commit('exSetLatestTxList', data);
            commit('exSetLatestTxLoading', false);
        }, latestTxTime);

        getters.exActiveTxPair && latestTxTask.start(() => getters.exActiveTxPair);
    },
    exStopLatestTimer() {
        stopLatestTimer();
    }
};

function stopLatestTimer() {
    latestTxTask && latestTxTask.stop();
    latestTxTask = null;
}

export default {
    state,
    mutations,
    actions
};
