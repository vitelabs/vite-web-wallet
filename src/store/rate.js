import { timer } from 'utils/asyncFlow';
import { rateToken } from 'services/trade';

const loopTime = 60 * 1000;
let rateTimer = null;

const state = { rateMap: {}, rateTokenIds: [] };

const mutations = {
    setExchangeRate(state, rateList) {
        state.rateMap = {};
        rateList && rateList.forEach(rate => {
            state.rateMap[rate.tokenId] = rate;
        });
    },
    setRateTokenIds(state, payload) {
        state.rateTokenIds = Array.from(new Set([ ...state.rateTokenIds, ...payload ]));
    }
};

const actions = {
    startLoopExchangeRate({ commit, dispatch, state }) {
        dispatch('stopLoopExchangeRate');
        const f = () => {
            if (!state.rateTokenIds || !state.rateTokenIds.length) {
                return;
            }
            return rateToken({ tokenIdList: state.rateTokenIds }).then(data => {
                commit('setExchangeRate', data);
            });
        };

        rateTimer = new timer(f, loopTime);
        rateTimer.start();
    },
    stopLoopExchangeRate() {
        rateTimer && rateTimer.stop();
        rateTimer = null;
    },
    addRateTokens({ commit, state }, payload = []) {
        const contains = payload.every(t => state.rateTokenIds.findIndex(n => n === t) >= 0);
        if (contains) return;
        commit('setRateTokenIds', payload);
        rateToken({ tokenIdList: state.rateTokenIds }).then(data => {
            commit('setExchangeRate', data);
        });
    }
};

const getters = {
    currencyRateList(state, getters, rootState) {
        const rateList = state.rateMap || {};
        const coin = rootState.env.currency;

        const _rateList = {};
        for (const tokenId in rateList) {
            _rateList[tokenId] = rateList[tokenId][`${ coin }Rate`];
        }
        return _rateList;
    },
    btcRateList(state) {
        const rateList = state.rateMap || {};
        const _rateList = {};
        for (const tokenId in rateList) {
            _rateList[tokenId] = rateList[tokenId]['btcRate'];
        }
        return _rateList;
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
