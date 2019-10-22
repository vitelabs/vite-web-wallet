import { bridge } from 'h5Utils/bridge';

const state = {
    favoriteList: [],
    canFavorite: false
};

const mutations = {
    initFavoriteList(state, { list, canFavorite }) {
        state.favoriteList = list || [];
        state.canFavorite = canFavorite;
    },
    exSetFavorite(state, symbol) {
        state.favoriteList.push(symbol);
    },
    exDeletetFavorite(state, symbol) {
        const i = state.favoriteList.indexOf(symbol);
        if (i < 0) {
            return;
        }
        state.favoriteList.splice(i, 1);
    }
};

const actions = {
    initFavorite({ commit }) {
        bridge['pri.getAllFavPairs']().then(list => {
            console.log('pri.getAllFavPairs', list);
            commit('initFavoriteList', {
                list,
                canFavorite: true
            });
        }).catch(err => {
            console.warn(err);
            commit('initFavoriteList', {
                list: [],
                canFavorite: false
            });
        });
    },
    exSetFavorite({ commit }, symbol) {
        return bridge['pri.addFavPair']({ symbol }).then(data => {
            console.log('pri.addFavPair', data);
            commit('exSetFavorite', symbol);
        });
    },
    exDeletetFavorite({ commit }, symbol) {
        return bridge['pri.deleteFavPair']({ symbol }).then(data => {
            console.log('pri.deleteFavPair', data);
            commit('exDeletetFavorite', symbol);
        });
    }
};

export default {
    state,
    mutations,
    actions
};
