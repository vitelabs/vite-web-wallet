import { baseToken, marketsClosed } from 'services/trade';
import getQuery from 'utils/query';

const quoteTokenCategory = [ 'BTC', 'ETH', 'VITE', 'USDT' ];

const query = getQuery();
const category = query.category;
const symbol = query.symbol;
const DefaultCategory = category && quoteTokenCategory.indexOf(category) !== -1 ? category : 'BTC';
const DefaultSymbol = symbol || 'VITE_BTC-000';

const state = {
    quoteTokenCategory,
    curentCategory: DefaultCategory,
    DefaultSymbol,
    marketMap: [],
    marketClosed: []
};

const mutations = {
    setCurentCategory(state, category) {
        state.curentCategory = category;
    },
    setMarketMap(state, marketMap) {
        state.marketMap = marketMap;
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
    },
    clearDefaultSymbol(state) {
        state.DefaultSymbol = null;
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
        dispatch('h5DexFetchActiveTxPair', txPair);
    },
    updateMarketMap({ commit, dispatch }) {
        // Add quote token
        baseToken().then(data => {
            const marketMap = data || [];
            commit('setMarketMap', marketMap);

            const tokenIds = [];
            marketMap.forEach(({ tokenId }) => {
                tokenIds.push(tokenId);
            });
            dispatch('addRateTokens', tokenIds);
        });
    },
    getMarketsClosed({ commit }) {
        marketsClosed().then(data => {
            commit('setMarketClosed', data || []);
        });
    }
};

export default { state, mutations, actions };
