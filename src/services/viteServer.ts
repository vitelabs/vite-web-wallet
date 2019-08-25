import { constant } from '@vite/vitejs';
import viteClient from 'utils/viteClient';

const DexFund_Addr = constant.DexFund_Addr;
const Snapshot_Gid = constant.Snapshot_Gid;

export function getCode(address: string) {
    // get my code
    return viteClient.request('dexfund_getInviterCode', address);
}

export function getInviteeCode(address: string) {
    // get who invited me
    return viteClient.request('dexfund_getInviteeCode', address);
}

export function getAccountDexBalance(address: string) {
    return viteClient.request('dexfund_getAccountFundInfo', address);
}

export function getAccountBalance(address: string) {
    return viteClient.getBalance(address);
}

export function getDexFundAddrOnroadInfo() {
    return viteClient.request('onroad_getOnroadInfoByAddress', DexFund_Addr);
}

export function isPledgeVip(address: string) {
    return viteClient.request('dexfund_isPledgeVip', address);
}

export function getMarketInfo(tradeToken: string, quoteToken: string) {
    return viteClient.request('dexfund_getMarketInfo', tradeToken, quoteToken);
}

export function getAgentMiningPledgeInfo(address: string) {
    return viteClient.request('pledge_getAgentPledgeInfo', {
        pledgeAddr: address,
        agentAddr: DexFund_Addr,
        beneficialAddr: DexFund_Addr,
        bid: 1
    });
}

export function getAgentVipPledgeInfo(address: string) {
    return viteClient.request('pledge_getAgentPledgeInfo', {
        pledgeAddr: address,
        agentAddr: DexFund_Addr,
        beneficialAddr: DexFund_Addr,
        bid: 2
    });
}

export function getCurrDividendPools() {
    return viteClient.request('dexfund_getCurrentDividendPools');
}

export function getSnapshotChainHeight() {
    return viteClient.ledger.getSnapshotChainHeight();
}

export function getTokenInfoById(tokenId: string) {
    return viteClient.mintage.getTokenInfoById(tokenId);
}

export function getSBPAvailableReward(name: string) {
    return viteClient.request('register_getAvailableReward', '00000000000000000001', name);
}

export function getTokenInfoList(pageIndex, pageCount) {
    return viteClient.mintage.getTokenInfoList(pageIndex, pageCount);
}

export function getCurrSBPNodeList() {
    return viteClient.register.getCandidateList(Snapshot_Gid);
}

export function getAccountQuota(address: string) {
    return viteClient.pledge.getPledgeQuota(address);
}

export function getAccountPledgeList(address, pageIndex, pageCount) {
    return viteClient.pledge.getPledgeList(address, pageIndex, pageCount);
}

export function getAccountSBPList(address: string) {
    return viteClient.register.getRegistrationList(Snapshot_Gid, address);
}

export function getAccountTxList({ address, pageIndex, pageCount }) {
    return viteClient.getTxList({
        addr: address,
        index: pageIndex,
        pageCount
    });
}
