<template>
    <div class="token-card">
        <div class="col title click-able" @click="showDetail()">
            <div>
                <img :src="token.icon" class="icon " />
                <span class="token-name underline" @click="showDetail()">{{
                    token.tokenSymbol
                }}</span>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col click-able">
            <div>
                {{ `${token.balance || 0} ${token.tokenSymbol}` }}
            </div>
            <div class="op_group">
                <div class="op">转账</div>
                <div class="op">充币到交易所</div>
            </div>
        </div>
        <div class="col">
            {{ `${token.fundFloat || "--"} ${token.tokenSymbol}` }}
        </div>
        <div class="col">
            <div class="underline">
                {{ token.gateInfo.gateway || "添加网关" }}
            </div>
            <div class="op_group">
                <div class="op">跨链充值</div>
                <div class="op">跨链提现</div>
                <div class="op readonly">跨链充提记录</div>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col">
            {{ `${exBanlance || "--"} ${token.tokenSymbol}` }}
        </div>
        <div class="col">
            <div>
                {{ `${avaliableExBalance || "--"} ${token.tokenSymbol}` }}
            </div>
            <div class="op_group">
                <div class="op">提现至钱包</div>
                <div class="op readonly">交易所充提记录</div>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col">
            <div class="assets">
                <div class="est_btc">{{ assetView.btc }}</div>
                <div class="est_cash">≈{{ assetView.cash }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    receiveDialog,
    chargeDialog,
    withdrawDialog,
    tokenInfoDialog
} from '../dialog';
import getTokenIcon from 'utils/getTokenIcon';
import bigNumber from 'utils/bigNumber';
import { gateStorage } from 'services/gate';
import transaction from '../transaction';

export default {
    components: { transaction },
    props: {
        token: {
            type: Object,
            default: () => {
                return {
                    tokenSymbol: '--',
                    balance: '--',
                    asset: '--',
                    onroadNum: '--',
                    type: 'OFFICAL_GATE'
                };
            }
        }
    },
    data() {
        return { isShowTrans: false, assetType: 'TOTAL' };
    },
    computed: {
        showUnbind() {
            return (
                this.token.type === 'THIRD_GATE'
                && (!this.token.totalAmount
                    || bigNumber.isEqual(this.token.totalAmount, '0'))
            );
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        gateName() {
            if (this.$store.getters.mapToken2Gate[this.token.tokenId]) {
                return this.$store.getters.mapToken2Gate[this.token.tokenId]
                    .gateway;
            }
            return this.$t('tokenCard.gateInfo.selfdefined');
        },
        exBanlance() {
            return bigNumber.toBasic(this.token.totalExAmount,
                this.token.decimals);
        },
        avaliableExBalance() {
            return bigNumber.toBasic(this.token.avaliableExAmount,
                this.token.decimals);
        },
        asset() {
            const currency = this.$store.state.env.currency;
            const rate = this.$store.state.exchangeRate.rateMap[
                this.token.tokenId
            ];
            if (rate && this.token.balance) {
                return `${ currency === 'en' ? '$' : '¥' } ${ bigNumber.multi(this.token.balance,
                    rate[currency]) }`;
            }
            return '--';
        },
        exAsset() {
            const currency = this.$store.state.env.currency;
            const rate = this.$store.state.exchangeRate.rateMap[
                this.token.tokenId
            ];
            if (rate && this.token.totalExAmount) {
                return `${ currency === 'en' ? '$' : '¥' } ${ bigNumber.multi(bigNumber.toBasic(this.token.totalExAmount,
                    this.token.decimals),
                rate[currency]) }`;
            }
            return '--';
        },
        assetView() {
            if (this.assetType === 'TOTAL') {
                return { btc: this.asset, cash: this.asset };
            }
            if (this.assetType === 'EX') {
                return { btc: this.exAsset, cash: this.exAsset };
            }
            if (this.assetType === 'WALLET') {
                return { btc: this.asset, cash: this.asset };
            }
        }
    },
    methods: {
        unbind() {
            gateStorage.unbindToken(this.token.tokenId);
        },
        getIcon(id) {
            return getTokenIcon(id);
        },
        receive() {
            receiveDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        },
        charge() {
            chargeDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        },
        withdraw() {
            withdrawDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        },
        showDetail(initTabName) {
            tokenInfoDialog({ token: this.token, initTabName }).catch(e => {
                console.error(e);
            });
        },
        send() {
            console.log(this.token);
            if (!this.token.tokenId) {
                return;
            }
            this.isShowTrans = true;
        },
        closeTrans() {
            this.isShowTrans = false;
        }
    }
};
</script>

<style lang='scss' scoped>
@import "~assets/scss/vars.scss";
@import "./colWidth.scss";

.token-card {
    box-sizing: border-box;
    position: relative;
    background: #fff;
    display: flex;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid #c6cbd4;
    height: 71px;
    &:last-child {
        border: none;
    }
    .click-able {
        cursor: pointer;
    }
    .col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding: 7px 36px 7px 40px;
        color: #5e6875;
        font-size: 12px;
        align-self: stretch;
        position: relative;
        @include colWidth;
        .underline {
            border-bottom: 1px dotted #5e6875;
        }
        .separate {
            border-right: 1px solid #d3dfef;
            height: 52px;
            position: absolute;
            right: 0;
        }
        .op_group {
            display: flex;
            .op {
                background: rgba(0, 122, 255, 0.05);
                border-radius: 2px;
                border: 1px solid rgba(0, 122, 255, 0.3);
                line-height: 16px;
                cursor: pointer;
                color: #007aff;
                margin-right: 6px;
                padding: 2px;
                &.readonly {
                    color: #5e6875;
                    background: rgba(94, 104, 117, 0.05);
                    border: 1px solid rgba(94, 104, 117, 0.3);
                }
            }
        }
        .assets {
            display: flex;
            flex-direction: column;
            .est_cash {
                color: #5e687594;
                margin-top: 4px;
            }
        }
        &.title {
            font-family: $font-bold;
            color: #5e6875;
            .icon {
                height: 16px;
                width: 16px;
            }
        }
    }
}
</style>
