const pageCount = 50;

let lastFetchTime = null;
let lastFetchQuotaTime = null;

const state = {
    // amount data
    quotaAmount: '',
    pledgeTransNum: '',
    // list data
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
        // amount data
        state.quotaAmount = '';
        state.pledgeTransNum = '';
        // list data
        state.totalPledgeAmount = '';
        state.pledgeList = [];
        state.totalNum = 0;
        state.currentPage = 0;
    }
};

const actions = {
    fetchQuota({ commit }, address) {
        let fetchTime = new Date().getTime();
        lastFetchQuotaTime = fetchTime;

        return viteWallet.Pledge.getPledgeQuota(address).then((data)=>{
            if (fetchTime !== lastFetchQuotaTime || !data || !data.result) {
                return null;
            }

            commit('commitQuota', data.result);
            return data.result;
        });
    },
    fetchPledgeList({ commit, state }, { address, pageIndex }) {
        let fetchTime = new Date().getTime();
        lastFetchTime = fetchTime;
        commit('commitSetCurrent', pageIndex);

        return viteWallet.Pledge.getPledgeList({
            addr: address,
            index: pageIndex,
            pageCount
        }).then((data)=>{
            if (pageIndex !== state.currentPage || 
                fetchTime !== lastFetchTime ||
                !data || !data.result) {
                return null;
            }

            commit('commitPledgeList', data.result);
            return data.result;
        });
    }
};

const getters = {
    totalPledgePage(state) {
        return viteWallet.BigNumber.dividedToNumber(state.totalNum || 0, pageCount);
    },
    pledgeList(state) {
        let list = state.pledgeList || [];
        let nowList = [];

        list.forEach((item) => {
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
