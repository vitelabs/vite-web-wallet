import { baseToken, marketsClosed } from 'services/trade';
import getQuery from 'utils/query';

const state = {
    isShowFavorite: false,
    currentMarket: '',
    marketMap: [],
    marketClosed: []
};

const mutations = {
    setIsShowFavorite(state, isShow) {
        state.isShowFavorite = isShow;
    },
    setCurrentMarket(state, tokenId) {
        state.currentMarket = tokenId;
    },
    setMarketMap(state, marketMap) {
        state.marketMap = marketMap;
    },
    setMarketClosed(state, marketClosed) {
        state.marketClosed = marketClosed;
    }
};

const actions = {
    updateMarketMap({ commit, dispatch, state }) {
        baseToken().then(data => {
            commit('setMarketMap', data || []);

            const marketMap = state.marketMap;
            const firstMarket = marketMap[0] ? marketMap[0].symbol : '';

            const tokenIds = [];
            marketMap.forEach(({ tokenId }) => {
                tokenIds.push(tokenId);
            });
            dispatch('addRateTokens', tokenIds);

            const query = getQuery();
            const queryArr = query.symbol ? query.symbol.split('_') : [];
            const queryQuoteTokenSymbol = queryArr[1] || '';

            if (!queryQuoteTokenSymbol) {
                commit('setCurrentMarket', firstMarket);
                return;
            }

            let i;
            for (i = 0; i < marketMap.length; i++) {
                if (marketMap[i].symbol === queryQuoteTokenSymbol) {
                    break;
                }
            }

            if (i >= marketMap.length) {
                commit('setCurrentMarket', firstMarket);
                return;
            }

            commit('setCurrentMarket', marketMap[i].symbol);
        });
    },
    getMarketsClosed({ commit }) {
        marketsClosed().then(data => {
            commit('setMarketClosed', data || []);
        });
    }
};

export default { state, mutations, actions };
