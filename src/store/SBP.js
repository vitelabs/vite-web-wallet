import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import { constant } from '@vite/vitejs';
import $ViteJS from 'utils/viteClient';

const loopTime = 5000;
let regListInst = null;
const nodeNameList = {};

const apis = {
    fetchRegistrationList(address) {
        return $ViteJS.register.getRegistrationList(constant.Snapshot_Gid, address).then(result => result || []);
    }
};

const state = { registrationList: [] };

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
        return apis.fetchRegistrationList(address).then(result => {
            commit('commitRegistrationList', result);
        });
    },
    loopRegList({ state, dispatch }, { address, nodeName, operate, producer }) {
        // Operate ==> 0: cancel / 1: reg / 2: update
        let isInList = false;
        state.registrationList.forEach(regItem => {
            if (regItem.name !== nodeName) {
                return;
            }
            isInList = true;
            nodeNameList[nodeName] = { nodeName, operate, producer };
        });

        if (!state.registrationList.length || !isInList) {
            nodeNameList[nodeName] = { nodeName, operate, producer };
        }

        dispatch('stopLoopRegList');
        regListInst = new timer(() => {
            state.registrationList.forEach(item => {
                const nodeName = item.name;
                if (!nodeNameList[nodeName]) {
                    return;
                }

                const operate = nodeNameList[nodeName].operate;
                const isCancel = item.cancelHeight && !BigNumber.isEqual(item.cancelHeight, 0);
                switch (operate) {
                // Cancel
                case 0:
                    isCancel && delete nodeNameList[nodeName];
                    break;
                // Reg
                case 1:
                    !isCancel && nodeNameList[nodeName].operate && delete nodeNameList[nodeName];
                    break;
                // Update
                case 2:
                    nodeNameList[nodeName].producer === item.nodeAddr && delete nodeNameList[nodeName];
                    break;
                default: break;
                }
            });

            let length = 0;
            for (const name in nodeNameList) {
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
        const list = [];
        state.registrationList.forEach(item => {
            const isCancel = item.cancelHeight && !BigNumber.isEqual(item.cancelHeight, 0);
            !isCancel && list.push(item.name);
        });

        return list;
    },
    regAddrList(state) {
        const list = {};
        state.registrationList.forEach(item => {
            const isCancel = item.cancelHeight && !BigNumber.isEqual(item.cancelHeight, 0);
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
