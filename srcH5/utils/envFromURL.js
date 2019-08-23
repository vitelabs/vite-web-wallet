import getQuery from 'utils/query';
const query = getQuery() || {};

const env = {
    address: query.address || '',
    currency: query.currency || 'usd',
    lang: query.lang || 'en',
    category: query.category || 'BTC',
    symbol: query.symbol || 'GRIN-000_BTC-000', // 'VITE_BTC-000'
    tradeToken: query.tradeTokenId || '',
    quoteToken: query.quoteTokenId || ''
};

export default env;
