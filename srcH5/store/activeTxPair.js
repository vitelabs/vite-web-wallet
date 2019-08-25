import BigNumber from 'utils/bigNumber';
import { assignPair } from 'services/trade';

const state = { activeTxPair: null };

const mutations = {
    exSetActiveTxPair(state, txPair) {
        const old = state.activeTxPair;
        let isChange = !old;
        for (const key in old) {
            if (txPair[key] !== old[key]) {
                isChange = true;
                break;
            }
        }
        isChange && (state.activeTxPair = Object.assign({}, txPair));
    }
};

const actions = {
    dexFetchActiveTxPair({ state, dispatch, commit }, txPair) {
        if (!txPair) {
            return;
        }

        const activeTxPair = state.activeTxPair;
        if (activeTxPair && activeTxPair.symbol === txPair.symbol) {
            return;
        }

        assignPair({ symbols: [txPair.symbol] }).then(data => {
            if (!data || !data.length) {
                return;
            }

            commit('exSetActiveTxPair', data[0]);

            dispatch('exFetchActiveTokens');
            dispatch('exFetchDepth');
            dispatch('exFetchMarketInfo');
        }).catch(err => {
            console.warn(err);
        });
    }
};

const getters = {
    exActiveTxPair(state) {
        if (!state.activeTxPair) {
            return null;
        }

        const activeTxPair = Object.assign({}, state.activeTxPair);

        const upDown = BigNumber.minus(activeTxPair.closePrice || 0, activeTxPair.openPrice || 0);
        const upDownPrev = BigNumber.minus(activeTxPair.closePrice || 0, activeTxPair.prevClosePrice || 0);

        activeTxPair.upDown = upDown;
        activeTxPair.upDownPrev = +upDownPrev ? upDownPrev : '0';
        activeTxPair.upDownPercent = activeTxPair.priceChangePercent ? `${ BigNumber.multi(activeTxPair.priceChangePercent, 100, 2) }%` : '';
        activeTxPair.originQuoteTokenSymbol = activeTxPair.quoteTokenSymbol.split('-')[0] || '';
        activeTxPair.originTradeTokenSymbol = activeTxPair.tradeTokenSymbol.split('-')[0] || '';

        return activeTxPair;
    },
    activeTxPairRealClosePrice(state, getters, rootState, rootGetters) {
        const pre = rootGetters.currencySymbol;
        if (!state.activeTxPair) {
            return `${ pre }0`;
        }

        const _price = BigNumber.multi(state.activeTxPair.closePrice || 0, getters.activeTxPairQuoteCurrencyRate, 6);
        const _realPrice = BigNumber.normalFormatNum(_price, 6);
        const _realPrice2 = BigNumber.normalFormatNum(_realPrice, 2);

        if (+_realPrice2 !== 0) {
            return pre + BigNumber.onlyFormat(_realPrice2, 2);
        }
        return pre + BigNumber.onlyFormat(_realPrice, 2);
    },
    activeTxPairQuoteCurrencyRate(state, getters, rootState, rootGetters) {
        const tokenId = state.activeTxPair && state.activeTxPair.quoteToken ? state.activeTxPair.quoteToken : null;
        if (!tokenId) {
            return 0;
        }
        return rootGetters.currencyRateList[tokenId] || 0;
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
