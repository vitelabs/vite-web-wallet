import $ViteJS from 'utils/viteClient';
import { timer } from 'utils/asyncFlow';

const baseFee = process.env.NODE_ENV === 'dexTestNet' ? 0.0025 : 0.002;
let vipTimer = null;
let nextVip = null;

const state = {
    isVip: false,
    baseFee,
    marketInfo: {}
};

const mutations = {
    setExchangeVip(state, isVip) {
        state.isVip = isVip;
    },
    setExchangeMarketInfo(state, marketInfo) {
        state.marketInfo = Object.assign({}, marketInfo);
    }
};

const actions = {
    exFetchVip({ commit, getters }) {
        commit('setExchangeVip', false);

        const address = getters.activeAddr;
        address && $ViteJS.request('dexfund_isPledgeVip', address).then(data => {
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

        _activeTxPair && $ViteJS.request('dexfund_getMarketInfo', _activeTxPair.tradeToken, _activeTxPair.quoteToken).then(data => {
            if (_activeTxPair.symbol !== getters.exActiveTxPair.symbol) {
                return;
            }
            console.log(data);

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
    exFee(state) {
        const vipFee = getVipFee(state.isVip);
        // const takerBrokerFee = state.marketInfo.takerBrokerFee;
        // const makerBrokerFeeRate = state.marketInfo.makerBrokerFeeRate;
        // console.log(state.marketInfo);
        return baseFee - vipFee;
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

function stopLoopVip() {
    vipTimer && vipTimer.stop();
    vipTimer = null;
}
