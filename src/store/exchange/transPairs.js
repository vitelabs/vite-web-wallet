const state = {
    list: [{
        icon: '',
        tokenid: 'tokenid1',
        symbol: 'symbol1',
        updown24juedui: '232323',
        updown24: '232323',
        updown24max: '232323',
        updown24min: '232323',
        lastUpdown: '2382392',
        market: '9203',
        price: '3',
        upDown: '32323',
        num: '329382093'
    },{
        icon: '',
        tokenid: 'tokenid1',
        symbol: 'symbol1',
        updown24juedui: '232323',
        updown24: '232323',
        updown24max: '232323',
        updown24min: '232323',
        lastUpdown: '2382392',
        market: '9203',
        price: '32',
        upDown: '32323',
        num: '329382093'
    },{
        icon: '',
        tokenid: 'tokenid1',
        symbol: 'symbol1',
        updown24juedui: '232323',
        updown24: '232323',
        updown24max: '232323',
        updown24min: '232323',
        lastUpdown: '2382392',
        market: '9203',
        price: '323',
        upDown: '32323',
        num: '329382093'
    },{
        icon: '',
        tokenid: 'tokenid1',
        symbol: 'symbol1',
        updown24juedui: '232323',
        updown24: '232323',
        updown24max: '232323',
        updown24min: '232323',
        lastUpdown: '2382392',
        market: '9203',
        price: '3232',
        upDown: '32323',
        num: '329382093'
    },{
        icon: '',
        tokenid: 'tokenid1',
        symbol: 'symbol1',
        updown24juedui: '232323',
        updown24: '232323',
        updown24max: '232323',
        updown24min: '232323',
        lastUpdown: '2382392',
        market: '9203',
        price: '32323',
        upDown: '32323',
        num: '329382093'
    }],
    activeTrans: {
        icon: '',
        tokenid: 'tokenid1',
        symbol: 'symbol1',
        updown24juedui: '232323',
        updown24: '232323',
        updown24max: '232323',
        updown24min: '232323',
        lastUpdown: '2382392',
        market: '9203',
        price: '32323',
        upDown: '32323',
        num: '329382093'
    }
};

const mutations = {
    exchangeActiveTransPair(state, transPair) {
        let i = state.list.indexOf(transPair);
        if (i < 0) {
            return;
        }
        state.activeTrans = transPair;
    }
};

// const actions = {
//     fetcsdsdhQ({ commit }, address) {

//     }
// };

// const getters = {
//     totsdsda(state) {

//     }
// };

export default {
    state,
    mutations,
    // actions,
    // getters
};
