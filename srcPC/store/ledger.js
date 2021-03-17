import { constant } from '@vite/vitejs';
import { timer } from 'utils/asyncFlow';
import { defaultTokenMap, VX_TOKENID } from 'utils/constant';
import { getTokenInfoById, getSnapshotChainHeight, getTokenInfoList } from 'services/viteServer';

const ViteId = constant.Vite_TokenId;
const MAX_TOKEN_NUM = 300;

let heightTimer = null;
const state = {
    currentHeight: '',
    defaultTokenIds: defaultTokenMap,
    tokenInfoMaps: {},
    allTokens: []
};

const mutations = {
    setCurrentHeight(state, height) {
        state.currentHeight = height || 0;
    },
    setTokenInfo(state, { tokenInfo, tokenId }) {
        if (!tokenInfo || (!tokenInfo.tokenId && !tokenId)) {
            return;
        }

        const _token = {};
        tokenId = tokenId || tokenInfo.tokenId;
        _token[tokenId] = tokenInfo;
        _token[tokenId].tokenId = tokenId;
        if (state.defaultTokenIds[tokenId]) {
            _token[tokenId].icon = state.defaultTokenIds[tokenId].icon;
        }

        state.tokenInfoMaps = Object.assign(_token, state.tokenInfoMaps);
    },
    setAllTokens(state, payload = []) {
        state.allTokens = payload;
    }
};

const apis = {
    fetchTokenInfo(tokenId = ViteId) {
        return getTokenInfoById(tokenId);
    }
};

const actions = {
    setTokenInfoList({ commit }, list) {
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            const tokenId = item.tokenId;
            commit('setTokenInfo', { tokenInfo: item.tokenInfo || null, tokenId });
        }
    },
    startLoopHeight({ commit, dispatch }, time = 10000) {
        dispatch('stopLoopHeight');

        heightTimer = new timer(() =>
            getSnapshotChainHeight().then(result => {
                commit('setCurrentHeight', result);
            }), time);
        heightTimer.start();

        // $ViteJS.subscribe('newAccountBlocks').then(event => {
        //     event.on(result => {
        //         console.log(result);
        //     });
        //     // event.off();
        // }).catch(err => {
        //     console.warn(err);
        // });
    },
    stopLoopHeight() {
        heightTimer && heightTimer.stop();
        heightTimer = null;
    },
    getAllTokens({ commit }) {
        // 暂时为前端提供代币搜索功能，获取全部token信息；
        getTokenInfoList(0, MAX_TOKEN_NUM).then(data => {
            commit('setAllTokens', data.tokenInfoList);
        });
    },
    getDefaultTokenList({ dispatch, state }) {
        for (const tokenId in state.defaultTokenIds) {
            dispatch('fetchTokenInfo', tokenId);
        }
    },
    fetchTokenInfo({ commit }, tokenId) {
        return apis.fetchTokenInfo(tokenId).then(result => {
            commit('setTokenInfo', { tokenInfo: result, tokenId });
            return result;
        });
    }
};

const getters = {
    allTokensMap(state, rootGetters) {
        const map = {};
        const { idenGateTokenListMap } = rootGetters;
        state.allTokens.forEach(t => {
            map[t.tokenId] = Object.assign({}, t);
            map[t.tokenId].icon = map[t.tokenId].icon || idenGateTokenListMap[t.tokenId] && idenGateTokenListMap[t.tokenId].icon;
        });
        return map;
    },
    viteTokenInfo(state) {
        if (!state.tokenInfoMaps[ViteId]) {
            return null;
        }
        return state.tokenInfoMaps[ViteId];
    },
    vxTokenInfo(state) {
        if (!state.tokenInfoMaps[VX_TOKENID]) {
            return null;
        }
        return state.tokenInfoMaps[VX_TOKENID];
    }
};

export default { state, mutations, getters, actions };
