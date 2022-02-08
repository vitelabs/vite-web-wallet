import { constant } from '@vite/vitejs';
import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { defaultTokenMap } from 'utils/constant';
import { getTokenIcon } from 'utils/tokenParser';
import {
    getAccountBalance,
    subUnreceivedTx,
    unsubUnreceivedTx,
    getAccountBlockByHash
} from 'services/viteServer';
import { gateStorage } from 'pcServices/gate';
import { notice } from 'utils/noticeUtils';
import i18n from 'pcI18n';

let balanceInfoInst = null;
let unreceivedTxEvent = null;

const state = {
    onroad: { balanceInfos: {} },
    balance: { balanceInfos: {} },
    accountBlockCount: 0,
    unreceivedTx: []
};

const mutations = {
    commitBalanceInfo(state, payload) {
        if (!payload) {
            state.balance = { balanceInfos: {} };
            state.onroad = { balanceInfos: {} };
            state.accountBlockCount = 0;
            return;
        }

        state.accountBlockCount = payload.balance
            ? payload.balance.blockCount || 0
            : 0;
        state.balance = payload.balance || {};
        state.balance.balanceInfos
            = state.balance && state.balance.balanceInfoMap
                ? state.balance.balanceInfoMap
                : {};

        state.onroad = payload.unreceived || {};
        state.onroad.balanceInfos
            = state.onroad && state.onroad.balanceInfoMap
                ? state.onroad.balanceInfoMap
                : {};

        // Desktop wallt only
        if (window.ipcRenderer) {
            window.ipcRenderer.send('balanceInfo',
                JSON.stringify(getters.balanceInfo(state)));
        }
    },
    commitClearBalance(state) {
        state.balance = { balanceInfos: {} };
        state.onroad = { balanceInfos: {} };
    }
};
const actions = {
    startLoopBalance({ commit, dispatch, rootState }) {
        dispatch('stopLoopBalance');
        balanceInfoInst = new timer(() => {
            const activeAcc = rootState.wallet.activeAcc;
            if (!activeAcc) {
                return;
            }

            return getAccountBalance(activeAcc.address).then(data => {
                commit('commitBalanceInfo', data);
            });
        }, 1000);
        balanceInfoInst.start();
    },
    stopLoopBalance() {
        balanceInfoInst && balanceInfoInst.stop();
        balanceInfoInst = null;
    },
    subUnreceivedTx({ dispatch, rootState }) {
        const activeAcc = rootState.wallet.activeAcc;
        if (!activeAcc || !activeAcc.address) return;

        if (unreceivedTxEvent) {
            dispatch('unsubUnreceivedTx');
        }
        subUnreceivedTx(activeAcc.address)
            .then(event => {
                event.on(data => {
                    if (!Array.isArray(data)) return;
                    const title = i18n.t('desktop.unreceivedTx.title', { num: data.length });
                    if (data.length > 1) {
                        return notice(title);
                    } else if (data.length === 1) {
                        getAccountBlockByHash(data[0].hash).then(data => {
                            const body = i18n.t('desktop.unreceivedTx.body', {
                                symbol: data.tokenInfo.tokenSymbol,
                                address: data.fromAddress,
                                amount: bigNumber.toBasic(data.amount,
                                    data.tokenInfo.decimals)
                            });
                            notice(title, {
                                body,
                                requireInteraction: false
                            });
                        });
                    }
                });
                unreceivedTxEvent = event;
            })
            .catch(err => {
                console.error(err);
            });
    },
    unsubUnreceivedTx() {
        unsubUnreceivedTx(unreceivedTxEvent);
        unreceivedTxEvent = null;
    }
};

const getters = {
    balanceInfo(state) {
        // -------- merge balance & onroad
        const balanceInfo = Object.create(null);
        for (const tokenId in state.balance.balanceInfoMap) {
            const item = state.balance.balanceInfoMap[tokenId];

            const tokenInfo = item.tokenInfo;
            const decimals = tokenInfo.decimals;
            const balance = bigNumber.toBasic(item.balance, decimals);

            balanceInfo[tokenId] = {
                ...tokenInfo,
                balance,
                transNum: item.transactionCount,
                totalAmount: item.balance
            };
        }

        for (const tokenId in state.onroad.balanceInfoMap) {
            const item = state.onroad.balanceInfoMap[tokenId];
            const tokenInfo = item.tokenInfo;
            const decimals = tokenInfo.decimals;
            const balance = bigNumber.toBasic(item.balance, decimals);

            balanceInfo[tokenId] = balanceInfo[tokenId] || {};
            balanceInfo[tokenId].tokenId
                = balanceInfo[tokenId].tokenId || tokenInfo.tokenId;
            balanceInfo[tokenId].fundFloat = balance;
            balanceInfo[tokenId].decimals
                = balanceInfo[tokenId].decimals || tokenInfo.decimals;
            balanceInfo[tokenId].tokenSymbol
                = balanceInfo[tokenId].tokenSymbol || tokenInfo.tokenSymbol;
            balanceInfo[tokenId].onroadNum = item.transactionCount;
        }
        return balanceInfo;
    },
    defaultTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const mapToken2Gate = rootGetters.mapToken2Gate;
        const exBalance = rootGetters.exBalanceList;
        // ------------------- show default token
        const list = Object.keys(defaultTokenMap).map(i => {
            const {
                index,
                availableExAmount = 0,
                totalExAmount = 0,
                onroadNum = '',
                totalAmount = 0,
                tokenName = '',
                totalSupply = '',
                isReIssuable = '',
                tokenSymbol,
                balance = '',
                fundFloat = '',
                decimals = '',
                owner = '',
                tokenId = i,
                icon = getTokenIcon(i),
                type = 'NATIVE',
                gateInfo = {}
            } = Object.assign({},
                defaultTokenMap[i],
                balanceInfo[i] || {},
                allToken[i] || {},
                {
                    gateInfo: (mapToken2Gate[i]
                        && mapToken2Gate[i].gateInfo) || { url: null }
                },
                exBalance[i]);
            const rate
                = rootState.exchangeRate.rateMap[i]
                && rootState.exchangeRate.rateMap[i][
                    `${ rootState.env.currency }Rate`
                ];
            const totalExAsset = rate
                ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                    rate)
                : 0;
            const walletAsset = rate
                ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                    rate)
                : 0;
            const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
            const rateBtc
                = rootState.exchangeRate.rateMap[i]
                && rootState.exchangeRate.rateMap[i]['btcRate'];
            const totalExAssetBtc = rateBtc
                ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                    rateBtc)
                : 0;
            const walletAssetBtc = rateBtc
                ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                    rateBtc)
                : 0;
            const totalAssetBtc = bigNumber.plus(totalExAssetBtc,
                walletAssetBtc);
            return {
                totalExAssetBtc,
                walletAssetBtc,
                totalAssetBtc,
                index,
                totalAsset,
                totalExAsset,
                walletAsset,
                availableExAmount,
                totalExAmount,
                onroadNum,
                totalAmount,
                tokenName,
                totalSupply,
                isReIssuable,
                tokenSymbol,
                balance,
                fundFloat,
                decimals,
                owner,
                tokenId,
                icon,
                type,
                gateInfo
            };
        });
        // force vite first
        const viteId = constant.Vite_TokenId;
        return list
            .splice(list.findIndex(v => v.tokenId === viteId),
                1)
            .concat(list);
    },
    officalGateTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const mapToken2Gate = rootGetters.mapToken2Gate;
        const exBalance = rootGetters.exBalanceList;

        return Object.keys(mapToken2Gate)
            .map(i => {
                const {
                    index,
                    availableExAmount = '',
                    totalExAmount = '',
                    onroadNum = '',
                    tokenName = '',
                    totalAmount = '',
                    totalSupply = '',
                    isReIssuable = '',
                    tokenSymbol,
                    balance = '',
                    fundFloat = '',
                    decimals = '',
                    owner = '',
                    tokenId = i,
                    icon = getTokenIcon(i),
                    type = 'OFFICAL_GATE',
                    gateInfo = {}
                } = Object.assign({},
                    balanceInfo[i] || {},
                    allToken[i] || {},
                    { gateInfo: mapToken2Gate[i].gateInfo },
                    exBalance[i]);
                const rate
                    = rootState.exchangeRate.rateMap[i]
                    && rootState.exchangeRate.rateMap[i][
                        `${ rootState.env.currency }Rate`
                    ];
                const totalExAsset = rate
                    ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                        rate)
                    : 0;
                const walletAsset = rate
                    ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                        rate)
                    : 0;
                const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
                const rateBtc
                    = rootState.exchangeRate.rateMap[i]
                    && rootState.exchangeRate.rateMap[i]['btcRate'];
                const totalExAssetBtc = rateBtc
                    ? tokenSymbol === 'BTC'
                        ? bigNumber.toBasic(totalExAmount || 0, decimals)
                        : bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                            rateBtc)
                    : 0;
                const walletAssetBtc = rateBtc
                    ? tokenSymbol === 'BTC'
                        ? bigNumber.toBasic(totalAmount || 0, decimals)
                        : bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                            rateBtc)
                    : 0;
                const totalAssetBtc = bigNumber.plus(totalExAssetBtc,
                    walletAssetBtc);
                return {
                    totalExAssetBtc,
                    walletAssetBtc,
                    totalAssetBtc,
                    index,
                    totalAsset,
                    totalExAsset,
                    walletAsset,
                    availableExAmount,
                    totalExAmount,
                    onroadNum,
                    tokenName,
                    totalAmount,
                    totalSupply,
                    isReIssuable,
                    tokenSymbol,
                    balance,
                    fundFloat,
                    decimals,
                    owner,
                    tokenId,
                    icon,
                    type: tokenSymbol === 'VCP' && !index ? 'NATIVE' : type,
                    gateInfo
                };
            })
            .filter(item => !defaultTokenMap[item.tokenId]);
    },
    userStorageTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const exBalance = rootGetters.exBalanceList;
        const userStorageToken = rootGetters.storageTokensMap;

        // const mapToken2Gate = rootGetters.mapToken2Gate;
        // ------- show user defined gate
        gateStorage.updateFromStorage();
        const userStorageTokenList = gateStorage.data;
        const res = userStorageTokenList
            .map(token => {
                const i = token.tokenId;
                const {
                    index,
                    availableExAmount = '',
                    totalExAmount = '',
                    onroadNum = '',
                    tokenName = '',
                    totalAmount = '',
                    totalSupply = '',
                    isReIssuable = '',
                    tokenSymbol,
                    balance = '',
                    fundFloat = '',
                    decimals = '',
                    owner = '',
                    tokenId = i,
                    type = 'THIRD_GATE',
                    gateInfo = {}
                } = Object.assign({},
                    token,
                    balanceInfo[i] || {},
                    allToken[i] || {},
                    exBalance[i]);
                const rate
                    = rootState.exchangeRate.rateMap[i]
                    && rootState.exchangeRate.rateMap[i][
                        `${ rootState.env.currency }Rate`
                    ];
                const totalExAsset = rate
                    ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                        rate)
                    : 0;
                const walletAsset = rate
                    ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                        rate)
                    : 0;
                const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
                const rateBtc
                    = rootState.exchangeRate.rateMap[i]
                    && rootState.exchangeRate.rateMap[i]['btcRate'];
                const totalExAssetBtc = rateBtc
                    ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                        rateBtc)
                    : 0;
                const walletAssetBtc = rateBtc
                    ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                        rateBtc)
                    : 0;
                const totalAssetBtc = bigNumber.plus(totalExAssetBtc,
                    walletAssetBtc);
                let icon = getTokenIcon(i);
                for (const key in userStorageToken) {
                    if (
                        i === userStorageToken[key].tokenId
                        && userStorageToken[key].icon
                    ) {
                        icon = userStorageToken[key].icon;
                        break;
                    }
                }
                return {
                    totalExAssetBtc,
                    walletAssetBtc,
                    totalAssetBtc,
                    index,
                    totalAsset,
                    totalExAsset,
                    walletAsset,
                    availableExAmount,
                    totalExAmount,
                    onroadNum,
                    tokenName,
                    totalAmount,
                    totalSupply,
                    isReIssuable,
                    tokenSymbol,
                    balance,
                    fundFloat,
                    decimals,
                    owner,
                    tokenId,
                    icon,
                    type: tokenSymbol === 'VCP' && !index ? 'NATIVE' : type,
                    gateInfo
                };
            })
            .filter(t =>
                getters.officalGateTokenList
                    .map(t => t.tokenId)
                    .indexOf(t.tokenId) === -1);
        return res;
    },
    otherWhithBalance(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const mapToken2Gate = rootGetters.mapToken2Gate;
        const exBalance = rootGetters.exBalanceList;
        const contains = [
            ...getters.userStorageTokenList,
            ...getters.defaultTokenList,
            ...getters.officalGateTokenList
        ].map(t => t.tokenId);
        return Object.keys(allToken)
            .filter(i => {
                const walletAmount = getters.balanceInfo[i]
                    ? getters.balanceInfo[i].totalAmount
                    : 0;
                const exAmount = exBalance[i] ? exBalance[i].totalExAmount : 0;
                return (
                    (!bigNumber.isEqual(walletAmount, 0)
                        || !bigNumber.isEqual(exAmount, 0))
                    && contains.indexOf(i) === -1
                );
            })
            .map(i => {
                const {
                    index,
                    availableExAmount = '',
                    totalExAmount = '',
                    onroadNum = '',
                    tokenName = '',
                    totalAmount = '',
                    totalSupply = '',
                    isReIssuable = '',
                    tokenSymbol,
                    balance = '',
                    fundFloat = '',
                    decimals = '',
                    owner = '',
                    tokenId = i,
                    icon = getTokenIcon(i),
                    type = 'THIRD_GATE',
                    gateInfo = {}
                } = Object.assign({}, balanceInfo[i] || {}, allToken[i] || {}, { gateInfo: { url: mapToken2Gate[i] && mapToken2Gate[i].url } });
                const rate
                    = rootState.exchangeRate.rateMap[i]
                    && rootState.exchangeRate.rateMap[i][
                        `${ rootState.env.currency }Rate`
                    ];
                const totalExAsset = rate
                    ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                        rate)
                    : 0;
                const walletAsset = rate
                    ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                        rate)
                    : 0;
                const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
                const rateBtc
                    = rootState.exchangeRate.rateMap[i]
                    && rootState.exchangeRate.rateMap[i]['btcRate'];
                const totalExAssetBtc = rateBtc
                    ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals),
                        rateBtc)
                    : 0;
                const walletAssetBtc = rateBtc
                    ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals),
                        rateBtc)
                    : 0;
                const totalAssetBtc = bigNumber.plus(totalExAssetBtc,
                    walletAssetBtc);
                return {
                    totalExAssetBtc,
                    walletAssetBtc,
                    totalAssetBtc,
                    index,
                    totalAsset,
                    walletAsset,
                    totalExAmount,
                    availableExAmount,
                    totalExAsset,
                    onroadNum,
                    tokenName,
                    totalAmount,
                    totalSupply,
                    isReIssuable,
                    tokenSymbol,
                    balance,
                    fundFloat,
                    decimals,
                    owner,
                    tokenId,
                    icon,
                    type: tokenSymbol === 'VCP' && !index ? 'NATIVE' : type,
                    gateInfo
                };
            });
    },
    allTokenWithExAssets(state, getters, rootState, rootGetters) {
        return [
            ...getters.defaultTokenList,
            ...getters.userStorageTokenList,
            ...getters.otherWhithBalance,
            ...getters.officalGateTokenList
        ]
            .filter(t => t.tokenName)
            .reduce((pre, cur) => {
                return {
                    ...pre,
                    [cur.tokenId]: cur
                };
            }, {});
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
