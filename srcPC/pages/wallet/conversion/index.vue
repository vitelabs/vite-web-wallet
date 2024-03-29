<template>
    <div>
        <sec-title></sec-title>

        <div v-if="!loading">
            <div class='title'>
                <img src="~assets/imgs/eth_logo.svg"/>ETH
                <span class="record __pointer" @click="toRecord">{{ $t('walletConversion.record') }}</span>
            </div>

            <vite-address :title="$t('wallet.address')" :address="address"
                          :addressQrcode="'ethereum:' + address">
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
import openUrl from 'utils/openUrl';
import { Server } from 'services/dnsHostIP';
import { timer } from 'utils/asyncFlow';
import _ethWallet from 'pcUtils/ethWallet/index.js';
import secTitle from 'pcComponents/secTitle';
import loading from 'components/loading';
import viteAddress from './address';
import token from './token';
import transaction from './transaction';

const balanceTime = 2000;
let balanceInfoInst = null;

export default {
    components: { secTitle, viteAddress, token, transaction, loading },
    created() {
        const currHDAcc = this.$store.state.wallet.currHDAcc;
        const mnemonic = currHDAcc.mnemonic;
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

            addrList: [],
            isShowAddrList: false
        };
    },
    computed: {
        viteAddress() {
            return this.$store.getters.activeAddr;
        }
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
            openUrl(`${ Server.ethExplorer.url }/address/${ this.address }#tokentxns`);
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
    border-radius: 2px;
    @include bg_color_2();
    [data-theme="0"] & {
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
        border: 1px solid rgba(246, 245, 245, 1);
    }
}

.address-wrapper {
    font-size: 14px;
    word-break: break-all;
    width: 100%;
    [data-theme="0"] & {
        color: #283d4a;
    }
    [data-theme="1"] & {
        color: $white-color;
        border: 1px solid #1E2745;
    }

    .active-addr {
        position: relative;
        line-height: 20px;
        box-sizing: border-box;
        [data-theme="0"] & {
            background: #f3f6f9;
        }
        @include common_border();
        border-radius: 2px;
        padding: 10px;

        .slide {
            display: inline-block;
            position: absolute;
            top: 50%;
            right: 20px;
            width: 20px;
            height: 10px;
            margin-top: -4px;
            &.down {
                @include background_common_img("decend.svg");
            }

            &.up {
                @include background_common_img("ascend.svg");
            }
        }
    }

    .addr-list {
        line-height: 20px;
        border-top: none;
        padding: 8px 10px;
        text-align: left;
        @include common_border();
        [data-theme="0"] & {
            background: #fff;
        }
    }
}

.title {
    max-width: 548px;
    margin: 30px 0;
    font-size: 18px;
    line-height: 30px;
    @include font-family-bold();
    @include common_font_color();
    img {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-bottom: -8px;
        margin-right: 6px;
        background: #fff;
        border-radius: 30px;
        padding: 6px;
        box-sizing: border-box;
    }
    .record {
        float: right;
        [data-theme="0"] & {
            background: #edf1ff;
        }
        [data-theme="1"] & {
            background: #1E2745;
        }
        border-radius: 2px;
        padding: 0 12px;
        font-size: 14px;
        // color: #00BEFF;
        @include primary_color();
        &:active {
            // background: $blue-color-1;
            @include primary_bg_color();
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
