<template>
    <div class="token-card">
        <div class="col title click-able " @click="showDetail()">
            <div>
                <img :src="token.icon" class="icon " />
                <span class="token-name" @click="showDetail()">{{
                    token.tokenSymbol
                }}</span>
            </div>
        </div>
        <div class="separate"></div>
        <div class="col click-able" @click="showDetail()">
            <div>
                {{ `${token.balance || 0}${token.tokenSymbol}` }}
            </div>
            <div class="op_group">
                <div class="op">转账</div>
                <div class="op">充币到交易所</div>
            </div>
        </div>
        <div class="col">
            {{ `1000  Vite` }}
        </div>
        <div class="col">
            <div>
                vGate
            </div>
            <div class="op_group">
                <div class="op">跨链充值</div>
                <div class="op">跨链提现</div>
                <div class="op readonly">跨链充提记录</div>
            </div>
        </div>
        <div class="separate"></div>
        <div class="col">32412341 VITE</div>
        <div class="col">
            <div>
                32412341 VITE
            </div>
            <div class="op_group">
                <div class="op">提现至钱包</div>
                <div class="op readonly">交易所充提记录</div>
            </div>
        </div>
        <div class="separate"></div>
        <div class="col">
            <div class="assets">
                <div class="est_btc">32412341 VITE</div>
                <div class="est_cash">≈32412341 CNY</div>
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
                    symbol: '--',
                    balance: '--',
                    asset: '--',
                    onroadNum: '--',
                    type: 'OFFICAL_GATE' // OFFICAL OFFICALGATE SELFGATE
                };
            }
        }
    },
    data() {
        return { isShowTrans: false };
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
        asset() {
            const currency = this.$store.state.env.currency;
            const rate = this.$store.state.exchangeRate.rateMap[
                this.token.tokenId
            ];
            if (rate && this.token.balance) {
                return `${
                    this.$i18n.locale === 'en' ? '$' : '¥'
                } ${ bigNumber.multi(this.token.balance, rate[currency]) }`;
            }
            return '--';
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

.token-card {
    box-sizing: border-box;
    position: relative;
    background: #fff;
    display: flex;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid #c6cbd4;
    height: 71px;
    &:last-child{
        border: none;
    }
    .click-able {
        cursor: pointer;
    }
    .separate {
        height: 54px;
        border-right: 1px solid #d3dfef;
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
        .assets{
            display: flex;
            flex-direction: column;
            .est_cash{
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
