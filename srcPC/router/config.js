/**
 * Eg:
 *
 * startImport: {
 *      alias: '/index'
 * }
 */

module.exports = {
    startLogin: { alias: '/start' },
    tradeCenter: { alias: [ '/index', '/trade' ] },
    walletQuota: { alias: '/wallet' },
    bridgeMain: { alias: [ '/bridgeMain', '/bridge' ] }
};
