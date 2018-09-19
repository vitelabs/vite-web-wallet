const state = {
    unConfirmedInfo: {},
    balanceInfo: {}
};

const mutation = {
    commitUnConfrmedInfo(state, payload) {
        state.unConfirmedInfo = payload;
    },
    commitBalanceInfo(state, payload) {
        state.balanceInfo = payload;
    }
};
const actions = {
    getBalanceInfo({
        commit
    }, acc) {
        return acc.getAccountByAccAddr().then(data => {
            commit('commitBalanceInfo', data.result.balanceInfo);
        });
    },
    getUnconfirmedInfo({
        commit
    }, acc) {
        return acc.getUnconfirmedInfo().then(data => {
            commit('commitUnConfirmedInfo', data.result.balanceInfo);
        });
    }
};

const getters = {
    tokenBalanceList(state) {
        const tokenInfo = Object.create(null);
        state.balanceInfo.forEach(v => {
            v.balance = viteWallet.Token.toBasic(v.balance, v.mintage.decimals);
            if (tokenInfo[v.mintage.id]) {
                tokenInfo[v.mintage.id].accBalance = v.balance;
            } else {
                tokenInfo[v.mintage.id] = {
                    symbol: v.symbol,
                    tokenName: v.name,
                    accBalance: v.balance,
                    unConfirmedBalance: '--',
                    unConfirmedNums: '--'
                };
            }
        });
        state.balanceInfo.forEach(v => {
            v.balance = viteWallet.Token.toBasic(v.balance, v.mintage.decimals);
            if (tokenInfo[v.mintage.id]) {
                tokenInfo[v.mintage.id].unConfirmedBalance = v.balance;
                tokenInfo[v.mintage.id].unConfirmedNums = v.unConfirmedNums;
            } else {
                tokenInfo[v.mintage.id] = {
                    symbol: v.symbol,
                    tokenName: v.name,
                    accBalance: '--',
                    unConfirmedBalance: v.balance,
                    //   unConfirmedNums: v.unConfirmedNums
                };
            }
        });
        return tokenInfo;
    }
};

export default {
    state,
    mutation,
    actions,
    getters
};