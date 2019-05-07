import { wallet } from 'utils/wallet/index';

const activeAccount = wallet.getActiveAccount();

const state = { address: activeAccount ? activeAccount.getDefaultAddr() : '' };

const mutations = {
    setDefaultAddress(state, address) {
        state.address = address;
    },
    changeDefaultAddress(state, { address, index }) {
        const activeAccount = wallet.getActiveAccount();
        const res = activeAccount.setDefaultAddr(address, index);
        if (!res) {
            return false;
        }

        state.address = address;
    }
};

const actions = {
    changeDefaultAddress({ commit, dispatch }, { address, index }) {
        const res = commit('changeDefaultAddress', { address, index });
        if (!res) {
            return;
        }

        // Clear all
        commit('commitClearBalance');
        dispatch('startLoopBalance');
        commit('commitClearTransList');
        commit('commitClearPledge');
        commit('clearDexBalance');
    }
};

export default {
    state,
    mutations,
    actions
};
