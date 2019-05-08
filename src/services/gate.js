import { getClient } from 'utils/request';
import { accountBlock } from '@vite/vitejs';
import { wallet } from 'utils/wallet';
import rpcClient from 'utils/viteClient';
import { addrSpace } from 'utils/storageSpace';
import { purePow } from 'components/pow';

const STORAGEKEY = 'INDEX_COLLECT_TOKEN';
// import { powProcess } from 'components/pow/index';
// const VoteDifficulty = '201564160';

const client = getClient('', xhr => {
    if (xhr.status === 200) {
        const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);
        if (code !== 0) {
            return Promise.reject({
                code,
                subCode,
                message: msg || error
            });
        }
        return Promise.resolve(data || null);
    }
    return Promise.reject(xhr.responseText);
});
export const getGateInfos = () =>
    client({ path: 'certified_gateways', host: process.env.gatewayInfosServer });

export const getChargeAddr = ({ tokenId, addr: walletAddress }, url) =>
    client({
        path: 'deposit_address',
        params: { tokenId, walletAddress },
        host: url
    });

export const verifyAddr = ({ tokenId, withdrawAddress }, url) =>
    client({
        path: 'verify_withdraw_address',
        params: { tokenId, withdrawAddress },
        host: url
    });

export const getWithdrawInfo = ({ tokenId, walletAddress }, url) =>
    client({
        path: 'withdraw_info',
        params: { tokenId, walletAddress },
        host: url
    });

export const getWithdrawFee = ({ tokenId, walletAddress, amount, containsFee = false },
    url) =>
    client({
        path: 'withdraw_fee',
        params: { tokenId, walletAddress, amount, containsFee },
        host: url
    });

export const getChargeInfo = ({ tokenId, addr: walletAddress }, url) =>
    client({
        path: 'deposit_info',
        params: { tokenId, walletAddress },
        host: url
    });
export const withdraw = async (
    { amount, withdrawAddress, gateAddr, tokenId },
    url
) => {
    const account = wallet.activeAccount;
    const address = account.getDefaultAddr();
    const unlockAcc = account.account.unlockAcc;
    const accountBlockContent = await rpcClient.buildinTxBlock.sendTx.async({
        toAddress: gateAddr,
        amount,
        accountAddress: address,
        tokenId
    });
    const quota = await rpcClient.pledge.getPledgeQuota(address);
    if (quota.txNum < 1) {
    // eslint-disable-next-line no-unused-vars
        await purePow({ accountBlock: accountBlockContent });
    }

    const signedBlock = accountBlock.signAccountBlock(accountBlockContent,
        unlockAcc.privateKey);

    const rawTx = JSON.stringify(signedBlock);
    const signInfo = { rawTx, withdrawAddress };
    const signature = unlockAcc.sign(Buffer(JSON.stringify(signInfo)).toString('hex'));
    return await client({
        method: 'post',
        path: 'withdraw',
        params: { rawTx, withdrawAddress, signature },
        host: url
    });
};

export const getWithdrawRecords = ({ tokenId, walletAddress, geNum, pageSize },
    url) =>
    client({
        path: 'withdraw_records',
        params: { tokenId, walletAddress, geNum, pageSize },
        host: url
    });

export const getDepositRecords = ({ tokenId, walletAddress, geNum, pageSize },
    url) =>
    client({
        path: 'deposit_records',
        params: { tokenId, walletAddress, geNum, pageSize },
        host: url
    });
// data{tokenId:{symbol,url}}
class GateWays {
    constructor() {
        if (!Array.isArray(addrSpace.getItem(STORAGEKEY))) {
            addrSpace.setItem(STORAGEKEY, []);
        }
        this.updateFromStorage();
    }

    bindToken(tokenId, tokenInfo) {
        this.updateFromStorage();
        this.data = this.data.filter(t => t.tokenId !== tokenId);
        this.data.push({ tokenId, ...tokenInfo });
        this.saveToStorage();
    }

    bindTokens(tokens) {
        this.updateFromStorage();
        this.data = this.data.filter(t => tokens.map(n => n.tokenId).indexOf(t.tokenId) === -1); // 去掉data中已有的。
        this.data = this.data.concat(tokens);
        this.saveToStorage();
    }

    unbindToken(tokenId) {
        this.updateFromStorage();
        this.data = this.data.filter(v => v.tokenId !== tokenId);
        this.saveToStorage();
    }

    saveToStorage() {
        addrSpace.setItem(STORAGEKEY, this.data);
    }

    updateFromStorage() {
        const s = addrSpace.getItem(STORAGEKEY); // [{tokenId,gateInfo}]
        if (s) {
            this.data = s;
        } else {
            addrSpace.setItem(STORAGEKEY, []);
            this.data = [];
        }
    }
}

export const gateStorage = new GateWays();
