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
    quoteTokenStepLimit(state, getters, rootState) {
        return 1 / Math.pow(10, getters.quoteTokenDecimalsLimit);
    },
    tradeTokenStepLimit(state, getters, rootState) {
        return 1 / Math.pow(10, getters.tradeTokenDecimalsLimit);
    },
    activeTxPairBuyOnePrice(state, getters, rootState) {
        const buy = rootState.exchangeDepth.buy;
        if (!buy || !buy.length) {
            return '';
        }
        return buy[0].price || '';
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
            return 0;
        }

        const tradeMiningSymbols = rootState.exchangeMine.tradeMiningSymbols;
        const orderMiningSymbols = rootState.exchangeMine.orderMiningSymbols;

        const isTradeMining = tradeMiningSymbols.indexOf(activeTxPair.symbol) === -1 ? 0 : 1;
        const isOrderMining = orderMiningSymbols.indexOf(activeTxPair.symbol) === -1 ? 0 : 2;
        return isOrderMining + isTradeMining;
    },
    activeTxPairOrderMiningMultiples(state, getters, rootState) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return '';
        }
        const orderMiningMultiples = rootState.exchangeMine.orderMiningMultiples;
        const mul = orderMiningMultiples[activeTxPair.symbol];
        return mul ? `X${ mul }` : '';
    },
    activeTxPairBuyMiningPrice(state, getters, rootState) {
        // No activeTxPair
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return '';
        }

        // No orderMining
        if (getters.activeTxPairIsMining < 2) {
            return '';
        }

        // No sellOnePrice
        const sellOne = getters.activeTxPairSellOnePrice;
        if (!sellOne) {
            return '';
        }

        const symbol = activeTxPair.symbol;
        const orderMiningSettings = rootState.exchangeMine.orderMiningSettings;

        // No orderMiningSetting
        if (!orderMiningSettings || !orderMiningSettings[symbol]) {
            return '';
        }

        const percent = BigNumber.minus(1, orderMiningSettings[symbol].buyRangeMax);
        return BigNumber.multi(sellOne, percent);
    },
    showActiveTxPairBuyMiningPrice(state, getters) {
        if (!getters.activeTxPairBuyMiningPrice) {
            return '';
        }
        return BigNumber.onlyFormat(getters.activeTxPairBuyMiningPrice);
    },
    activeTxPairSellMiningPrice(state, getters, rootState) {
        // No activeTxPair
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return '';
        }

        // No orderMining
        if (getters.activeTxPairIsMining < 2) {
            return '';
        }

        // No buyOnePrice
        const buyOne = getters.activeTxPairBuyOnePrice;
        if (!buyOne) {
            return '';
        }

        const symbol = activeTxPair.symbol;
        const orderMiningSettings = rootState.exchangeMine.orderMiningSettings;

        // No orderMiningSetting
        if (!orderMiningSettings || !orderMiningSettings[symbol]) {
            return '';
        }

        const percent = BigNumber.plus(1, orderMiningSettings[symbol].sellRangeMax);
        return BigNumber.multi(buyOne, percent);
    },
    showActiveTxPairSellMiningPrice(state, getters) {
        if (!getters.activeTxPairSellMiningPrice) {
            return '';
        }
        return BigNumber.onlyFormat(getters.activeTxPairSellMiningPrice);
    },
    activeTxPairIsCMC(state, getters, rootState) {
        const activeTxPair = rootState.exchangeActiveTxPair.activeTxPair;
        if (!activeTxPair) {
            return null;
        }

        const CMCTxPairs = [
            'VITE_USDT-000', 'ETH-000_BTC-000', 'GRIN-000_VITE', 'VITE_ETH-000',
            'GRIN-000_BTC-000', 'GRIN-000_ETH-000', 'VITE_BTC-000',
            'ETH-000_USDT-000', 'BTC-000_USDT-000', 'BIS-000_BTC-000',
            'DERO-000_BTC-000', 'ERG-000_BTC-000', 'BEAM-000_BTC-000',
            'TRTL-000_ETH-000', 'TERA-000_BTC-000', 'ANKR-000_BTC-000',
            'PASC-000_BTC-000', 'PASC-000_ETH-000', 'PASC-000_USDT-000'
        ];
        return CMCTxPairs.indexOf(activeTxPair.symbol) !== -1;
    }
};

export default { getters };


function getMinDecimals(tokenDecimals, pairDecimals) {
    const digit = tokenDecimals > pairDecimals ? pairDecimals : tokenDecimals;
    return digit > maxDigit ? maxDigit : digit;
}
