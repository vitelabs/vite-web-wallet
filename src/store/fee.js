import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import { getInviteeCode, isPledgeVip, getMarketInfo, getSvipStatus } from 'services/viteServer';

const baseMakerFee = 0.002;
const baseTakerFee = 0.002;

let vipTimer = null;
let nextVip = null;

const state = {
    isVip: false,
    baseMakerFee,
    baseTakerFee,
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
    vipFee(state) {
        return state.isVip ? 0.001 : 0;
    },
    svipFee(state) {
        return state.isSVip ? 0.001 : 0;
    },
    operatorMakerFee(state) {
        return getOperatorFee(state.marketInfo.makerBrokerFeeRate);
    },
    operatorTakerFee(state) {
        return getOperatorFee(state.marketInfo.takerBrokerFeeRate);
    },
    inviteFeeDiscount(state) {
        if (state.invitedCode > 0) {
            return 0.1;
        }
        return 0;
    },
    exMakerFee(state, getters) {
        const _baseMakerFee = state.isSVip ? 0 : baseMakerFee;
        return getFee(_baseMakerFee, getters.operatorMakerFee, getters.vipFee, getters.inviteFeeDiscount);
    },
    exTakerFee(state, getters) {
        const _baseTakerFee = state.isSVip ? 0 : baseTakerFee;
        return getFee(_baseTakerFee, getters.operatorTakerFee, getters.vipFee, getters.inviteFeeDiscount);
    },
    exBuyOrderFee(state, getters) {
        if (BigNumber.compared(getters.exMakerFee, getters.exTakerFee) > 0) {
            return getters.exMakerFee;
        }
        return getters.exTakerFee;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};


function getFee(baseFee, operatorFee, vipFee, inviteFeeDiscount) {
    const allFee = baseFee + Number(operatorFee) - vipFee;
    const discount = 1 - inviteFeeDiscount;
    return BigNumber.multi(allFee, discount);
}

function getOperatorFee(fee) {
    return BigNumber.dividedToNumber(fee || 0, 100000, 5);
}

function stopLoopVip() {
    vipTimer && vipTimer.stop();
    vipTimer = null;
}
