import { getAccountQuota, getAccountPledgeList } from 'services/viteServer';
import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';

const pageCount = 50;
const quotaPerUT = 21000;

let lastFetchTime = null;
let lastFetchQuotaTime = null;
let lastAddress = null;
let autoLoopQuotaTimer = null;
const state = {
    // Amount data
    quotaAmount: '',
    pledgeTransNum: '',
    maxQuotaLoading: true,
    maxQuota: '',
    // List data
    totalPledgeAmount: '',
    pledgeList: [],
    totalNum: 0,
    currentPage: 0
};

const mutations = {
    commitSetCurrent(state, pageIndex) {
        state.currentPage = pageIndex;
    },
    commitPledgeList(state, payload) {
        state.totalPledgeAmount = payload.totalStakeAmount;
        state.totalNum = payload.totalStakeCount || 0;
        state.pledgeList = payload.stakeList || [];
    },
    commitQuota(state, payload) {
        state.quotaAmount = payload.currentQuota;
        state.pledgeTransNum = bigNumber.toBasic(payload.currentQuota / quotaPerUT,
            0,
            3);
    },
    setMaxQuota(state, payload) {
        state.maxQuota = payload.maxQuota;
    },
    setMaxQuotaIsLoading(state, payload) {
        state.maxQuotaLoading = payload;
    },
    commitClearPledge(state) {
        // Amount data
        state.quotaAmount = '';
        state.pledgeTransNum = '';
        // List data
        state.totalPledgeAmount = '';
        state.pledgeList = [];
        state.totalNum = 0;
        state.currentPage = 0;
    }
};

const actions = {
    startLoopQuota({ dispatch, commit }) {
        if (autoLoopQuotaTimer) {
            commit('setMaxQuotaIsLoading', true);
            autoLoopQuotaTimer.stop();

            autoLoopQuotaTimer = null;
        }
        autoLoopQuotaTimer = new timer(() => {
            dispatch('fetchQuota');
        }, 10000);
        autoLoopQuotaTimer.start();
    },

    fetchQuota({ commit, rootState }) {
        const activeAccount = rootState.wallet.activeAcc;
        const address = activeAccount ? activeAccount.address : '';

        const fetchTime = new Date().getTime();
        lastFetchQuotaTime = fetchTime;
        lastAddress = address;

        return getAccountQuota(address).then(result => {
            if (
                fetchTime !== lastFetchQuotaTime
                || !result
                || address !== lastAddress
            ) {
                return null;
            }

            commit('commitQuota', result);
            commit('setMaxQuota', result);
            commit('setMaxQuotaIsLoading', false);
            return result;
        });
    },
    fetchPledgeList({ commit, state }, { address, pageIndex }) {
        const fetchTime = new Date().getTime();
        lastFetchTime = fetchTime;
        lastAddress = address;
        commit('commitSetCurrent', pageIndex);

        return getAccountPledgeList(address, pageIndex, pageCount).then(result => {
            if (
                pageIndex !== state.currentPage
                    || fetchTime !== lastFetchTime
                    || !result
                    || lastAddress !== address
            ) {
                return null;
            }

            commit('commitPledgeList', result);
            return result;
        });
    }
};

const getters = {
    totalPledgePage(state) {
        const totalNum = state.totalNum || 0;
        return Math.ceil(totalNum / pageCount);
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
