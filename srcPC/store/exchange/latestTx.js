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

        if (!state.txList || !state.txList.length) {
            state.txList = list;
            return;
        }

        const nextTx = list[list.length - 1];
        const currLastTx = state.txList[0];

        if (currLastTx.time > nextTx.time) {
            return;
        }
        if (currLastTx.time === nextTx.time && currLastTx.blockHeight > nextTx.blockHeight) {
            return;
        }

        let arr = [].concat(state.txList);
        arr.forEach(tx => {
            const index = list.findIndex(v => v.tradeId === tx.tradeId);
            if (index >= 0) {
                list.splice(index, 1);
            }
        });

        arr = list.concat(arr);
        arr = arr.slice(0, 30);
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
            } else {
                data = data || [];
                data.reverse();
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
