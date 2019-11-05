import { getUiConfig } from 'pcServices/config.ts';

const state = {
    inviteAddrList: [],
    allShowInvite: false,
    versionList: [],
    hideTxPairs: []
};

const mutations = {
    setInviteAddrList(state, payload = []) {
        state.inviteAddrList = payload;
    },
    setAllShowInvite(state, payload = false) {
        state.allShowInvite = payload;
    },
    setVersionList(state, payload = []) {
        state.versionList = payload;
    },
    setHideTxPairs(state, payload = []) {
        state.hideTxPairs = payload;
    }
};

const actions = {
    fetchUiConfig({ commit }) {
        getUiConfig().then(data => {
            commit('setInviteAddrList', data['inviteAddrList']);
            commit('setAllShowInvite', data['allShowInvite']);
            commit('setVersionList', data['versionList'] || []);
            commit('setHideTxPairs', data['hideTxPairs'] || []);
        });
    }
};

export default { state, mutations, actions };
