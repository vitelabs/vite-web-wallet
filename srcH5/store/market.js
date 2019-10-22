import { marketsClosed } from 'services/trade';
import env from 'h5Utils/envFromURL';

const state = {
    currentSymbol: env.symbol,
    marketClosed: []
};

const mutations = {
    setMarketClosed(state, marketClosed) {
        state.marketClosed = marketClosed;
    },
    switchTradePair(state, { symbol }) {
        state.currentSymbol = symbol;
    }
};

const actions = {
    getMarketsClosed({ commit }) {
        marketsClosed().then(data => {
            commit('setMarketClosed', data || []);
        });
    }
};

export default { state, mutations, actions };
