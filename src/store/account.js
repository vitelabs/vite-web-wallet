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
        state.balance = payload.balance || {};
        state.balance.balanceInfos = state.balance && state.balance.tokenBalanceInfoMap ? state.balance.tokenBalanceInfoMap : {};

        state.onroad = payload.onroad || {};
        state.onroad.balanceInfos = state.onroad && state.onroad.tokenBalanceInfoMap ? state.onroad.tokenBalanceInfoMap : {};
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

            let balanceInfos = data && data.balance && data.balance.tokenBalanceInfoMap ? 
                data.balance.tokenBalanceInfoMap : {};
            for (let tokenId in balanceInfos) {
                let item = balanceInfos[tokenId];
                viteWallet.Ledger.setTokenInfo(item.tokenInfo || null, tokenId);
            }
        }).catch(e => {
            console.warn(e);
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

        for (let tokenId in viteWallet.Ledger.defaultTokenIds) {
            if (!viteWallet.Ledger.tokenInfoMaps[tokenId] && !balanceInfo[tokenId]) {
                break;
            }

            let symbol = viteWallet.Ledger.tokenInfoMaps[tokenId].tokenSymbol || viteWallet.Ledger.defaultTokenIds[tokenId];
            balanceInfo[tokenId] = balanceInfo[tokenId] || {
                balance: '0',
                fundFloat: '0',
                symbol,
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
