import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { StatusMap } from 'wallet';
import { defaultTokenMap } from 'utils/constant';
import { gateStorage } from 'services/gate';
import { constant } from '@vite/vitejs';
import { getTokenIcon } from 'utils/tokenParser';

let balanceInfoInst = null;

const state = {
    onroad: { balanceInfos: {} },
    balance: { balanceInfos: {} }
};

const mutations = {
    commitBalanceInfo(state, payload) {
        if (!payload) {
            state.balance = { balanceInfos: {} };
            state.onroad = { balanceInfos: {} };
            return;
        }

        state.balance = payload.balance || {};
        state.balance.balanceInfos = state.balance && state.balance.tokenBalanceInfoMap
            ? state.balance.tokenBalanceInfoMap
            : {};

        state.onroad = payload.onroad || {};
        state.onroad.balanceInfos = state.onroad && state.onroad.tokenBalanceInfoMap
            ? state.onroad.tokenBalanceInfoMap
            : {};
    },
    commitClearBalance(state) {
        state.balance = { balanceInfos: {} };
        state.onroad = { balanceInfos: {} };
    }
};
const actions = {
    startLoopBalance({
        commit,
        dispatch,
        rootState
    }) {
        dispatch('stopLoopBalance');
        balanceInfoInst = new timer(() => {
            const activeAcc = rootState.wallet.activeAcc;
            if (!activeAcc) {
                return;
            }

            if (rootState.wallet.status === StatusMap.UNLOCK && !activeAcc.isBifrost) {
                return commit('commitBalanceInfo', activeAcc.balance);
            }

            return activeAcc.getBalance().then(data => {
                commit('commitBalanceInfo', data);
            });
        }, 1000);
        balanceInfoInst.start();
    },
    stopLoopBalance() {
        balanceInfoInst && balanceInfoInst.stop();
        balanceInfoInst = null;
    }
};

const getters = {
    balanceInfo(state) {
        // -------- merge balance & onroad
        const balanceInfo = Object.create(null);
        for (const tokenId in state.balance.balanceInfos) {
            const item = state.balance.balanceInfos[tokenId];

            const tokenInfo = item.tokenInfo;
            const decimals = tokenInfo.decimals;
            const balance = bigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = tokenInfo[tokenId] || {};
            balanceInfo[tokenId].tokenId = tokenId;
            balanceInfo[tokenId].balance = balance;
            balanceInfo[tokenId].decimals = decimals;
            balanceInfo[tokenId].tokenSymbol = tokenInfo.tokenSymbol;
            balanceInfo[tokenId].transNum = item.number;
            balanceInfo[tokenId].totalAmount = item.totalAmount;
        }

        for (const tokenId in state.onroad.balanceInfos) {
            const item = state.onroad.balanceInfos[tokenId];

            const tokenInfo = item.tokenInfo;
            const decimals = tokenInfo.decimals;
            const balance = bigNumber.toBasic(item.totalAmount, decimals);

            balanceInfo[tokenId] = balanceInfo[tokenId] || {};
            balanceInfo[tokenId].tokenId = balanceInfo[tokenId].tokenId || tokenInfo.tokenId;
            balanceInfo[tokenId].fundFloat = balance;
            balanceInfo[tokenId].decimals = balanceInfo[tokenId].decimals || tokenInfo.decimals;
            balanceInfo[tokenId].tokenSymbol = balanceInfo[tokenId].tokenSymbol || tokenInfo.tokenSymbol;
            balanceInfo[tokenId].onroadNum = item.number;
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
                allToken[i] || {}, { gateInfo: { url: mapToken2Gate[i] && mapToken2Gate[i].url } },
                exBalance[i]);
            const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][`${ rootState.env.currency }Rate`];
            const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rate) : 0;
            const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rate) : 0;
            const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
            const rateBtc = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i]['btcRate'];
            const totalExAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rateBtc) : 0;
            const walletAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rateBtc) : 0;
            const totalAssetBtc = bigNumber.plus(totalExAssetBtc, walletAssetBtc);
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
            .splice(list.findIndex(v => v.tokenId === viteId), 1)
            .concat(list);
    },
    officalGateTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const mapToken2Gate = rootGetters.mapToken2Gate;
        const exBalance = rootGetters.exBalanceList;

        return Object.keys(mapToken2Gate).map(i => {
            // [TODO] ViteLabsGateInfo Fixed
            const viteLabsGateInfo = {};
            if (mapToken2Gate[i].gateway === 'Vite Labs') {
                viteLabsGateInfo.introduction = 'Vite Labs官方网关，负责BTC、ETH、USDT(ERC20)、GRIN四种代币跨链服务';
                viteLabsGateInfo.introductionEn = 'The gateway provided by Vite Labs, running cross-chain services for four coins: BTC, ETH, USDT(ERC20), GRIN';
                viteLabsGateInfo.offical = 'https://vite.org';
                viteLabsGateInfo.customer = 'https://vitex.zendesk.com/hc/zh-cn/requests/new',
                viteLabsGateInfo.customerEn = 'https://vitex.zendesk.com/hc/en-001/requests/new',
                viteLabsGateInfo.privacy = `${ location.origin }/privacy.html`;
            } else if (mapToken2Gate[i].gateway === 'VGATE') {
                viteLabsGateInfo.introduction = 'As an operator of ViteX, VGATE is responsible for listing coins, deposit and withdrawal, cryptocurrency marketing and promoting and other services within VGATE\'s own marketing area. VGATE has complete capabilities as an operator, namely the capabilities of operating VGATE and its cryptos. In addition to helping users list cryptos, deposit and withdraw, and adjust transaction fees, VGATE can also mint coins, help other operators mint coins and run their gateways.',
                viteLabsGateInfo.introductionEn = 'As an operator of ViteX, VGATE is responsible for listing coins, deposit and withdrawal, cryptocurrency marketing and promoting and other services within VGATE\'s own marketing area. VGATE has complete capabilities as an operator, namely the capabilities of operating VGATE and its cryptos. In addition to helping users list cryptos, deposit and withdraw, and adjust transaction fees, VGATE can also mint coins, help other operators mint coins and run their gateways.',
                viteLabsGateInfo.offical = 'https://vgate.io/';
                viteLabsGateInfo.customer = 'vgateservice@gmail.com',
                viteLabsGateInfo.customerEn = 'vgateservice@gmail.com',
                viteLabsGateInfo.privacy = 'https://vgate.io/clause';
            } else if (mapToken2Gate[i].gateway === 'Bi23') {
                viteLabsGateInfo.introduction = 'Bi23团队致力于为Vite公链社区用户提供安全、快捷的跨链服务，目前已支持三种代币: ATOM（Cosmos）、IRIS（IRISnet）、XTZ（Tezos）等跨链服务',
                viteLabsGateInfo.introductionEn = 'The gateway provided by Bi23.com , running cross-chain services for three coins: ATOM(Cosmos),IRIS(IRISnet),XTZ(Tezos)',
                viteLabsGateInfo.offical = 'https://bi23.com';
                viteLabsGateInfo.customer = 'support@bi23.com',
                viteLabsGateInfo.customerEn = 'support@bi23.com',
                viteLabsGateInfo.privacy = 'https://bi23.com/privacy.html';
            } else if (mapToken2Gate[i].gateway === 'XS_Fund') {
                viteLabsGateInfo.introduction = 'XS_Fund, as the gateway for the operation of ViteX exchange, has good credit and complete operation capability. Services include listing coins, coin mintae, deposit, withdraw, cross-chain services, while accepting operator cooperation and supporting technology transfer services.',
                viteLabsGateInfo.introductionEn = 'XS_Fund, as the gateway for the operation of ViteX exchange, has good credit and complete operation capability. Services include listing coins, coin mintae, deposit, withdraw, cross-chain services, while accepting operator cooperation and supporting technology transfer services.',
                viteLabsGateInfo.offical = 'https://xinsheng.71an.com/lrc/';
                viteLabsGateInfo.customer = 'XS_Fund@163.com',
                viteLabsGateInfo.customerEn = 'XS_Fund@163.com',
                viteLabsGateInfo.privacy = 'https://forum.vite.net/topic/2610/xsfund-gateway-service-agreement/';
            }

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
            } = Object.assign({}, balanceInfo[i] || {}, allToken[i] || {}, {
                gateInfo: {
                    url: mapToken2Gate[i].url,
                    gateway: mapToken2Gate[i].gateway,
                    ...viteLabsGateInfo
                }
            }, exBalance[i]);
            const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][`${ rootState.env.currency }Rate`];
            const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rate) : 0;
            const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rate) : 0;
            const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
            const rateBtc = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i]['btcRate'];
            const totalExAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rateBtc) : 0;
            const walletAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rateBtc) : 0;
            const totalAssetBtc = bigNumber.plus(totalExAssetBtc, walletAssetBtc);
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
                type: (tokenSymbol === 'VCP' && !index) ? 'NATIVE' : type,
                gateInfo
            };
        });
    },
    userStorageTokenList(state, getters, rootState, rootGetters) {
        const balanceInfo = getters.balanceInfo;
        const allToken = rootGetters.allTokensMap;
        const exBalance = rootGetters.exBalanceList;

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
                    icon = getTokenIcon(i),
                    type = 'THIRD_GATE',
                    gateInfo = {}
                } = Object.assign({}, token, balanceInfo[i] || {}, allToken[i] || {}, exBalance[i]);
                const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][`${ rootState.env.currency }Rate`];
                const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rate) : 0;
                const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rate) : 0;
                const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
                const rateBtc = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i]['btcRate'];
                const totalExAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rateBtc) : 0;
                const walletAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rateBtc) : 0;
                const totalAssetBtc = bigNumber.plus(totalExAssetBtc, walletAssetBtc);
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
                    type: (tokenSymbol === 'VCP' && !index) ? 'NATIVE' : type,
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
                const walletAmount = getters.balanceInfo[i] ? getters.balanceInfo[i].totalAmount : 0;
                const exAmount = exBalance[i] ? exBalance[i].totalExAmount : 0;
                return (!bigNumber.isEqual(walletAmount, 0) || !bigNumber.isEqual(exAmount, 0)) && contains.indexOf(i) === -1;
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
                const rate = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i][`${ rootState.env.currency }Rate`];
                const totalExAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rate) : 0;
                const walletAsset = rate ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rate) : 0;
                const totalAsset = bigNumber.plus(totalExAsset, walletAsset);
                const rateBtc = rootState.exchangeRate.rateMap[i] && rootState.exchangeRate.rateMap[i]['btcRate'];
                const totalExAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalExAmount || 0, decimals), rateBtc) : 0;
                const walletAssetBtc = rateBtc ? bigNumber.multi(bigNumber.toBasic(totalAmount || 0, decimals), rateBtc) : 0;
                const totalAssetBtc = bigNumber.plus(totalExAssetBtc, walletAssetBtc);
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
                    type: (tokenSymbol === 'VCP' && !index) ? 'NATIVE' : type,
                    gateInfo
                };
            });
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};
