import env from 'h5Utils/envFromURL';
import { timer } from 'utils/asyncFlow';
import { defaultTokenMap } from 'utils/constant';
import { getTokenIcon } from 'utils/tokenParser';
import { getSnapshotChainHeight, getTokenInfoById } from 'services/viteServer';

let heightTimer = null;

let currency = env.currency;
if (!currency && env.lang) {
    currency = env.lang === 'zh' ? 'cny' : 'usd';
}

const state = {
    currency: currency || 'en',
    currentHeight: 0,
    tokenMap: defaultTokenMap
};

const mutations = {
    setCurrentHeight(state, height) {
        state.currentHeight = height || 0;
    },
    addTokenInfo(state, tokenInfo) {
        if (!tokenInfo || !tokenInfo.tokenId) {
            return;
        }

        const tokenId = tokenInfo.tokenId;
        state.tokenMap[tokenId] = Object.assign({}, state.tokenMap[tokenId] || {},
            {
                ...tokenInfo,
                icon: getTokenIcon(tokenId)
            });
    }
};

const actions = {
    startLoopHeight({ commit, dispatch }, time = 10000) {
        dispatch('stopLoopHeight');

        heightTimer = new timer(() =>
            getSnapshotChainHeight().then(result => {
                commit('setCurrentHeight', result);
            }), time);
        heightTimer.start();
    },
    stopLoopHeight() {
        heightTimer && heightTimer.stop();
        heightTimer = null;
    },
    fetchDefaultTokenList({ dispatch }) {
        for (const tokenId in defaultTokenMap) {
            dispatch('addTokenInfo', tokenId);
        }
    },
    addTokenInfo({ commit }, tokenId) {
        return getTokenInfoById(tokenId).then(result => {
            commit('addTokenInfo', result);
            return result;
        });
    }
};

const getters = {
    currencySymbol(state) {
        if (!state.currency) {
            return '';
        }
        const symbolMap = {
            cny: '¥',
            usd: '$'
        };
        return symbolMap[state.currency] || '';
    }
};

export default { state, getters, mutations, actions };
