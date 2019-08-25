import { getClient } from 'utils/request';
import viteClient from 'utils/viteClient';

const version = 'v1';
const path = `${ process.env.dexApiServer }${ version }`;

const request = getClient(path);

interface IInviterInfo {
  miningTotal: bnStr;
  inviteCount: number;
  inviteCode: number;
  inviteeList: string[];
  inviteeInfo: {
    inviteCode: number;
    inviter: string;
  };
}
export function getInviteInfo(address: string): Promise<IInviterInfo> {
    return request({ method: 'GET', path: 'inviter', params: { address } });
}

interface IInviteMiningDetail {
    miningTotal: string;
    total: string;
    miningList: [
        {
            date: number;
            feeAmount: string;
            miningToken: string;
            miningAmount: string;
            status: number;
        }
    ];
}
export function getInviteMiningDetail({
    address,
    offset,
    limit
}): Promise<IInviteMiningDetail> {
    return request({
        method: 'GET',
        path: 'mining/invite',
        params: { address, offset, limit }
    });
}

interface IOrderMiningDetail {
  miningTotal: string;
  total: string;
  miningList: [
    {
      date: number;
      miningAmount: string;
      miningRatio: string;
    }
  ];
}
export function getOrderMiningDetail({
    address,
    offset,
    limit
}): Promise<IOrderMiningDetail> {
    return request({
        method: 'GET',
        path: 'mining/order/address',
        params: { address, offset, limit }
    });
}

export function getCode(address: string) {
    // get my code
    return viteClient.request('dexfund_getInviterCode', address);
}

export function getInviteeCode(address: string) {
    // get who invited me
    return viteClient.request('dexfund_getInviteeCode', address);
}
