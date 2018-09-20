const state = {
    unConfirmed: {
        balanceInfos:[]
    },
    balance: {
        balanceInfos:[]
    }
};

const mutations = {
    commitBalanceInfo(state, payload) {
        state.balance = Object.assign(state.balance, payload.balance);
        state.balance.balanceInfos = state.balance.balanceInfos || [];

        state.unConfirmed = Object.assign(state.unConfirmed, payload.unconfirm);
        state.unConfirmed.balanceInfos = state.unConfirmed.balanceInfos || [];
    }
};

const actions = {
    getBalanceInfo({
        commit
    }, activeAccount) {
        return activeAccount.getBalance().then(data => {
            commit('commitBalanceInfo', data);
        }).catch(e => {
            console.warn(e);
        });
    },
};

const getters = {
    tokenBalanceList(state) {
        const tokenInfo = Object.create(null);

        state.balance.balanceInfos.forEach(balanceInfo => {
            let mintage = balanceInfo.mintage;
            let balance = viteWallet.Token.toBasic(balanceInfo.balance, mintage.decimals);

            tokenInfo[mintage.id] = tokenInfo[mintage.id] || {};
            tokenInfo[mintage.id].balance = balance;
            tokenInfo[mintage.id].symbol = mintage.symbol;
            tokenInfo[mintage.id].id = mintage.id;
            tokenInfo[mintage.id].decimals = mintage.decimals;
        });

        state.unConfirmed.balanceInfos.forEach(balanceInfo => {
            let mintage = balanceInfo.mintage;
            let balance = viteWallet.Token.toBasic(balanceInfo.balance, mintage.decimals);

            tokenInfo[mintage.id] = tokenInfo[mintage.id] || {};
            tokenInfo[mintage.id].fundFloat = balance;
            tokenInfo[mintage.id].symbol = tokenInfo[mintage.id].symbol || mintage.symbol;
            tokenInfo[mintage.id].id = tokenInfo[mintage.id].id || mintage.id;
            tokenInfo[mintage.id].decimals = mintage.decimals;
            // [TODO] Only one token, now.
            tokenInfo[mintage.id].unConfirmes = balanceInfo.unConfirmedBlocksLen;
        });

        return tokenInfo;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
