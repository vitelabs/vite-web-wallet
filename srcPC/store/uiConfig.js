import { getUiConfig } from 'services/config.ts';

const state = {
    inviteAddrList: [],
    allShowInvite: false,
    versionList: []
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
    }
};

const actions = {
    fetchUiConfig({ commit }) {
        getUiConfig().then(data => {
            commit('setInviteAddrList', data['inviteAddrList']);
            commit('setAllShowInvite', data['allShowInvite']);
            commit('setVersionList', data['versionList'] || []);
        });
    }
};

export default { state, mutations, actions };
