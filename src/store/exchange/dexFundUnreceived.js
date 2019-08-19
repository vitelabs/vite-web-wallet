import { constant } from '@vite/vitejs';
import { timer } from 'utils/asyncFlow';
import $ViteJS from 'utils/viteClient';

const loopTime = 5 * 1000;
const DexFund_Addr = constant.DexFund_Addr;
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
        unreceivedTimer = new timer(() => $ViteJS.request('onroad_getOnroadInfoByAddress', DexFund_Addr).then(data => {
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
