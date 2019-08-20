import getQuery from 'utils/query';

const query = getQuery();

const state = {
    address: query.address,
    currency: query.currency || 'usd',
    lang: query.lang || 'en',
    isShowCompliance: false
};

const mutations = {
    setComplianceShow(state) {
        state.isShowCompliance = true;
    }
};

const actions = {
    init({ dispatch }) {
        const txPair = {};
        for (const key in query) {
            if (key === 'address') {
                continue;
            }
            txPair[key] = query[key];
        }
        dispatch('h5DexFetchActiveTxPair', txPair);
    }
};

const getters = {
    activeAddr(state) {
        return state.address || '';
    }
};

export default { state, mutations, actions, getters };
