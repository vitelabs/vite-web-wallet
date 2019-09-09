import { marketsClosed } from 'services/trade';
import env from 'h5Utils/envFromURL';

const state = {
    // DefaultSymbol: symbol,
    currentSymbol: env.symbol,
    curentCategory: env.category,
    marketClosed: []
};

const mutations = {
    setMarketClosed(state, marketClosed) {
        state.marketClosed = marketClosed;
    }
    // setCurentCategory(state, category) {
    //     state.curentCategory = category;
    // },
    // switchTradePair(state, { category, symbol }) {
    //     if (!category || quoteTokenCategory.indexOf(category) === -1) {
    //         return;
    //     }

    //     state.curentCategory = category;
    //     state.DefaultSymbol = symbol;
    // }
};

const actions = {
    getMarketsClosed({ commit }) {
        marketsClosed().then(data => {
            commit('setMarketClosed', data || []);
        });
    }
};

export default { state, mutations, actions };
