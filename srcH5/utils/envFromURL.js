import getQuery from 'utils/query';
const query = getQuery() || {};

const quoteTokenCategory = [ 'BTC', 'ETH', 'VITE', 'USDT' ];
let category = query.category || 'BTC';
category = quoteTokenCategory.indexOf(category) === -1 ? 'BTC' : category;

const env = {
    category,
    quoteTokenCategory,
    address: query.address || '',
    currency: query.currency || 'usd',
    lang: query.lang || 'en',
    symbol: query.symbol || 'GRIN-000_BTC-000', // 'VITE_BTC-000'
    tradeToken: query.tradeTokenId || '',
    quoteToken: query.quoteTokenId || ''
};

export default env;
