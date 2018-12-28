import BigNumber from 'utils/bigNumber';

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

        for(let i=0; i<state.transList.length; i++) {
            let item = state.transList[i];
            let tokenId = item.tokenId;
            viteWallet.Ledger.setTokenInfo(item.tokenInfo || null, tokenId);
        }
    },
    commitClearTransList(state) {
        state.transList = [];
        state.totalNum = 0;
        state.currentPage = 0;
    }
};

const actions = {
    fetchTransList({ commit, state }, { address, pageIndex }) {
        let fetchTime = new Date().getTime();
        lastFetchTime = fetchTime;
        commit('commitSetCurrent', pageIndex);

        return viteWallet.Ledger.getBlocks({
            addr: address,
            index: pageIndex,
            pageCount
        }).then((data)=>{
            if (pageIndex !== state.currentPage || 
                fetchTime !== lastFetchTime ||
                !data) {
                return null;
            }

            commit('commitTransList', data);
            return data;
        });
    }
};

const getters = {
    totalPage(state) {
        return BigNumber.dividedToNumber(state.totalNum, pageCount);
    },
    transList(state) {
        let list = state.transList || [];
        let nowList = [];

        list.forEach((item) => {
            let confirms = item.confirmedTimes || 0;    // ( confirms )

            let status = 0; // unconfirmed
            if (confirms && confirms > 0 && confirms <= 50) {
                status = 1; // confirms
            } else if (confirms && confirms > 50) {
                status = 2; // confirmed
            }

            let isSend = [1, 2, 3].indexOf(+item.blockType) > -1;
            let timestamp = item.timestamp * 1000;
            let transAddr = isSend ? item.toAddress : item.fromAddress;

            let amount = item.tokenInfo && item.tokenInfo.decimals ?
                BigNumber.toBasic(item.amount, item.tokenInfo.decimals) :
                item.amount;

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
