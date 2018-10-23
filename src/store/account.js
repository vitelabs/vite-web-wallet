import request from 'utils/request';

const state = {
    onroad: {
        balanceInfos: {}
    },
    balance: {
        balanceInfos: {}
    },
    tokenIds: {}
};

const mutations = {
    commitBalanceInfo(state, payload, ) {
        state.balance = payload.balance || {};
        state.balance.balanceInfos = state.balance && state.balance.tokenBalanceInfoMap ? state.balance.tokenBalanceInfoMap : [];

        state.onroad = payload.onroad || {};
        state.onroad.balanceInfos = state.onroad && state.onroad.tokenBalanceInfoMap ? state.onroad.tokenBalanceInfoMap : [];
    },
    commitClearBalance(state) {
        state.balance = {
            balanceInfos:{}
        };
        state.onroad = {
            balanceInfos:{}
        };
    },
    commitSetTokenIds(state, tokenIds) {
        state.tokenIds = tokenIds;
    }
};

const actions = {
    getBalanceInfo({ commit }, activeAccount) {
        return activeAccount.getBalance().then(data => {
            commit('commitBalanceInfo', data);
        }).catch(e => {
            console.warn(e);
        });
    },
    getDefaultTokenList({ commit }) {
        let toRequest = window.viteWalletRequest || request;

        toRequest({
            method: 'GET',
            path: '/api/version/config?app=web&channel=token&version=default',
            type: 'form'    // Client Wallet
        }).then((data)=>{
            if (!data) {
                return;
            }

            data = JSON.parse(data);
            let tokenIds = {};
            data.forEach((item) => {
                tokenIds[item.tokenId] = item.tokenSymbol;
            });
            
            commit('commitSetTokenIds', tokenIds);
        }).catch((err) => {
            console.error(err);
        });
    }
};

const getters = {
    tokenBalanceList(state) {
        let balanceInfo = Object.create(null);

        for (let tokenId in state.balance.balanceInfos) {
            let item = state.balance.balanceInfos[tokenId];

            let tokenInfo = item.tokenInfo;
            let decimals = tokenInfo.decimals;
            let balance = viteWallet.BigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = tokenInfo[tokenId] || {};
            balanceInfo[tokenId].id = tokenId;
            balanceInfo[tokenId].balance = balance;
            balanceInfo[tokenId].decimals = decimals;
            balanceInfo[tokenId].symbol = tokenInfo.tokenSymbol;
            balanceInfo[tokenId].transNum = item.number;
        }

        for (let tokenId in state.onroad.balanceInfos) {
            let item = state.onroad.balanceInfos[tokenId];

            let tokenInfo = item.tokenInfo;
            let decimals = tokenInfo.decimals;
            let balance = viteWallet.BigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = balanceInfo[tokenId] || {};
            balanceInfo[tokenId].id = balanceInfo[tokenId].id || tokenInfo.id;
            balanceInfo[tokenId].fundFloat = balance;
            balanceInfo[tokenId].decimals = balanceInfo[tokenId].decimals || tokenInfo.decimals;
            balanceInfo[tokenId].symbol = balanceInfo[tokenId].symbol || tokenInfo.tokenSymbol;
            balanceInfo[tokenId].onroadNum = item.number;
        }

        for (let tokenId in state.tokenIds) {
            balanceInfo[tokenId] = balanceInfo[tokenId] || {
                balance: '0',
                fundFloat: '0',
                symbol: state.tokenIds[tokenId],
                decimals: '0'
            };
        }

        return balanceInfo;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
