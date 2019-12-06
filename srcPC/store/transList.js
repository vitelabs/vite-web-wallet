import BigNumber from 'utils/bigNumber';
import { getAccountTxList } from 'services/viteServer';

const pageCount = 50;
let lastFetchTime = null;

const state = {
    transList: [],
    totalNum: 0,
    currentPage: 0
};

const mutations = {
    commitSetCurrent(state, pageIndex) {
        state.currentPage = pageIndex;
    },
    commitTransList(state, payload) {
        state.totalNum = payload.totalNum || 0;
        state.transList = payload.list || [];
    },
    commitClearTransList(state) {
        state.transList = [];
        state.totalNum = 0;
        state.currentPage = 0;
    }
};

const actions = {
    fetchTransList({ commit, state, rootState, dispatch }, { address, pageIndex }) {
        const fetchTime = new Date().getTime();
        lastFetchTime = fetchTime;
        commit('commitSetCurrent', pageIndex);

        return getAccountTxList({ address, pageIndex, pageCount }).then(data => {
            if (pageIndex !== state.currentPage
                || fetchTime !== lastFetchTime
                || !data) {
                return null;
            }

            const accountBlockCount = rootState.account.accountBlockCount;
            const list = data || [];

            commit('commitTransList', {
                list,
                totalNum: accountBlockCount < list.length ? list.length : accountBlockCount
            });
            data.list && dispatch('setTokenInfoList', data.list);

            return data;
        });
    }
};

const getters = {
    totalPage(state) {
        return BigNumber.dividedCeil(state.totalNum, pageCount);
    },
    transList(state) {
        const list = state.transList || [];
        const nowList = [];

        list.forEach(item => {
            // ( confirms )
            const confirms = item.confirmations || 0;

            // Unconfirmed
            let status = 0;
            // Confirms
            if (confirms && confirms > 0 && confirms <= 50) {
                status = 1;
            // Confirmed
            } else if (confirms && confirms > 50) {
                status = 2;
            }

            const isSend = [ 1, 2, 3 ].indexOf(+item.blockType) > -1;
            const timestamp = item.timestamp * 1000;
            const transAddr = isSend ? item.toAddress : item.fromAddress;

            const amount = item.tokenInfo && item.tokenInfo.decimals
                ? BigNumber.toBasic(item.amount, item.tokenInfo.decimals)
                : item.amount;

            nowList.push({
                isSend,
                status,
                confirms,
                timestamp,
                transAddr,
                amount,
                tokenSymbol: item.tokenInfo && item.tokenInfo.tokenSymbol ? item.tokenInfo.tokenSymbol : '--',
                rawData: item
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
