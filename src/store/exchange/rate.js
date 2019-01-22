import { timer } from 'utils/asyncFlow';
import { rate } from 'services/exchange';

const loopTime = 2 * 60 * 1000 * 1000;
let rateTimer = null;

const state = {
    rateList: {
        'tti_5649544520544f4b454e6e40': {
            'tokenCode': 'tti_5649544520544f4b454e6e40',
            'tokenName': 'tokenName',
            'usd': '0.2323',
            'cny': '0.43434'
        }
    },
    coins: {
        en: 'cny',
        zh: 'usd'
    }
};

const mutations = {
    setExchangeRate(state, rateList) {
        state.rateList = {};
        rateList && rateList.forEach((rate) => {
            state.rateList[rate.tokenCode] = rate;
        });
    }
};

const actions = {
    startLoopExchangeRate({ commit }) {
        rateTimer = new timer(()=>{
            return rate().then((data) => {
                commit('setExchangeRate', data);
            });
        }, loopTime);
        rateTimer.start();
    },
    stopLoopExchangeRate() {
        rateTimer && rateTimer.stop();
        rateTimer = null;
    }
};

export default {
    state,
    mutations,
    actions
};
