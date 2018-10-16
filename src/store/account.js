const TokenIds = {
    'tti_000000000000000000004cfd': 'VITE',
    'tti_12ea0c02170304090a5ac879': 'VCP',
    'tti_b6187a150d175e5a165b1c5b': 'VV'
};

const state = {
    onroad: {
        balanceInfos: {}
    },
    balance: {
        balanceInfos: {}
    }
};

const mutations = {
    commitBalanceInfo(state, payload) {
        state.balance = Object.assign(state.balance, payload.balance);
        state.balance.balanceInfos = state.balance.tokenBalanceInfoMap || [];

        state.onroad = Object.assign(state.onroad, payload.onroad);
        state.onroad.balanceInfos = state.onroad.tokenBalanceInfoMap || [];
    },
    commitClearBalance(state) {
        state.balance = {
            balanceInfos:{}
        };
        state.onroad = {
            balanceInfos:{}
        };
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

        for (let tokenId in TokenIds) {
            balanceInfo[tokenId] = balanceInfo[tokenId] || {
                balance: '0',
                fundFloat: '0',
                symbol: TokenIds[tokenId],
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
