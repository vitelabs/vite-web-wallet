import { baseToken } from 'services/exchange';
const state = {
    currentMarket: '',
    marketMap:[]
};

const mutations = {
    setCurrentMarket(state, tokenId){
        state.currentMarket=tokenId;
    },
    setMarketMap(state, marketMap) {
        state.marketMap=marketMap;
    },
};

const actions ={
    updateMarketMap({commit,state}){
        baseToken().then((data) => {
            commit('setMarketMap',data || []);
            const currentMarket = state.marketMap;
            commit('setCurrentMarket',currentMarket[0]?currentMarket[0].token:'');
        });
    }
};
export default {
    state, mutations,actions
};
