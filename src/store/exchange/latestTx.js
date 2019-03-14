import { latestTx } from 'services/exchange';
import { timer } from 'utils/asyncFlow';

const latestTxTime = 2000;
let latestTxTimer = null;
let ftoken = null;
let ttoken = null;

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
    exFetchLatestTx({ rootState, commit }) {
        let activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return;
        }

        ftoken = activeTxPair.ftoken;
        ttoken = activeTxPair.ttoken;

        let _f = (cb) => {
            return latestTx({
                ftoken, ttoken
            }).then((data) => {
                cb && cb(data || []);
            }).catch(err => {
                console.warn(err);
                cb && cb();
            });
        };

        // Init;
        commit('exSetLatestTxLoading', true);
        _f((data) => {
            let _activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
            if (_activeTxPair.pairCode !== activeTxPair.pairCode) {
                return;
            }
            data && commit('exSetLatestTxList', data);
            commit('exSetLatestTxLoading', false);
        });

        // Loop;
        stopLatestTimer();
        latestTxTimer = new timer(()=>{
            return _f();
        }, latestTxTime);
        latestTxTimer.start();
    },
    exStopLatestTimer() {
        stopLatestTimer();
    }
};

function stopLatestTimer() {
    latestTxTimer && latestTxTimer.stop();
    latestTxTimer = null;
}

export default {
    state,
    mutations,
    actions
};
