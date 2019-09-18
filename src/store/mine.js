import { constant } from '@vite/vitejs';
import bigNumber from 'utils/bigNumber';
import { getCurrentFeesForMine, getAllFeesOfAddress, getMinThresholdForTradeAndMining, getCurrentVxMineInfo, getCurrentPledgeForVxSum, getAgentMiningPledgeInfo } from 'services/viteServer';

import viteIcon from 'assets/imgs/vite-dividend.svg';
import ethIcon from 'assets/imgs/eth.svg';
import usdIcon from 'assets/imgs/usd.svg';
import btcIcon from 'assets/imgs/BTC.svg';

const Vite_Token_Info = constant.Vite_Token_Info;
const VX_Decimals = 18;
const typeList = {
    1: {
        tokenSymbol: 'VITE',
        decimals: 18
    },
    2: {
        tokenSymbol: 'ETH',
        decimals: 18
    },
    3: {
        tokenSymbol: 'BTC',
        decimals: 8
    },
    4: {
        tokenSymbol: 'USDT',
        decimals: 6
    }
};

const state = {
    currUserFees: null,
    currentFees: null,
    userPledgeInfo: null,
    currPledge: 0,

    minThreshold: {},
    currVxMineInfo: null,
    showTypeList: [ {
        name: 'VITE',
        icon: viteIcon
    }, {
        name: 'BTC',
        icon: btcIcon
    }, {
        name: 'ETH',
        icon: ethIcon
    }, {
        name: 'USDT',
        icon: usdIcon
    } ]
};

const mutations = {
    setCurrentFeesForMine(state, data) {
        state.currentFees = data || null;
    },
    setMinThresholdForTradeAndMining(state, data) {
        state.minThreshold = data || {};
    },
    setCurrUserFees(state, data) {
        state.currUserFees = data || null;
    },
    setCurrentVxMineInfo(state, data) {
        state.currVxMineInfo = data || null;
    },
    setCurrentPledgeForVxSum(state, data) {
        state.currPledge = data || 0;
    },
    setAgentMiningPledgeInfo(state, data) {
        state.userPledgeInfo = data || null;
    }
};

const actions = {
    getCurrentFeesForMine({ commit }) {
        getCurrentFeesForMine().then(data => {
            commit('setCurrentFeesForMine', data);
        }).catch(err => {
            console.warn(err);
        });
    },
    getMinThresholdForTradeAndMining({ commit }) {
        getMinThresholdForTradeAndMining().then(data => {
            commit('setMinThresholdForTradeAndMining', data);
        }).catch(err => {
            console.warn(err);
        });
    },
    getAllFeesOfAddress({ commit, rootGetters }) {
        const address = rootGetters.activeAddr;

        getAllFeesOfAddress(address).then(data => {
            if (address !== rootGetters.activeAddr) {
                return;
            }
            if (!data || !data.fees || !data.fees.length) {
                return;
            }

            let currUserFees = null;
            let currPeriod = null;
            data.fees.forEach(({ userFees, period }) => {
                if (!currPeriod || bigNumber.compared(currPeriod, period) < 0) {
                    currUserFees = userFees;
                    currPeriod = period;
                }
            });

            commit('setCurrUserFees', currUserFees);
        }).catch(err => {
            console.warn(err);
        });
    },
    getCurrentVxMineInfo({ commit }) {
        getCurrentVxMineInfo().then(data => {
            commit('setCurrentVxMineInfo', data);
        }).catch(err => {
            console.warn(err);
        });
    },
    getCurrentPledgeForVxSum({ commit }) {
        getCurrentPledgeForVxSum().then(data => {
            commit('setCurrentPledgeForVxSum', data);
        }).catch(err => {
            console.warn(err);
        });
    },
    getAgentMiningPledgeInfo({ commit, rootGetters }) {
        const address = rootGetters.activeAddr;
        return getAgentMiningPledgeInfo(address).then(data => {
            if (address !== rootGetters.activeAddr) {
                return;
            }
            commit('setAgentMiningPledgeInfo', data);
        });
    }
};

const getters = {
    tradeTotalDividend() {
        if (!state.currVxMineInfo) {
            return null;
        }
        return state.currVxMineInfo.feeMineDetail || null;
    },
    pledgeTotalDividend() {
        if (!state.currVxMineInfo) {
            return '0';
        }
        return state.currVxMineInfo.pledgeMine || '0';
    },
    tradeDividends(state, getters) {
        if (!state.currentFees || !getters.tradeTotalDividend || !state.currUserFees || !state.currUserFees.length) {
            return null;
        }

        const dividends = {};
        state.currUserFees.forEach(fee => {
            const quoteType = fee.quoteTokenType;
            const symbol = typeList[quoteType].tokenSymbol;
            const decimals = typeList[quoteType].decimals;

            const currFee = state.currentFees[quoteType] || 0;
            const currDividens = getters.tradeTotalDividend[quoteType] || 0;

            const percent = +currFee ? bigNumber.dividedToNumber(fee.baseAmount, currFee, 8) : 0;
            let dividend = 0;

            const mineAmount = bigNumber.plus(fee.baseAmount, fee.inviteBonusAmount);
            const mineThreshold = state.minThreshold && state.minThreshold[quoteType]
                ? state.minThreshold[quoteType].mineThreshold || 0
                : 0;
            if (bigNumber.compared(mineAmount, mineThreshold) >= 0) {
                dividend = bigNumber.multi(currDividens, percent);
            }

            dividends[symbol] = {
                fee: bigNumber.toBasic(fee.baseAmount, decimals),
                dividend: bigNumber.toBasic(dividend, VX_Decimals)
            };
        });

        return dividends;
    },
    stakingDividends(state, getters) {
        if (!state.userPledgeInfo || !+state.userPledgeInfo.amount) {
            return '0';
        }

        const percent = +state.currPledge
            ? bigNumber.dividedToNumber(state.userPledgeInfo.amount, state.currPledge, 8)
            : 0;
        const dividends = bigNumber.multi(getters.pledgeTotalDividend, percent, 8);
        return bigNumber.toBasic(dividends, Vite_Token_Info.decimals, 8);
    }
};


export default {
    state,
    mutations,
    actions,
    getters
};
