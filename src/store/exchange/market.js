import { baseToken } from 'services/trade';
import getQuery from 'utils/query';

// [TODO] txPairList

const state = {
    isShowFavorite: false,
    currentMarket: '',
    marketMap: []
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

            if (!query.symbol || !query.tradeTokenSymbol || !query.quoteTokenSymbol) {
                commit('setCurrentMarket', firstMarket);
                return;
            }

            let i;
            for (i = 0; i < marketMap.length; i++) {
                if (marketMap[i].symbol === query.quoteTokenSymbol) {
                    break;
                }
            }

            if (i >= marketMap.length) {
                commit('setCurrentMarket', firstMarket);
                return;
            }

            commit('setCurrentMarket', marketMap[i].symbol);
        });
    }
};

export default { state, mutations, actions };
