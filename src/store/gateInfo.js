import { getGateInfos } from 'services/gate';

const OFFICAL_GATE_NAME = 'Vite Official Gateway';

const state = { gateInfos: [] };

const mutations = {
    setGateInfos(state, payload) {
        state.gateInfos = payload || [];
    }
};

const actions = {
    updateGateInfos({ commit }) {
        getGateInfos().then(infos =>
            commit('setGateInfos', infos));
    }
};

const getters = {
    officalGateInfos(state) {
        return state.gateInfos.filter(g => g.name === OFFICAL_GATE_NAME);
    },
    officalGateTokenMap(state, getters) {
        const map = {};
        getters.officalGateInfos.map(g => g.tokens).reduce(function (pre, cur) {
            return [ ...pre, ...(cur || []) ];
        }, []).forEach(n => (map[n.viteTokenId] = n));
        return map;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
