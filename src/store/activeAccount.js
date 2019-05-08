import { wallet } from 'utils/wallet/index';

const activeAccount = wallet.getActiveAccount();

const state = {
    address: activeAccount ? activeAccount.getDefaultAddr() : '',
    addrList: activeAccount ? activeAccount.getAddrList() : []
};

const mutations = {
    setActiveAccAddrList(state) {
        const activeAccount = wallet.getActiveAccount();
        state.addrList = activeAccount ? activeAccount.getAddrList() || [] : [];
    },
    setDefaultAddress(state) {
        const activeAccount = wallet.getActiveAccount();
        state.address = activeAccount.getDefaultAddr() || '';
    },
    changeDefaultAddress(state, { address, index }) {
        const activeAccount = wallet.getActiveAccount();
        const res = activeAccount.setDefaultAddr(address, index);
        if (!res) {
            return false;
        }

        state.address = address;
    },
    activeAccAddAddr(state) {
        const activeAccount = wallet.getActiveAccount();
        const addrList = activeAccount.getAddrList() || [];
        if (addrList.length >= 10) {
            return;
        }

        activeAccount.addAddr();
        state.addrList = activeAccount.getAddrList();
    },
    activeAccSetAddrName(state, { addr, name, index }) {
        const activeAccount = wallet.getActiveAccount();
        activeAccount.setAddrName(addr, index, name);
        state.addrList = activeAccount.getAddrList();
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
