import { getGateInfos } from 'services/gate';

const state = { gateInfos: [] };


const mutations = {
    setGateInfos(state, payload) {
        state.gateInfos = payload || [];
    }
};

const actions = {
    updateGateInfos({ commit }) {
        getGateInfos('/gateWay').then(infos =>
            commit('setGateInfos', infos));
    }
};

const getters = {
    mapToken2Gate(state) {
        const map = {};
        state.gateInfos.map(g => g.tokens).reduce(function (pre, cur) {
            return [ ...pre, ...(cur || []) ];
        }, []).forEach(n => {
            map[n.tokenId] = n;
        });
        return map;
    },
    mapGate2Token() {
        const map = {};
        state.gateInfos.forEach(g => (map[g.name] = g));
        return map;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
