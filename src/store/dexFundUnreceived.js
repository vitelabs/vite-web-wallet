import { timer } from 'utils/asyncFlow';
import { getDexFundAddrOnroadInfo } from 'services/viteServer';

const loopTime = 5 * 1000;
let unreceivedTimer = null;

const state = {
    unreveivedNum: 0,
    blockingLever: 0
};

const mutations = {
    dexSetUnreveived(state, data) {
        if (!data) {
            return;
        }
        state.unreveivedNum = data.totalNum || 0;
    },
    dexClearUnreveived(state) {
        state.unreveivedNum = 0;
    }
};

const actions = {
    startLoopDexFundeUnreceived({ commit, dispatch }) {
        // 1. Stop last loop
        dispatch('stopLoopDexFundUnreceived');

        // 2. Restart
        unreceivedTimer = new timer(() => getDexFundAddrOnroadInfo().then(data => {
            commit('dexSetUnreveived', data);
        }), loopTime);
        unreceivedTimer.start();
    },
    stopLoopDexFundUnreceived({ commit }) {
        commit('dexClearUnreveived');
        unreceivedTimer && unreceivedTimer.stop();
        unreceivedTimer = null;
    }
};

const getters = {
    dexBlockingLever(state) {
        if (state.unreveivedNum >= 100) {
            return 1;
        }
        if (state.unreveivedNum >= 400) {
            return 2;
        }
        if (state.unreveivedNum >= 1200) {
            return 3;
        }
        return 0;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
