const state = { list: [] };

const mutations = {
    exSetCurrentOpenOrders(state, list) {
        state.list = list || [];
    }
};

export default {
    state,
    mutations
};
