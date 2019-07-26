import { getUiConfig } from 'services/config.ts';
const state = { inviteAddrList: [], allShowInvite: false };

const mutations = {
    setInviteAddrList(state, payload = []) {
        state.inviteAddrList = payload;
    },
    setAllShowInvite(state, payload = false) {
        state.allShowInvite = payload;
    }

};

const actions = {
    fetchUiConfig({ commit }) {
        getUiConfig().then(data => {
            commit('setInviteAddrList', data['inviteAddrList']);
            commit('setAllShowInvite', data['allShowInvite']);
        });
    }
};

export default { state, mutations, actions };
