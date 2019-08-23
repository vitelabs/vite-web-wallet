import env from 'h5Utils/envFromURL';

let currency = env.currency;
if (!currency && env.lang) {
    currency = env.lang === 'zh' ? 'cny' : 'usd';
}

const state = { currency: currency || 'en' };

const getters = {
    currencySymbol(state) {
        if (!state.currency) {
            return '';
        }
        const symbolMap = {
            cny: '¥',
            usd: '$'
        };
        return symbolMap[state.currency] || '';
    }
};

export default { state, getters };
