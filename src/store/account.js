const TokenIds = {
    VITE: 'tti_000000000000000000004cfd',
    VCP: 'tti_12ea0c02170304090a5ac879',
    VV: 'tti_b6187a150d175e5a165b1c5b'
};

const state = {
    unConfirmed: {
        balanceInfos:[]
    },
    balance: {
        balanceInfos:[]
    },
    unConfirmes: ''
};

const mutations = {
    commitBalanceInfo(state, payload) {
        state.balance = Object.assign(state.balance, payload.balance);
        state.balance.balanceInfos = state.balance.balanceInfos || [];

        state.unConfirmed = Object.assign(state.unConfirmed, payload.unconfirm);
        state.unConfirmed.balanceInfos = state.unConfirmed.balanceInfos || [];

        // [TODO] Only one token VITE, now.
        state.unConfirmes = state.unConfirmed.unConfirmedBlocksLen;
    },
    commitClearBalance(state) {
        state.balance = {
            balanceInfos:[]
        };
        state.unConfirmed = {
            balanceInfos:[]
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
        const tokenInfo = Object.create(null);

        state.balance.balanceInfos.forEach(balanceInfo => {
            let mintage = balanceInfo.mintage;
            let balance = viteWallet.BigNumber.toBasic(balanceInfo.balance, mintage.decimals);

            tokenInfo[mintage.id] = tokenInfo[mintage.id] || {};
            tokenInfo[mintage.id].balance = balance;
            tokenInfo[mintage.id].symbol = mintage.symbol;
            tokenInfo[mintage.id].id = mintage.id;
            tokenInfo[mintage.id].decimals = mintage.decimals;
        });

        state.unConfirmed.balanceInfos.forEach(balanceInfo => {
            let mintage = balanceInfo.mintage;
            let balance = viteWallet.BigNumber.toBasic(balanceInfo.balance, mintage.decimals);

            tokenInfo[mintage.id] = tokenInfo[mintage.id] || {};
            tokenInfo[mintage.id].fundFloat = balance;
            tokenInfo[mintage.id].symbol = tokenInfo[mintage.id].symbol || mintage.symbol;
            tokenInfo[mintage.id].id = tokenInfo[mintage.id].id || mintage.id;
            tokenInfo[mintage.id].decimals = mintage.decimals;
        });

        for (let symbol in TokenIds) {
            tokenInfo[ TokenIds[symbol] ] = tokenInfo[ TokenIds[symbol] ] || {
                balance: '0',
                fundFloat: '0',
                symbol: symbol,
                decimals: '0'
            };
            // [TODO] API Only one token VITE, now.
            symbol === 'VITE' && (tokenInfo[ TokenIds[symbol] ].unConfirmes = state.unConfirmes);
        }

        return tokenInfo;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
