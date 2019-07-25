import { getUiConfig } from 'services/config.ts';
const state = { invite_addr_list: [] };

const mutations = {
    setInviteAddrList(state, payload = []) {
        state.invite_addr_list = payload;
    }
};

const actions = {
    fetchUiConfig({ commit }) {
        getUiConfig().then(data => {
            commit('setInviteAddrList', data['invite_addr_list']);
        });
    }
};

export default { state, mutations, actions };
