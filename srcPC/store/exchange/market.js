import { baseToken, marketsClosed } from 'services/trade';
import getQuery from 'utils/query';

const quoteTokenCategory = [ 'BTC', 'ETH', 'VITE', 'USDT' ];
const categoryTransLimit = { 'BTC': 3, 'ETH': 2, 'VITE': 1, 'USDT': 1 };

const query = getQuery();
const symbol = query.symbol;
const DefaultSymbol = symbol || 'VITE_BTC-000';

let DefaultCategory = 'BTC';
try {
    const quoteToken = DefaultSymbol.split('_')[1];
    const category = quoteToken.split('-')[0];
    DefaultCategory = category && quoteTokenCategory.indexOf(category) !== -1 ? category : 'BTC';
} catch (err) {
    console.warn(err);
}

const state = {
    quoteTokenCategory,
    curentCategory: DefaultCategory,
    DefaultSymbol,
    isShowFavorite: false,
    marketMap: [],
    marketClosed: []
};

const mutations = {
    setIsShowFavorite(state, isShow) {
        state.isShowFavorite = isShow;
    },
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

const getters = {
    exCategoryTransLimit(state) {
        if (state.isShowFavorite) {
            return 3;
        }
        return categoryTransLimit[state.curentCategory];
    }
};

export default { state, mutations, actions, getters };
