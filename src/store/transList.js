import ellipsisAddr from 'utils/ellipsisAddr.js';

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
        return viteWallet.BigNumber.dividedToNumber(state.totalNum, pageCount);
    },
    transList(state) {
        let list = state.transList || [];
        let nowList = [];

        list.forEach((item) => {
            let confirms = item.confirmedTimes || 0;

            let status = 'unconfirmed';
            if (confirms && confirms > 0 && confirms <= 50) {
                status = 'confirms';
            } else if (confirms && confirms > 50) {
                status = 'confirmed';
            }

            let isSend = [1, 2, 3].indexOf(+item.blockType) > -1;
            let timestamp = item.timestamp * 1000;
            let transAddr = ellipsisAddr( isSend ? item.toAddress : item.fromAddress );

            let amount = item.tokenInfo && item.tokenInfo.decimals ?
                viteWallet.BigNumber.toBasic(item.amount, item.tokenInfo.decimals) :
                item.amount;
            let isZero = viteWallet.BigNumber.isEqual(amount, 0);

            nowList.push({
                type: isSend ? 'send' : 'receive',
                status,
                confirms: `(${confirms})`,
                timestamp,
                transAddr,
                amount: isSend && !isZero ? ('-' + amount) : amount,
                hash: item.hash,
                token: item.tokenInfo && item.tokenInfo.tokenSymbol ? item.tokenInfo.tokenSymbol : '--'
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
