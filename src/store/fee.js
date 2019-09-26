import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import { getInviteeCode, isPledgeVip, getMarketInfo, getSvipStatus } from 'services/viteServer';

const baseMakerFee = 0.002;
const baseTakerFee = 0.002;

let vipTimer = null;
let nextVip = null;

const state = {
    isVip: false,
    marketInfo: {},
    invitedCode: '',
    isSVip: false
};

const mutations = {
    setExchangeVip(state, isVip) {
        state.isVip = isVip;
    },
    setExchangeMarketInfo(state, marketInfo) {
        state.marketInfo = marketInfo;
    },
    setInviteCode(state, payload = '') {
        state.invitedCode = payload;
    },
    setExchangeSVip(state, isSVip) {
        state.isSVip = isSVip;
    }
};

const actions = {
    getInvitedCode({ commit, getters }) {
        return new Promise((res, rej) => {
            if (!getters.activeAddr) {
                commit('setInviteCode');
                return rej('no address');
            }
            getInviteeCode(getters.activeAddr).then(code => {
                commit('setInviteCode', code);
                res(code);
            }).catch(e => {
                commit('setInviteCode', 0);
                rej(e);
            });
        });
    },
    exFetchSVip({ commit, getters }) {
        new Promise((res, rej) => {
            const address = getters.activeAddr;
            address && getSvipStatus(address).then(data => {
                if (address !== getters.activeAddr) {
                    return;
                }
                commit('setExchangeSVip', data);
                res(data);
            }).catch(e => rej(e));
        });
    },
    exFetchVip({ commit, getters }) {
        const address = getters.activeAddr;
        address && isPledgeVip(address).then(data => {
            if (address !== getters.activeAddr) {
                return;
            }
            commit('setExchangeVip', data);
            if (vipTimer && data === nextVip) {
                nextVip = null;
                stopLoopVip();
            }
        });
    },
    exFetchMarketInfo({ commit, getters }) {
        commit('setExchangeMarketInfo', {});
        const _activeTxPair = getters.exActiveTxPair;

        _activeTxPair && getMarketInfo(_activeTxPair.tradeToken, _activeTxPair.quoteToken).then(data => {
            if (_activeTxPair.symbol !== getters.exActiveTxPair.symbol) {
                return;
            }
            commit('setExchangeMarketInfo', data);
        });
    },
    startLoopVip({ dispatch }, nextVipStatus) {
        stopLoopVip();
        vipTimer = new timer(() => {
            dispatch('exFetchVip');
        }, 2000);
        vipTimer.start();
        nextVip = nextVipStatus;
    }
};

const getters = {
    baseTakerFee(state) {
        return state.isSVip ? 0 : baseTakerFee;
    },
    baseMakerFee() {
        return state.isSVip ? 0 : baseMakerFee;
    },
    vipFee(state) {
        return state.isVip ? 0.001 : 0;
    },
    operatorMakerFee(state) {
        return getOperatorFee(state.marketInfo.makerBrokerFeeRate);
    },
    operatorTakerFee(state) {
        return getOperatorFee(state.marketInfo.takerBrokerFeeRate);
    },
    inviteFeeDiscount(state) {
        if (Number(state.invitedCode) > 0) {
            return 0.1;
        }
        return 0;
    },
    exMakerFee(state, getters) {
        return getFee(getters.baseMakerFee, getters.operatorMakerFee, getters.vipFee, getters.inviteFeeDiscount);
    },
    exTakerFee(state, getters) {
        return getFee(getters.baseTakerFee, getters.operatorTakerFee, getters.vipFee, getters.inviteFeeDiscount);
    },
    exBuyOrderFee(state, getters) {
        if (BigNumber.compared(getters.exMakerFee, getters.exTakerFee) > 0) {
            return getters.exMakerFee;
        }
        return getters.exTakerFee;
    },
    exIsMining(state) {
        const marketInfo = state.marketInfo;
        return marketInfo && marketInfo.allowMine;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};


// (baseFee + operatorFee - vipFee) * (1 - inviteFeeDiscount)
function getFee(baseFee, operatorFee, vipFee, inviteFeeDiscount) {
    const preFee = baseFee - vipFee > 0 ? baseFee - vipFee : 0;
    const allFee = preFee + operatorFee;
    const discount = 1 - inviteFeeDiscount;
    const fee = BigNumber.multi(allFee, discount);
    return Number(fee);
}

function getOperatorFee(fee) {
    const operatorFee = BigNumber.dividedToNumber(fee || 0, 100000, 5);
    return Number(operatorFee);
}

function stopLoopVip() {
    vipTimer && vipTimer.stop();
    vipTimer = null;
}
