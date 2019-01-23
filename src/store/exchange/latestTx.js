import { latestTx } from 'services/exchange';
import { timer } from 'utils/asyncFlow';

const latestTxTime = 2000;
let latestTxTimer = null;

const state = {
    txList: [{
        'txSide': 1, //0:bug,1:sell
        'price': '0.00000000', //成交价
        'quantity': '0.00000000', //交易数量 
        'txTime': 1548150873040 //时间戳
    },{
        'txSide': 0, //0:bug,1:sell
        'price': '2323', //成交价
        'quantity': '3290184', //交易数量 
        'txTime': 1548150873040 //时间戳
    },{
        'txSide': 1, //0:bug,1:sell
        'price': '2323', //成交价
        'quantity': '0000000', //交易数量 
        'txTime': 1548150873040 //时间戳
    }],
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

        let _f = (cb) => {
            return latestTx({
                fToken: activeTxPair.fToken,
                tToken: activeTxPair.tToken
            }).then((data) => {
                cb && cb();
                commit('exSetLatestTxList', data);
            }).catch(err => {
                console.warn(err);
                cb && cb();
            });
        };

        // Init
        commit('exSetLatestTxLoading', true);
        _f(() => {
            commit('exSetLatestTxLoading', false);
        });

        // Loop
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

// const getters = {
//     tota(state) {

//     }
// };

export default {
    state,
    mutations,
    actions,
    // getters
};
