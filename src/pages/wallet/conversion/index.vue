<template>
    <div class="__wrapper">
        <sec-title></sec-title>

        <div v-if="!loading">
            <div class='title'>
                <img src="~assets/imgs/eth_logo.svg"/>ETH
                <span class="record __pointer" @click="toRecord">{{ $t('walletConversion.record') }}</span>
            </div>

            <vite-address :title="$t('wallet.address')" :address="address"
                          :showAddrContent="false" :addressQrcode="'ethereum:' + address">
                <div class="address-wrapper" v-click-outside="hideAddrList">
                    <div class="active-addr __pointer" @click="showAddrList">
                        {{ address }}
                        <span v-show="addrList && addrList.length" :class="{
                            'slide': true,
                            'down': !isShowAddrList,
                            'up': isShowAddrList
                        }"></span>
                    </div>
                    <ul v-show="addrList && addrList.length && isShowAddrList"
                        class="addr-list __pointer">
                        <li v-for="(addr, index) in addrList" :key="index"
                            @click="changeActiveAddr(addr)" v-show="addr.hexAddr !== address">
                            {{ addr.hexAddr }}
                        </li>
                    </ul>
                </div>
            </vite-address>

            <div class="token-list">
                <token v-for="(token, index) in tokenList" :key="index"
                       :sendTx="showTrans" :token="token" :ethToken="tokenList.eth"></token>
            </div>

            <div class="note">{{ $t('walletConversion.note') }}</div>

            <transaction v-if="!!transType" :closeTrans="hideTrans" :ethWallet="ethWallet"
                         :transType="transType" :token="tokenList[transToken]"></transaction>
        </div>

        <loading v-else class="loading"></loading>
    </div>
</template>

<script>
import { timer } from 'utils/asyncFlow';
import _ethWallet from 'utils/ethWallet/index.js';
import secTitle from 'components/secTitle';
import viteAddress from 'components/address';
import loading from 'components/loading';
import token from './token';
import transaction from './transaction';

const balanceTime = 2000;
let balanceInfoInst = null;

export default {
    components: { secTitle, viteAddress, token, transaction, loading },
    created() {
        const activeAccount = this.$wallet.getActiveAccount();
        this.viteAddress = activeAccount.getDefaultAddr();
        const mnemonic = activeAccount.getMnemonic();
        this.ethWallet = new _ethWallet({ mnemonic });
        this.ethWallet.init(() => {
            this.loading = false;
        });
    },
    destroyed() {
        this.stopLoopBalance();
        this.ethWallet.destroyed();
    },
    data() {
        return {
            loading: true,

            transType: '',
            transToken: '',

            tokenList: {},
            ethWallet: null,
            address: '',
            viteAddress: '',

            addrList: [],
            isShowAddrList: false
        };
    },
    watch: {
        loading: function () {
            this.address = this.ethWallet.getDefaultAddr();
            this.startLoopBalance();
            if (this.ethWallet.addrNum > 1) {
                this.addrList.push(this.ethWallet.addrObj);
                this.addrList.push(this.ethWallet.wrongAddrObj);
            }
        }
    },
    methods: {
        changeActiveAddr(addr) {
            this.ethWallet.changeActiveAddr(addr);
            this.address = this.ethWallet.getDefaultAddr();
            this.hideAddrList();
        },
        showAddrList() {
            this.isShowAddrList = !this.isShowAddrList;
        },
        hideAddrList() {
            this.isShowAddrList = false;
        },

        showTrans(type, tokenName) {
            this.transType = type;
            this.transToken = tokenName;
        },
        hideTrans() {
            this.transType = '';
            this.transToken = '';
        },
        toRecord() {
            window.open(`${ process.env.ethNet }/address/${ this.address }#tokentxns`);
        },

        startLoopBalance() {
            this.stopLoopBalance();

            this.getBalance();
            balanceInfoInst = new timer(() => this.getBalance(), balanceTime);
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

.loading {
    width: 60px;
    height: 60px;
}

.addr-wrapper {
    padding: 30px;
    box-sizing: border-box;
    width: 100%;
    max-width: 548px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
    border: 1px solid rgba(246, 245, 245, 1);
}

.address-wrapper {
    font-size: 14px;
    word-break: break-all;
    width: 100%;
    color: #283d4a;

    .active-addr {
        position: relative;
        line-height: 20px;
        box-sizing: border-box;
        background: #f3f6f9;
        border: 1px solid #d4dee7;
        border-radius: 2px;
        padding: 10px;

        .slide {
            display: inline-block;
            position: absolute;
            top: 50%;
            right: 20px;
            width: 16px;
            height: 16px;
            margin-top: -6px;

            &.down {
                background: url('~assets/imgs/down_icon.svg');
                background-size: 16px 16px;
            }

            &.up {
                background: url('~assets/imgs/up_icon.svg');
                background-size: 16px 16px;
            }
        }
    }

    .addr-list {
        line-height: 20px;
        border: 1px solid #d4dee7;
        border-top: none;
        padding: 8px 10px;
        text-align: left;
        background: #fff;
    }
}

.title {
    max-width: 548px;
    margin: 30px 0;
    font-size: 18px;
    font-family: $font-bold, arial, sans-serif;
    font-weight: 600;
    color: rgba(29, 32, 36, 1);

    img {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-bottom: -8px;
        margin-right: 6px;
    }

    line-height: 30px;

    .record {
        float: right;
        background: #edf1ff;
        border-radius: 2px;
        padding: 0 12px;
        font-size: 14px;
        color: #007aff;

        &:active {
            background: #007aff;
            color: #edf1ff;
        }
    }
}

.token-list {
    display: flex;
    max-width: 548px;
    justify-content: space-between;
}

.note {
    box-sizing: border-box;
    margin-top: 48px;
    max-width: 548px;
    border-radius: 2px;
    padding: 20px 30px;
    font-size: 12px;
    background: rgba(237, 241, 255, 1);
    font-weight: 400;
    color: rgba(94, 104, 117, 1);
    line-height: 17px;
    word-wrap: break-word;
}
</style>
