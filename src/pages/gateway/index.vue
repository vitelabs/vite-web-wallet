<template>
    <div class="gateway-wrapper __wrapper">
        <sec-title></sec-title>

        <div class='title'> <img src="../../assets/imgs/eth_logo.svg"/>ETH </div>

        <vite-address :title="$t('account.address')" :address="address" :addressQrcode="'ethereum:' + address"></vite-address>

        <div class="token-list">
            <token v-for="(token, index) in tokenList" :key="index" 
                   :sendTx="showTrans" :token="token"></token>
        </div>
        
        <transaction v-show="!!transType" :closeTrans="hideTrans" :ethWallet="ethWallet"
                     :transType="transType" :token="tokenList[transToken]"></transaction>
    </div>
</template>

<script>
import { timer } from 'utils/asyncFlow';
import _ethWallet from 'utils/ethWallet/index.js';
import secTitle from 'components/secTitle';
import viteAddress from 'components/address';
import token from './token';
import transaction from './transaction';

const balanceTime = 2000;
let balanceInfoInst = null;

export default {
    components: {
        secTitle, viteAddress, token, transaction
    },
    created() {
        let activeAccount = this.$wallet.getActiveAccount();
        let mnemonic = activeAccount.getMnemonic();
        this.ethWallet = new _ethWallet({
            mnemonic
        });
        this.address = this.ethWallet.getDefaultAddr();
        this.viteAddress = activeAccount.getDefaultAddr();

        this.startLoopBalance();
    },
    destroyed() {
        this.stopLoopBalance();
        this.ethWallet.destroyed();
    },
    data() {
        return {
            transType: '',
            transToken: '',

            tokenList: {},
            ethWallet: null,
            address: '',
            viteAddress: '',
        };
    },
    methods: {
        showTrans(type, tokenName) {
            this.transType = type;
            this.transToken = tokenName;
        },
        hideTrans() {
            this.transType = '';
            this.transToken = '';
        },
        
        startLoopBalance() {
            this.stopLoopBalance();

            this.getBalance();
            balanceInfoInst = new timer(()=>{
                return this.getBalance();
            }, balanceTime);
            balanceInfoInst.start();
        },
        stopLoopBalance() {
            balanceInfoInst && balanceInfoInst.stop();
            balanceInfoInst = null;
        },

        getBalance() {
            this.tokenList = this.ethWallet.tokenList;
            return Promise.resolve(this.balance);
        }
    }
};
</script>
    
<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.addr-wrapper {
    padding: 30px;
    box-sizing: border-box;
    width: 100%;
    max-width: 548px;
    background:rgba(255,255,255,1);
    box-shadow: 0px 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    border: 1px solid rgba(246,245,245,1);
}
.title {
    img {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-bottom: -8px;
        margin-right: 6px;
    }
    margin: 30px 0;
    font-size: 18px;
    font-family: $font-bold, arial, sans-serif;
    font-weight: 600;
    color: rgba(29,32,36,1);
    line-height: 30px;
}
.token-list {
    display: flex;
}
</style>
