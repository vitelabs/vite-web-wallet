import { baseToken } from 'services/trade';
import getQuery from 'utils/query';

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
    updateMarketMap({ commit, state }) {
        baseToken().then(data => {
            commit('setMarketMap', data || []);
            const marketMap = state.marketMap;
            const firstMarket = marketMap[0] ? marketMap[0].token : '';
            const query = getQuery();

            if (!query.ttoken) {
                commit('setCurrentMarket', firstMarket);
                return;
            }

            let i;
            for (i = 0; i < marketMap.length; i++) {
                if (marketMap[i].token === query.ttoken) {
                    break;
                }
            }

            if (i >= marketMap.length) {
                commit('setCurrentMarket', firstMarket);
                return;
            }

            commit('setCurrentMarket', marketMap[i].token);
        });
    }
};

const getters = {
    currentMarketName(state) {
        const token = state.marketMap.filter(n => n.token === state.currentMarket)[0] || {};
        return token.name || '';
    }
};

export default { state, mutations, actions, getters };
