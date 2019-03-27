const state = { activeTx: {} };

const mutations = {
    exSetActiveTx(state, activeTx) {
        state.activeTx = Object.assign({}, activeTx);
    }
};

export default { state, mutations };
