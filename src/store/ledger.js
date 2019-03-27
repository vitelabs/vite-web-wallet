import { constant } from '@vite/vitejs';
import { timer } from 'utils/asyncFlow';
import $ViteJS from 'utils/viteClient';

import viteIcon from 'assets/imgs/vite.svg';
import vcpIcon from 'assets/imgs/VCC.svg';
import vttIcon from 'assets/imgs/vtt.svg';

const ViteId = constant.Vite_TokenId;
const defaultTokenList = process.env.NODE_ENV === 'production' ? {
    'tti_5649544520544f4b454e6e40': {
        'tokenSymbol': 'VITE',
        icon: viteIcon
    },
    'tti_251a3e67a41b5ea2373936c8': {
        'tokenSymbol': 'VCP',
        icon: vcpIcon
    },
    'tti_c55ec37a916b7f447575ae59': {
        'tokenSymbol': 'VTT',
        icon: vttIcon
    }
} : {
    'tti_5649544520544f4b454e6e40': {
        'tokenSymbol': 'VITE',
        icon: viteIcon
    },
    'tti_c2695839043cf966f370ac84': {
        'tokenSymbol': 'VCP',
        icon: vcpIcon
    },
    'tti_6ac4abf1b4e855ba31620f0a': {
        'tokenSymbol': 'VTT',
        icon: vttIcon
    }
};

let heightTimer = null;

const state = {
    currentHeight: '',
    defaultTokenIds: defaultTokenList,
    tokenInfoMaps: {}
};

const mutations = {
    setCurrentHeight(state, height) {
        state.currentHeight = height || 0;
    },
    setTokenInfo(state, { tokenInfo, tokenId }) {
        if (!tokenInfo || (!tokenInfo.tokenId && tokenId)) {
            return;
        }

        tokenId = tokenId || tokenInfo.tokenId;
        state.tokenInfoMaps[tokenId] = tokenInfo;
        state.tokenInfoMaps[tokenId].tokenId = tokenId;
        if (state.defaultTokenIds[tokenId]) {
            state.tokenInfoMaps[tokenId].icon = state.defaultTokenIds[tokenId].icon;
        }
    }
};

const apis = {
    fetchTokenInfo(tokenId = ViteId) {
        return $ViteJS.ledger.getTokenMintage(tokenId);
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
        heightTimer = heightTimer || new timer(() => $ViteJS.ledger.getSnapshotChainHeight().then(result => {
            commit('setCurrentHeight', result);
        }), 2000);
        heightTimer.start();
    },
    getDefaultTokenList({ dispatch, state }) {
        for (const tokenId in state.defaultTokenIds) {
            dispatch('fetchTokenInfo', tokenId);
        }
    },
    fetchTokenInfo({ commit, state }, tokenId) {
        return apis.fetchTokenInfo(tokenId).then(result => {
            commit('setTokenInfo', { tokenInfo: result, tokenId });

            return state.tokenInfoMaps[tokenId];
        });
    }
};

const getters = {
    viteTokenInfo(state) {
        if (!state.tokenInfoMaps[ViteId]) {
            return null;
        }
        state.tokenInfoMaps[ViteId].tokenId = ViteId;

        return state.tokenInfoMaps[ViteId];
    }
};

export default { state, mutations, getters, actions };
