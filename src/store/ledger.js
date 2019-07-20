import { constant } from '@vite/vitejs';
import { timer } from 'utils/asyncFlow';
import $ViteJS from 'utils/viteClient';
import { defaultTokenMap } from 'utils/constant';
import { tokenInfoFromGithub } from 'services/trade';

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
            state.tokenMapFromGithub[t.tokenId].icon = t.urlIcon || undefined;// 只保存icon信息
        });
    }
};

const apis = {
    fetchTokenInfo(tokenId = ViteId) {
        return $ViteJS.mintage.getTokenInfoById(tokenId);
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
    startLoopHeight({ commit, dispatch }) {
        dispatch('stopLoopHeight');

        heightTimer = new timer(() =>
            $ViteJS.ledger.getSnapshotChainHeight().then(result => {
                commit('setCurrentHeight', result);
            }), 2000);
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
        $ViteJS.mintage.getTokenInfoList(0, MAX_TOKEN_NUM).then(data => {
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
        tokenInfoFromGithub().then(data => commit('setTokenInfoFromGithub', data));
    }
};

const getters = {
    allTokensMap(state) {
        const map = {};
        state.allTokens.forEach(t => {
            map[t.tokenId] = Object.assign({},
                t,
                state.tokenMapFromGithub[t.tokenId] || {});
            map[t.tokenId].icon = map[t.tokenId].icon || undefined;
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
