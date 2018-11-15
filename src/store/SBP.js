import config from 'config/constant';
import { timer } from 'utils/asyncFlow';

const loopTime = 5000;
let regListInst = null;
let listNum = 0;

const apis = {
    fetchRegistrationList(address) {
        return viteWallet.Vite['register_getRegistrationList'](config.gid, address).then((data)=>{
            return data && data.result ? data.result : [];
        });
    }
};

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
        return apis.fetchRegistrationList(address).then((result) => {
            commit('commitRegistrationList', result);
        });
    },
    loopRegList({ state, dispatch }, address) {
        if (!regListInst) {
            let regListNum = state.registrationList ? state.registrationList.length : 0;
            listNum = regListNum + 1;
        } else {
            listNum = listNum ? listNum + 1 : state.registrationList ? state.registrationList.length : 0;
            return;
        }

        regListInst = new timer(()=>{
            let regListNum = state.registrationList ? state.registrationList.length : 0;
            if (listNum === regListNum) {
                dispatch('stopLoopRegList');
                return;
            }
            
            return dispatch('fetchRegistrationList', address);
        }, loopTime);
        regListInst.start();
    },
    stopLoopRegList() {
        regListInst && regListInst.stop();
        regListInst = null;
    }
};

const getters = {
    regNameList(state) {
        let list = [];
        state.registrationList.forEach((item) => {
            let isCancel = item.cancelHeight && !viteWallet.BigNumber.isEqual(item.cancelHeight, 0);
            !isCancel && list.push(item.name);
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
