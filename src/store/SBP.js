const Gid = '00000000000000000001';

const state = {
    registrationList: []
};

const mutations = {
    commitRegistrationList(state, list) {
        state.registrationList = list || [];
    },
    commitClearRegistrationList(state) {
        state.registrationList = [];
    }
};

const actions = {
    fetchRegistrationList({ commit }, address) {
        return viteWallet.Vite['register_getRegistrationList'](Gid, address).then((data)=>{
            let result = data && data.result ? data.result : [];
            commit('commitRegistrationList', result);
            return data;
        });
    }
};

const getters = {
    regNameList(state) {
        let list = [];
        state.registrationList.forEach((item) => {
            list.push(item.name);
        });
        return list;
    },
    regAddrList(state) {
        let list = [];
        state.registrationList.forEach((item) => {
            let isCancel = item.cancelHeight && !viteWallet.BigNumber.isEqual(item.cancelHeight, 0);
            !isCancel && list.push(item.nodeAddr);
        });
        return list;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
