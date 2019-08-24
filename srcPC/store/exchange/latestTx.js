import { subTask } from 'utils/proto/subTask';

const latestTxTime = 2000;
let latestTxTask = null;

const state = {
    txList: [],
    isLoading: false
};

const mutations = {
    exSetLatestTxList(state, list) {
        list = list || [];

        let arr = [].concat(state.txList);
        arr.forEach(tx => {
            const index = list.findIndex(v => v.tradeId === tx.tradeId);
            if (index >= 0) {
                list.splice(index, 1);
            }
        });

        arr = arr.concat(list || []);
        arr.sort((a, b) => b.time - a.time);
        arr = arr.slice(0, 100);

        state.txList = arr || [];
    },
    exSetLatestTxLoading(state, isLoading) {
        state.isLoading = isLoading;
    },
    exClearLatestTxList(state) {
        state.txList = [];
    }
};

const actions = {
    exFetchLatestTx({ getters, commit }) {
        commit('exSetLatestTxLoading', true);
        commit('exClearLatestTxList', []);

        stopLatestTimer();
        latestTxTask = new subTask('latestTx', ({ args, data }) => {
            if (getters.exActiveTxPair.symbol !== args.symbol) {
                return;
            }

            if (data && data.trade) {
                data = data.trade || [];
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
