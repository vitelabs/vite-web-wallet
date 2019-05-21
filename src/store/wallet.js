import { getCurrHDAcc, setCurrHDAcc, getActiveAcc, StatusMap } from 'wallet';

const state = {
    currHDAcc: getCurrHDAcc(),
    status: getCurrHDAcc() ? getCurrHDAcc().status : null,
    name: getCurrHDAcc() ? getCurrHDAcc().name : '',
    activeAcc: getActiveAcc(),
    addrList: getCurrHDAcc() ? getCurrHDAcc().addrList : []
};

const mutations = {
    switchHDAcc(state, account) {
        setCurrHDAcc(account);
        state.currHDAcc = getCurrHDAcc();
        state.status = state.currHDAcc ? state.currHDAcc.status : null;
        state.name = state.currHDAcc ? state.currHDAcc.name : null;
        state.addrList = state.currHDAcc ? state.currHDAcc.addrList || [] : [];
        state.activeAcc = getActiveAcc();
    },
    setCurrHDAccStatus(state) {
        if (!state.currHDAcc) {
            return;
        }
        state.status = state.currHDAcc.status;
    },
    setCurrHDAccAddrList(state) {
        if (!state.currHDAcc) {
            return;
        }
        state.addrList = [].concat(state.currHDAcc.addrList);
    },
    renameCurrHDAcc(state, name) {
        if (!state.currHDAcc) {
            return;
        }
        state.currHDAcc.rename(name);
        state.name = state.currHDAcc.name;
    },
    switchActiveAcc(state, { address, index }) {
        if (!state.currHDAcc) {
            return;
        }

        state.currHDAcc.switchActiveAcc(index, address);
        state.activeAcc = getActiveAcc();
    },
    logout(state) {
        if (!state.currHDAcc || !state.currHDAcc.status || state.currHDAcc.status === StatusMap.LOCK) {
            return;
        }

        state.currHDAcc.freeze();
        state.currHDAcc.lock();
        state.status = state.currHDAcc ? state.currHDAcc.status : null;
        state.addrList = state.currHDAcc ? state.currHDAcc.addrList || [] : [];
    },
    currHDAccAddAddr(state) {
        if (!state.currHDAcc || !state.currHDAcc.status || state.currHDAcc.status === StatusMap.LOCK) {
            return;
        }
        state.currHDAcc.addAddr();
        state.addrList = state.currHDAcc ? [].concat(state.currHDAcc.addrList || []) : [];
    },
    changeAddrName(state, { address, index, name }) {
        if (!state.currHDAcc) {
            return;
        }
        state.currHDAcc.changeAddrName(name, index, address);
        state.addrList = state.currHDAcc ? [].concat(state.currHDAcc.addrList || []) : [];
    }
};

const actions = {
    login({ state, commit }, password) {
        if (!state.currHDAcc) {
            return;
        }

        return state.currHDAcc.unlock(password).then(res => {
            commit('setCurrHDAccStatus');
            commit('setCurrHDAccAddrList');

            return res;
        });
    }
};

const getters = {
    activeAddr(state) {
        const activeAccount = state.activeAcc;
        return activeAccount ? activeAccount.address : '';
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
