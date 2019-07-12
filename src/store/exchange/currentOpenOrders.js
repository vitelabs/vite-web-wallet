const state = { list: [] };

const mutations = {
    exSetCurrentOpenOrders(state, list) {
        state.list = list || [];
    },
    exAddOpenOrder(state, order) {
        if (!order || order.status !== 1) {
            return;
        }

        const index = state.list.findIndex(v => v.orderId === order.orderId);
        if (index < 0) {
            state.list.push(order);
        } else {
            state.list[index] = order;
        }

        let list = state.list.sort((a, b) => b.createTime - a.createTime);
        list = list.slice(0, 30);
        state.list = [].concat(list);
    },
    exClearCurrentOpenOrders(state) {
        state.list = [];
    }
};

export default {
    state,
    mutations
};
