const state = { list: [] };

const mutations = {
    exSetCurrentOpenOrders(state, list) {
        state.list = list || [];
    },
    exUpdateOpenOrder(state, order) {
        if (!order) {
            return;
        }

        // Delete Open Order
        if (order.status !== 1) {
            const index = state.list.findIndex(v => v.orderId === order.orderId);
            (index >= 0) && state.list.splice(index, 1);
            return;
        }

        // Add Open Order
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
