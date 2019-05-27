import { constant } from '@vite/vitejs';
import { timer } from 'utils/asyncFlow';
import $ViteJS from 'utils/viteClient';
import { defaultTokenMap } from 'utils/constant';
import { tokenInfoFromGithub } from 'services/trade';
import getTokenIcon from 'utils/getTokenIcon';

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

        tokenId = tokenId || tokenInfo.tokenId;
        state.tokenInfoMaps[tokenId] = tokenInfo;
        state.tokenInfoMaps[tokenId].tokenId = tokenId;
        if (state.defaultTokenIds[tokenId]) {
            state.tokenInfoMaps[tokenId].icon = state.defaultTokenIds[tokenId].icon;
        }
    },
    setAllTokens(state, payload = []) {
        state.allTokens = payload;
    },
    setTokenInfoFromGithub(state, payload = []) {
        payload.forEach(t => {
            state.tokenMapFromGithub[t.tokenAddress]
        = state.tokenMapFromGithub[t.tokenAddress] || {};
            state.tokenMapFromGithub[t.tokenAddress].icon = t.icon;
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
    startLoopHeight({ commit }) {
        heightTimer
      = heightTimer
      || new timer(() =>
          $ViteJS.ledger.getSnapshotChainHeight().then(result => {
              commit('setCurrentHeight', result);
          }),
      2000);
        heightTimer.start();
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
    async fetchTokenInfoFromGithub({ commit }) {
        tokenInfoFromGithub().then(data => commit(data));
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
