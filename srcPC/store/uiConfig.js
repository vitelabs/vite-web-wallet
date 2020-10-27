import { getUiConfig } from 'pcServices/config.ts';

const state = {
    inviteAddrList: [],
    allShowInvite: false,
    versionList: [],
    hiddenSymbols: []
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
    setHiddenSymbols(state, payload = []) {
        state.hiddenSymbols = payload;
    }
};

const actions = {
    fetchUiConfig({ commit }) {
        getUiConfig().then(data => {
            commit('setInviteAddrList', data['inviteAddrList']);
            commit('setAllShowInvite', data['allShowInvite']);
            commit('setVersionList', data['versionList'] || []);
            commit('setHiddenSymbols', data['hideSymbols'] || []);
        });
    }
};

export default { state, mutations, actions };
