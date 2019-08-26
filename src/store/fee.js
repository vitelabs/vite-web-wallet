import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import { getInviteeCode, isPledgeVip, getMarketInfo } from 'services/viteServer';
import { getSvipStatus } from 'pcServices/tradeOperation';

const baseMakerFee = 0.002;
const baseTakerFee = 0.002;

let vipTimer = null;
let nextVip = null;

const state = {
    isVip: false,
    baseMakerFee,
    baseTakerFee,
    marketInfo: {},
    invitedCode: ''
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
                commit('setInviteCode', '-1');
                rej(e);
            });
        });
    },
    exFetchSVip({ commit, getters }) {
        const address = getters.activeAddr;
        address && getSvipStatus(address).then(data => {
            if (address !== getters.activeAddr) {
                return;
            }
            commit('setExchangeSVip', data);
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
        return getVipFee(state.isVip);
    },
    operatorMakerFee(state) {
        return getOperatorFee(state.marketInfo.makerBrokerFeeRate);
    },
    operatorTakerFee(state) {
        return getOperatorFee(state.marketInfo.takerBrokerFeeRate);
    },
    exMakerFee(state, getters) {
        const vipFee = getVipFee(state.isVip);
        const operatorMakerFee = getOperatorFee(state.marketInfo.makerBrokerFeeRate);
        return (baseMakerFee + Number(operatorMakerFee) - vipFee) * (1 - getters.inviteFeeDiscount);
    },
    exTakerFee(state, getters) {
        const vipFee = getVipFee(state.isVip);
        const operatorTakerFee = getOperatorFee(state.marketInfo.takerBrokerFeeRate);
        return (baseTakerFee + Number(operatorTakerFee) - vipFee) * (1 - getters.inviteFeeDiscount);
    },
    inviteFeeDiscount(state) {
        if (state.invitedCode) {
            return 0.1;
        }
        return 0;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};


function getVipFee(isVip) {
    return isVip ? 0.001 : 0;
}

function getOperatorFee(fee) {
    return BigNumber.dividedToNumber(fee || 0, 100000, 5);
}

function stopLoopVip() {
    vipTimer && vipTimer.stop();
    vipTimer = null;
}
