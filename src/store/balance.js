import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import { getAccountDexBalance } from 'services/viteServer';
import { VX_TOKENID, VITE_TOKENID } from 'utils/constant';

const loopTime = 2 * 1000;
let balanceTimer = null;
let address = null;


// tti_5649544520544f4b454e6e40: {,…}
// available: "12000000000000000000"
// locked: "0"
// tokenInfo: {tokenName: "Vite Token", tokenSymbol: "VITE", totalSupply: "1000000000000000000000000000",…}
// decimals: 18
// index: 0
// isOwnerBurnOnly: false
// isReIssuable: true
// maxSupply: "100000000000000000000000000000"
// owner: "vite_962eab5a19e51fe36506308f6fcf337876139bd5fee3048c46"
// ownerBurnOnly: false
// tokenId: "tti_5649544520544f4b454e6e40"
// tokenName: "Vite Token"
// tokenSymbol: "VITE"
// totalSupply: "1000000000000000000000000000"}
const state = { balanceList: {} };

const mutations = {
    setExchangeBalance(state, balanceList) {
        state.balanceList = balanceList;
    },
    clearDexBalance(state) {
        state.balanceList = {};
    }
};

const actions = {
    startLoopExchangeBalance({ commit, dispatch, rootGetters }) {
        // 1. Stop last loop
        dispatch('stopLoopExchangeBalance');

        // 2. Restart
        balanceTimer = new timer(() => {
            if (address && rootGetters.activeAddr !== address) {
                commit('clearDexBalance');
            }
            address = rootGetters.activeAddr;

            getAccountDexBalance(address).then(data => {
                // If address changed, return
                if (rootGetters.activeAddr !== address) {
                    return;
                }
                data && commit('setExchangeBalance', data);
            }).catch(e => {
                const code = e && e.error && e.error.code;
                code === -32002 && commit('clearDexBalance');
            });
        }, loopTime);
        balanceTimer.start();
    },
    stopLoopExchangeBalance() {
        balanceTimer && balanceTimer.stop();
        balanceTimer = null;
    }
};

const getters = {
    exBalanceList(state) {
        const balance = {};

        Object.keys(state.balanceList).forEach(k => {
            balance[k] = {
                availableExAmount: state.balanceList[k].available,
                available: BigNumber.toBasic(state.balanceList[k].available, state.balanceList[k].tokenInfo.decimals),
                lock: BigNumber.toBasic(state.balanceList[k].locked, state.balanceList[k].tokenInfo.decimals),
                totalExAmount: BigNumber.plus(state.balanceList[k].available, state.balanceList[k].locked, 0),
                ...state.balanceList[k].tokenInfo
            };
        });

        return balance;
    },
    exVXBalanceInfo(state) {
        if (!state.balanceList || !state.balanceList[VX_TOKENID]) {
            return {};
        }
        return state.balanceList[VX_TOKENID];
    },
    exViteBalanceInfo(state) {
        if (!state.balanceList || !state.balanceList[VITE_TOKENID]) {
            return {};
        }
        return state.balanceList[VITE_TOKENID];
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
