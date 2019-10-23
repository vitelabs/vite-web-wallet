import { bridge } from 'h5Utils/bridge';

const state = { bridgeVersion: -1 };

const mutations = {
    setBridgeVersion(state, code) {
        state.bridgeVersion = code;
    }
};

const actions = {
    setBridgeVersion({ commit }) {
        bridge['bridge.version']().then(({ versionCode }) => {
            console.log('bridge.version', versionCode);
            commit('setBridgeVersion', versionCode);
        }).catch(err => {
            console.warn(err);
        });
    }
};

const getters = {
    bridgeUnsupportList(state) {
        if (state.bridgeVersion < 4) {
            return [ 'pri.transferAsset', 'pri.getAllFavPairs', 'pri.addFavPair', 'pri.deleteFavPair', 'pri.switchPair' ];
        }
        return [];
    }
};

export default { state, getters, mutations, actions };
