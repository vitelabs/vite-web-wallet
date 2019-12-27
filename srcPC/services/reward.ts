import { RewardAPI } from 'services/apiServer';

export function getRewardPledgeFullStat({ address }) {
    return RewardAPI.request({
        method: 'GET',
        path: 'reward/pledge/full/stat',
        params: { address }
    });
}

export function getRewardPledgeFullList({ address, offset, limit }) {
    return RewardAPI.request({
        method: 'GET',
        path: 'reward/pledge/full/list',
        params: { address, offset, limit }
    });
}
