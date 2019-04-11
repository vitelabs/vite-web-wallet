import { baseToken } from 'services/trade';

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
            const currentMarket = state.marketMap;
            commit('setCurrentMarket', currentMarket[0] ? currentMarket[0].token : '');
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
