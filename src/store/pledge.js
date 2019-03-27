import BigNumber from 'utils/bigNumber';
import $ViteJS from 'utils/viteClient';

const pageCount = 50;

let lastFetchTime = null;
let lastFetchQuotaTime = null;
let lastAddress = null;

const state = {
    // Amount data
    quotaAmount: '',
    pledgeTransNum: '',
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
        state.totalPledgeAmount = payload.totalPledgeAmount;
        state.pledgeList = payload.pledgeInfoList || [];
        state.totalNum = payload.totalCount || 0;
    },
    commitQuota(state, payload) {
        state.quotaAmount = payload.quota;
        state.pledgeTransNum = payload.txNum;
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
    fetchQuota({ commit }, address) {
        const fetchTime = new Date().getTime();
        lastFetchQuotaTime = fetchTime;
        lastAddress = address;

        return $ViteJS.pledge.getPledgeQuota(address).then(result => {
            if (fetchTime !== lastFetchQuotaTime
                || !result
                || address !== lastAddress) {
                return null;
            }

            commit('commitQuota', result);
            return result;
        });
    },
    fetchPledgeList({ commit, state }, { address, pageIndex }) {
        const fetchTime = new Date().getTime();
        lastFetchTime = fetchTime;
        lastAddress = address;
        commit('commitSetCurrent', pageIndex);

        return $ViteJS.pledge.getPledgeList(address, pageIndex, pageCount).then(result => {
            if (pageIndex !== state.currentPage
                || fetchTime !== lastFetchTime
                || !result
                || lastAddress !== address) {
                return null;
            }

            commit('commitPledgeList', result);
            return result;
        });
    }
};

const getters = {
    totalPledgePage(state) {
        return BigNumber.dividedToNumber(state.totalNum || 0, pageCount);
    },
    pledgeList(state) {
        const list = state.pledgeList || [];
        const nowList = [];

        list.forEach(item => {
            nowList.push({
                beneficialAddr: item.beneficialAddr,
                withdrawHeight: item.withdrawHeight,
                withdrawTime: item.withdrawTime,
                amount: item.amount
            });
        });

        return nowList;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
