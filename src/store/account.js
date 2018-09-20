const state = {
    unConfirmedInfo: {
        balanceInfos:[]
    },
    balanceInfo: {
        balanceInfos:[]
    }
};

const mutations = {
    commitUnConfirmedInfo(state, payload) {
        state.unConfirmedInfo = Object.assign(state.unConfirmedInfo,payload);
        state.unConfirmedInfo.balanceInfos=state.unConfirmedInfo.balanceInfos||[];
    },
    commitBalanceInfo(state, payload) {
        state.balanceInfo = Object.assign(state.balanceInfo,payload);
        state.balanceInfo.balanceInfos=state.balanceInfo.balanceInfos||[];
    }
};
const actions = {
    getBalanceInfo({
        commit
    }, acc) {
        return acc.getAccountByAccAddr().then(data => {
            commit('commitBalanceInfo', data.result);
        }).catch(e=>{
            console.log(9999,e);
        });
    },
    getUnconfirmedInfo({
        commit
    }, acc) {
        return acc.getUnconfirmedInfo().then(data => {
            commit('commitUnConfirmedInfo', data.result);
        });
    }
};

const getters = {
    tokenBalanceList(state) {
        const tokenInfo = Object.create(null);
        state.balanceInfo.balanceInfos.forEach(v => {
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
        state.balanceInfo.balanceInfos.forEach(v => {
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
    mutations,
    actions,
    getters
};