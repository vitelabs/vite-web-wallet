const Gid = '00000000000000000001';
let lastFetchTime = null;

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
        let fetchTime = new Date().getTime();
        lastFetchTime = fetchTime;

        return viteWallet.Vite['register_getRegistrationList'](Gid, address).then((data)=>{
            if (fetchTime !== lastFetchTime || !data || !data.result) {
                return null;
            }
            console.log(data);
            commit('commitRegistrationList', data.result);
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
