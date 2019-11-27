import { constant } from '@vite/vitejs';
import { viteClient } from './apiServer';

const DexFund_Addr = constant.DexFund_ContractAddress;

export function getCode(address: string) {
    // get my code
    return viteClient.request('dex_getInviteCode', address);
}

export function getInviteeCode(address: string) {
    // get who invited me
    return viteClient.request('dex_getInviteCodeBinding', address);
}

export function getAccountDexBalance(address: string) {
    return viteClient.request('dex_getAccountBalanceInfo', address);
}

export function getAccountBalance(address: string) {
    return viteClient.getBalanceInfo(address);
}

export function getDexFundAddrOnroadInfo() {
    return viteClient.request('ledger_getUnreceivedTransactionSummaryByAddress', DexFund_Addr);
}

export function isPledgeVip(address: string) {
    return viteClient.request('dex_hasStakedForVIP', address);
}

export function getMarketInfo(tradeToken: string, quoteToken: string) {
    return viteClient.request('dex_getMarketInfo', tradeToken, quoteToken);
}

export function getAgentMiningPledgeInfo(address: string, pageIndex, pageCount = 10) {
    return viteClient.request('dex_getMiningStakeInfoList', address, pageIndex, pageCount);
}

export function getAgentVipPledgeInfo(address: string) {
    return viteClient.request('dex_getStakedForVIP', address);
}

export function getCurrDividendPools() {
    return viteClient.request('dex_getDividendPoolsInfo');
}

export function getSnapshotChainHeight() {
    return viteClient.request('ledger_getSnapshotChainHeight');
}

export function getTokenInfoById(tokenId: string) {
    return viteClient.request('contract_getTokenInfoById', tokenId);
}

export function getSBPAvailableReward(name: string) {
    return viteClient.request('contract_getSBPRewardPendingWithdrawal', name);
}

export function getTokenInfoList(pageIndex, pageCount) {
    return viteClient.request('contract_getTokenInfoList', pageIndex, pageCount);
}

export function getCurrSBPNodeList() {
    return viteClient.request('contract_getSBPVoteList');
}

export function getAccountQuota(address: string) {
    return viteClient.request('contract_getQuotaByAccount', address);
}

export function getAccountPledgeList(address, pageIndex, pageCount) {
    return viteClient.request('contract_getStakeList', address, pageIndex, pageCount);
}

export function getAccountSBPList(address: string) {
    return viteClient.request('contract_getSBPList', address);
}

export function getAccountTxList({ address, pageIndex, pageCount }) {
    return viteClient.getTransactionList({
        address,
        pageIndex,
        pageSize: pageCount
    });
}

export function getSvipStatus(address:string) {
    return viteClient.request('dex_hasStakedForSVIP', address);
}

export function getCurrentVxMineInfo() {
    return viteClient.request('dex_getCurrentMiningInfo');
}

export function getCurrentFeesForMine() {
    return viteClient.request('dex_getCurrentFeesValidForMining');
}

export function getCurrentPledgeForVxSum() {
    return viteClient.request('dex_getCurrentStakingValidForMining');
}

export function getAllFeesOfAddress(address) {
    return viteClient.request('dex_getAllFeesOfAddress', address);
}

export function getMinThresholdForTradeAndMining() {
    return viteClient.request('dex_getMinThresholdForTradeAndMining');
}

export function getIsAutoLockMinedVx(address) {
    return viteClient.request('dex_isAutoLockMinedVx', address);
}

export function getVIPStakeInfoList(address, pageIndex, pageCount = 30) {
    return viteClient.request('dex_getVIPStakeInfoList', address, pageIndex, pageCount);
}

export function getVxUnlockList(address, pageIndex, pageCount = 10) {
    return viteClient.request('dex_getVxUnlockList', address, pageIndex, pageCount);
}
