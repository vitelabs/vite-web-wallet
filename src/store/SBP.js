import config from 'config/constant';
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';

const loopTime = 5000;
let regListInst = null;
let nodeNameList = {};

const apis = {
    fetchRegistrationList(address) {
        return $ViteJS.register.getRegistrationList(config.gid, address).then((result)=>{
            return result || [];
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
    loopRegList({ state, dispatch }, {
        address, nodeName, operate, producer
    }) {
        // operate ==> 0: cancel / 1: reg / 2: update
        state.registrationList.forEach((regItem) => {
            if (regItem.name !== nodeName) {
                return;
            }
            nodeNameList[nodeName] = {
                nodeName, operate, producer
            };
        });

        dispatch('stopLoopRegList');
        regListInst = new timer(()=>{
            state.registrationList.forEach((item) => {
                let nodeName = item.name;
                if (!nodeNameList[nodeName]) {
                    return;
                }
 
                let operate = nodeNameList[nodeName].operate;
                let isCancel = item.cancelHeight && !BigNumber.isEqual(item.cancelHeight, 0);
                switch(operate) {
                case 0: // cancel
                    isCancel && delete nodeNameList[nodeName];
                    break;
                case 1: // reg
                    !isCancel && nodeNameList[nodeName].operate && delete nodeNameList[nodeName];
                    break;
                case 2: // update
                    nodeNameList[nodeName].producer === item.nodeAddr && delete nodeNameList[nodeName];
                    break;
                default: break;
                }
            });

            let length = 0;
            for (let name in nodeNameList) {
                name && length++;
            }

            if (!length) {
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
            let isCancel = item.cancelHeight && !BigNumber.isEqual(item.cancelHeight, 0);
            !isCancel && list.push(item.name);
        });
        return list;
    },
    regAddrList(state) {
        let list = {};
        state.registrationList.forEach((item) => {
            let isCancel = item.cancelHeight && !BigNumber.isEqual(item.cancelHeight, 0);
            list[item.name] = list[item.name] || [];
            list[item.name].push({
                nodeAddr: item.nodeAddr,
                isCancel
            });
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
