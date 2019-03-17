import { subTask } from 'utils/proto/subTask';

const latestTxTime = 2000;
let latestTxTask = null;

const state = {
    txList: [],
    isLoading: false
};

const mutations = {
    exSetLatestTxList(state, list) {
        state.txList = list;
    },
    exSetLatestTxLoading(state, isLoading) {
        state.isLoading = isLoading;
    }
};

const actions = {
    exFetchLatestTx({ getters, commit }) {
        // Init;
        commit('exSetLatestTxLoading', true);
        // Loop;
        stopLatestTimer();
        latestTxTask = new subTask('latestTx', ({ data }) => {
            data && commit('exSetLatestTxList', data);
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
}

export default {
    state,
    mutations,
    actions
};
