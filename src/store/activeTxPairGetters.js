import BigNumber from 'utils/bigNumber';

const maxDigit = 8;

const getters = {
    exActiveTxPair(state, getters, rootState) {
        const _activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!_activeTxPair) {
            return null;
        }

        const activeTxPair = Object.assign({}, _activeTxPair);

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
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return `${ pre }0`;
        }

        const _price = BigNumber.multi(activeTxPair.closePrice || 0, rootGetters.activeTxPairQuoteCurrencyRate, 6);
        const _realPrice = BigNumber.normalFormatNum(_price, 6);
        const _realPrice2 = BigNumber.normalFormatNum(_realPrice, 2);

        if (+_realPrice2 !== 0) {
            return pre + BigNumber.onlyFormat(_realPrice2, 2);
        }
        return pre + BigNumber.onlyFormat(_realPrice, 2);
    },
    activeTxPairQuoteCurrencyRate(state, getters, rootState, rootGetters) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        const tokenId = activeTxPair && activeTxPair.quoteToken ? activeTxPair.quoteToken : null;
        if (!tokenId) {
            return 0;
        }
        return rootGetters.currencyRateList[tokenId] || 0;
    },
    quoteTokenDecimalsLimit(state, getters, rootState) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        const quoteTokenDetail = rootState.exchangeTokens.ttoken;

        if (!activeTxPair) {
            return 0;
        }

        if (!quoteTokenDetail) {
            const pricePrecision = activeTxPair.pricePrecision;
            return pricePrecision > maxDigit ? maxDigit : pricePrecision;
        }

        return getMinDecimals(quoteTokenDetail.tokenDecimals, activeTxPair.pricePrecision);
    },
    tradeTokenDecimalsLimit(state, getters, rootState) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        const tradeTokenDetail = rootState.exchangeTokens.ftoken;

        if (!activeTxPair) {
            return 0;
        }

        if (!tradeTokenDetail) {
            const quantityPrecision = activeTxPair.quantityPrecision;
            return quantityPrecision > maxDigit ? maxDigit : quantityPrecision;
        }

        return getMinDecimals(tradeTokenDetail.tokenDecimals, activeTxPair.quantityPrecision);
    },
    activeTxPairSellOnePrice(state, getters, rootState) {
        const sell = rootState.exchangeDepth.sell;
        if (!sell || !sell.length) {
            return '';
        }
        return sell[sell.length - 1].price;
    },
    activeTxPairIsMining(state, getters, rootState) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return false;
        }

        const miningSymbols = rootState.exchangeMine.miningSymbols;
        return miningSymbols.indexOf(activeTxPair.symbol) !== -1;
    },
    activeTxPairMiningPrice(state, getters, rootState) {
        // No activeTxPair
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return '';
        }

        // No orderMining
        const orderMiningSymbols = rootState.exchangeMine.orderMiningSymbols;
        if (orderMiningSymbols.indexOf(activeTxPair.symbol) === -1) {
            return '';
        }

        // No sellOnePrice
        const sellOne = getters.activeTxPairSellOnePrice;
        if (!sellOne) {
            return '';
        }

        const price = BigNumber.multi(sellOne, 0.9);
        return BigNumber.onlyFormat(price);
    }
};

export default { getters };


function getMinDecimals(tokenDecimals, pairDecimals) {
    const digit = tokenDecimals > pairDecimals ? pairDecimals : tokenDecimals;
    return digit > maxDigit ? maxDigit : digit;
}
