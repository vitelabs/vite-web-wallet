import { getGateInfos } from 'pcServices/gate';
import { getTokenInfoBatch } from 'services/trade';


const state = {
    gateInfos: [],

    // Identification gate token issued on vite network.
    idenGateTokenList: []
};


const mutations = {
    setGateInfos(state, payload) {
        state.gateInfos = payload || [];
    },
    setIdenGateTokenList(state, payload) {
        state.idenGateTokenList = payload.map(item => {
            item.tokenId = item.tokenAddress;

            // // for mock test
            // if (item.tokenId === 'tti_80f3751485e4e83456059473') {
            //     item.gatewayInfo.mappedToken = {
            //         ...item.gatewayInfo.mappedToken,
            //         url: item.gatewayInfo.url,
            //         standard: 'ERC20'
            //     };
            //     item.gatewayInfo.mappedTokenExtras = [{
            //         ...item.gatewayInfo.mappedToken,
            //         url: item.gatewayInfo.url,
            //         standard: 'TRC20'
            //     }];
            // }
            // // for mock test

            let multiNetwork = [];
            if (item.gatewayInfo && item.gatewayInfo.mappedTokenExtras) {
                multiNetwork = [item.gatewayInfo.mappedToken].concat(item.gatewayInfo.mappedTokenExtras);
            }
            return {
                ...item,
                gateInfo: {
                    ...item.gatewayInfo,
                    multiNetwork,
                    gateway: item.gatewayInfo.name // Compatible with old code
                }
            };
        });
    }
};

const actions = {
    updateGateInfos({ commit, dispatch }) {
        getGateInfos('/gateWay').then(infos => {
            commit('setGateInfos', infos);
            dispatch('getTokenInfoBatch');
        });
    },
    getTokenInfoBatch({ commit, getters }) {
        const tokenAddresses = Object.keys(getters.mapToken2Gate);
        getTokenInfoBatch({ tokenAddresses }).then(list => {
            commit('setIdenGateTokenList', list);
        });
    }
};

const getters = {
    mapToken2Gate(state, getters) {
        const map = {};
        const { idenGateTokenListMap } = getters;
        state.gateInfos.map(g => g.tokens).reduce(function (pre, cur) {
            return [ ...pre, ...(cur || []) ];
        }, []).forEach(n => {
            map[n.tokenId] = {
                ...n,
                gateInfo: idenGateTokenListMap[n.tokenId] ? idenGateTokenListMap[n.tokenId].gateInfo : {
                    url: n.url,
                    gateway: n.gateway
                }
            };
        });
        return map;
    },
    mapGate2Token() {
        const map = {};
        state.gateInfos.forEach(g => (map[g.name] = g));
        return map;
    },
    idenGateTokenListMap(state) {
        const ob = {};
        state.idenGateTokenList.forEach(item => {
            ob[item.tokenAddress] = {
                ...item,
                tokenId: item.tokenAddress
            };
        });
        return ob;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
};
