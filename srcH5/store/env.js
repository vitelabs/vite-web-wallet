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
    },
    setLang(state, lang) {
        state.lang = lang;
        if (!state.currency) {
            state.currency = lang === 'zh' ? 'cny' : 'usd';
        }
    }
};

const getters = {
    activeAddr(state) {
        return state.address || '';
    }
};

export default { state, mutations, getters };
