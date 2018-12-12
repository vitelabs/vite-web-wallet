<template>
    <div class="gateway-wrapper __wrapper">
        <sec-title></sec-title>
        <div class='title'> <img src="../../assets/imgs/eth_logo.svg"/>ETH </div>
        <vite-address :title="$t('accDetail.address')" :address="address"></vite-address>
        <div class="token-list">
            <token tokenName="VITE" :sendTx="showTrans" :balance="showBalance.vite"></token>
            <token tokenName="ETH" :sendTx="showTrans" :balance="showBalance.eth"></token>
        </div>
        <div v-show="showTransType" class="trans-wrapper">
            <transaction v-click-outside="hideTrans"></transaction>
        </div>
    </div>
</template>

<script>
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bignumber';
import _ethWallet from 'utils/ethWallet/index.js';
import secTitle from 'components/secTitle';
import viteAddress from 'components/address';
import token from './token';
import transaction from './transaction';

// const minGwei = 3;
// const maxGwei = 99;
// const defaultGwei = 41;
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
            showTransType: '',
            balance: null,
            ethWallet: null,
            address: '',
            viteAddress: '',
        };
    },
    computed: {
        showBalance() {
            if (!this.balance) {
                return {
                    vite: 0,
                    eth: 0
                };
            }

            let vite = this.balance.vite.balance || 0;
            let eth = this.balance.eth.balance  || 0;
            let showVite = BigNumber.toBasic(vite, this.balance.vite.decimals);
            let showEth = BigNumber.toBasic(eth, this.balance.eth.decimals);

            return {
                vite: showVite,
                eth: showEth
            };
        }
    },
    methods: {
        showTrans(type) {
            this.showTransType = type;
        },
        hideTrans() {
            this.showTransType = '';
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
            this.balance = this.ethWallet.getBalance();
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
.trans-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
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
