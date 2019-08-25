import { constant } from '@vite/vitejs';
import { timer } from 'utils/asyncFlow';
import { defaultTokenMap } from 'utils/constant';
import { tokenInfoFromGithub } from 'services/trade';
import { getTokenIcon } from 'pcUtils/tokenParser';
import { getTokenInfoById, getSnapshotChainHeight, getTokenInfoList } from 'services/viteServer';

const ViteId = constant.Vite_TokenId;
const MAX_TOKEN_NUM = 100;

let heightTimer = null;
const state = {
    currentHeight: '',
    defaultTokenIds: defaultTokenMap,
    tokenInfoMaps: {},
    allTokens: [],
    tokenMapFromGithub: {}
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
    },
    setTokenInfoFromGithub(state, payload = []) {
        payload.forEach(t => {
            state.tokenMapFromGithub[t.tokenId]
        = state.tokenMapFromGithub[t.tokenId] || {};
            state.tokenMapFromGithub[t.tokenId].icon = t.icon || undefined;// 只保存icon信息
        });
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
    },
    fetchTokenInfoFromGithub({ commit }) {
        tokenInfoFromGithub().then(data => commit('setTokenInfoFromGithub', data.map(t => Object.assign({}, t, { tokenId: t.tokenAddress }))));
    }
};

const getters = {
    allTokensMap(state) {
        const map = {};
        state.allTokens.forEach(t => {
            map[t.tokenId] = Object.assign({},
                t,
                state.tokenMapFromGithub[t.tokenId] || {});
            map[t.tokenId].icon = map[t.tokenId].icon || getTokenIcon(t.tokenId);
        });
        return map;
    },
    viteTokenInfo(state) {
        if (!state.tokenInfoMaps[ViteId]) {
            return null;
        }
        return state.tokenInfoMaps[ViteId];
    }
};

export default { state, mutations, getters, actions };
