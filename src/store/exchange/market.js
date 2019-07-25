import { baseToken, marketsClosed } from 'services/trade';
import getQuery from 'utils/query';

const quoteTokenCategory = [ 'BTC', 'ETH', 'VITE', 'USDT' ];

const query = getQuery();
const category = query.category;
const DetaultCategory = category && quoteTokenCategory.indexOf(category) !== -1 ? category : 'VITE';

const state = {
    quoteTokenCategory,
    curentCategory: DetaultCategory,
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

export default { state, mutations, actions };
