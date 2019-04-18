import { getClient } from 'utils/request';
import { accountBlock } from '@vite/vitejs';
import { wallet } from 'utils/wallet';
import rpcClient from 'utils/viteClient';
import { powProcess } from 'components/pow/index';
const VoteDifficulty = '201564160';

const client = getClient('/gateWay', x => {
    const { code } = JSON.parse(x.responseText);
    return code === 0;
});
export const getGateInfos = () => client({ path: 'certified_gateways' });

export const getChargeAddr = ({ tokenId, addr: walletAddress }) => client({ path: 'deposit_address', params: { tokenId, walletAddress } });

export const verifyAddr = ({ tokenId, withdrawAddress }) => client({ path: 'verify_withdraw_address', params: { tokenId, withdrawAddress } });

export const getWithdrawInfo = ({ tokenId, withdrawAddress }) => client({ path: 'withdraw_info', params: { tokenId, withdrawAddress } });

export const getWithdrawFee = ({ tokenId, withdrawAddress, amount }) => client({ path: 'withdraw_fee', params: { tokenId, withdrawAddress, amount } });

export const withdraw = async ({ amount, withdrawAddress, gateAddr, tokenId }) => {
    const account = wallet.activeAccount;
    const address = account.getDefaultAddr();
    const unlockAcc = account.account.unlockAcc;
    const accountBlockContent = await rpcClient.buildinTxBlock.sendTx.async({ toAddress: gateAddr, amount, accountAddress: address, tokenId });
    const signedBlock = accountBlock.signAccountBlock(accountBlockContent, unlockAcc.privateKey);

    // const res = await powProcess({
    //     signedBlock,
    //     difficulty: VoteDifficulty
    // });

    const rawTx = JSON.stringify(signedBlock);
    const signInfo = { rawTx, withdrawAddress };
    const signature = unlockAcc.sign(Buffer(JSON.stringify(signInfo)).toString('hex'));
    return await client({ method: 'post', path: 'withdraw', params: { rawTx, withdrawAddress, signature } });
};


window.testgate = { test: {} };

class testStruct {
    constructor({ tokenId, withdrawAddress }) {
        this.chargeAddr = '',
        this.withdrawInfo = null,
        this.withdrawFee = 0,
        this.gateInfos = null,
        this.tokenId = tokenId;
        this.withdrawAddress = withdrawAddress;
        this.amount = '500000000000000000';
    }

    get account() {
        return wallet.activeAccount;
    }

    get address() {
        return wallet.activeAccount.getDefaultAddr();
    }

    getGateInfos() {
        getGateInfos().then(data => {
            console.log(data);
        });
    }

    getChargeAddr() {
        getChargeAddr({ tokenId: this.tokenId, addr: this.address }).then(data => {
            this.chargeAddr = data;
            console.log(data);
        });
    }

    verifyAddr() {
        verifyAddr({ tokenId: this.tokenId, withdrawAddress: this.withdrawAddress }).then(data => console.log(data));
    }

    getWithdrawInfo() {
        getWithdrawInfo({ tokenId: this.tokenId, withdrawAddress: this.withdrawAddress }).then(data => {
            this.withdrawInfo = data;
            console.log(data);
        });
    }

    getWithdrawFee() {
        getWithdrawFee({ tokenId: this.tokenId, withdrawAddress: this.withdrawAddress, amount: this.amount }).then(data => {
            this.withdrawFee = data;
            console.log(data);
        });
    }

    withdraw(amount) {
        withdraw({ amount: amount || this.amount, withdrawAddress: this.withdrawAddress, gateAddr: this.withdrawInfo.gatewayAddress, tokenId: this.tokenId }).then(data => console.log(data));
    }
}

window.ethTest = new testStruct({ tokenId: 'tti_82b16ac306f0d98bf9ccf7e7', withdrawAddress: '0xdd50024B09B29549A14f8405fa9056a811E6F03F' });
window.btcText = new testStruct({ tokenId: 'tti_4e88a475c675971dab7ec917', withdrawAddress: 'muhJJ374MUF7sEUqn1WuYsnuJbGxoPCbRV' });
