import { marketsClosed } from 'services/trade';
import getQuery from 'utils/query';

const quoteTokenCategory = [ 'BTC', 'ETH', 'VITE', 'USDT' ];

const query = getQuery();
const category = query.category;
const symbol = query.symbol;
const DefaultCategory = category && quoteTokenCategory.indexOf(category) !== -1 ? category : 'BTC';
// const DefaultSymbol = symbol || 'VITE_BTC-000';
const DefaultSymbol = symbol || 'GRIN-000_BTC-000';

const state = {
    curentCategory: DefaultCategory,
    DefaultSymbol,
    marketClosed: []
};

const mutations = {
    setCurentCategory(state, category) {
        state.curentCategory = category;
    },
    setMarketClosed(state, marketClosed) {
        state.marketClosed = marketClosed;
    },
    switchTradePair(state, { category, symbol }) {
        if (!category || quoteTokenCategory.indexOf(category) === -1) {
            return;
        }

        state.curentCategory = category;
        state.DefaultSymbol = symbol;
    }
};

const actions = {
    init({ dispatch }) {
        let txPair = {};
        for (const key in query) {
            if (key === 'address') {
                continue;
            }
            txPair[key] = query[key];
        }

        if (!txPair.symbol) {
            txPair = { symbol: DefaultSymbol };
        }
        dispatch('dexFetchActiveTxPair', txPair);
    },
    getMarketsClosed({ commit }) {
        marketsClosed().then(data => {
            commit('setMarketClosed', data || []);
        });
    }
};

export default { state, mutations, actions };
