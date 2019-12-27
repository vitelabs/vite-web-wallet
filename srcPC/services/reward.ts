import { ViteXAPI } from 'services/apiServer';

export function getRewardPledgeFullStat({ address }) {
    return ViteXAPI.request({
        method: 'GET',
        path: 'reward/pledge/full/stat',
        params: { address }
    });
}

export function getRewardPledgeFullList({ address, offset, limit }) {
    return ViteXAPI.request({
        method: 'GET',
        path: 'reward/pledge/full/list',
        params: { address, offset, limit }
    });
}
