<template>
    <div class="token-card">
        <div class="token-meta" @click="showDetail">
            <img :src="token.icon" class="icon"/>{{ getTokenSymbolString(token.tokenSymbol, token.index) }}
        </div>
        <div class="col">
            <span>{{ $t('tokenCard.heads.balance') }}</span>
            <span>{{ token.balance || 0 }}</span>
        </div>
        <div class="col">
            <span>{{ $t('tokenCard.heads.totalExAmount') }}</span>
            <span>{{ exBanlance || 0 }}</span>
        </div>
        <div class="col">
            <span>{{ $t('tokenCard.heads.availableExAmount') }}</span>
            <span>{{ avaliableExBalance || 0 }}</span>
        </div>
        <div class="op_group">
            <div class="op __pointer" @click="exCharge">{{ $t("tokenCard.actionType.EXCHARGE") }}</div>
            <div class="op __pointer" @click="exWithdraw">{{ $t("tokenCard.actionType.EXWITHDRAW") }}</div>
        </div>
    </div>
</template>

<script>
import { tokenInfoDialog, exWithdrawDialog, exChargeDialog } from './dialog';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { getTokenSymbolString } from 'utils/tokenParser';

export default {
    props: {
        token: {
            type: Object,
            default: () => {
                return {
                    tokenSymbol: '--',
                    balance: 0,
                    asset: 0,
                    onroadNum: 0,
                    type: 'OFFICAL_GATE'
                };
            }
        }
    },
    computed: {
        currencySymbol() {
            return this.$store.getters.currencySymbol;
        },
        exBanlance() {
            return (
                this.token.totalExAmount
                && bigNumber.toBasic(this.token.totalExAmount, this.token.decimals)
            );
        },
        avaliableExBalance() {
            return (
                this.token.availableExAmount
                && bigNumber.toBasic(this.token.availableExAmount,
                    this.token.decimals)
            );
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        getTokenSymbolString(...args) {
            return getTokenSymbolString(...args);
        },
        showDetail() {
            tokenInfoDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        },
        exCharge() {
            statistics.event(this.$route.name, 'exchange-deposit', this.address || '');
            exChargeDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        },
        exWithdraw() {
            statistics.event(this.$route.name, 'exchange-withdraw', this.address || '');
            exWithdrawDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        }
    }
};
</script>

<style lang='scss' scoped>
@import "~h5Assets/scss/vars.scss";

.token-card {
    padding: 12px 0 9px;
    box-sizing: border-box;
    position: relative;
    background: #fff;
    border-bottom: 1px solid rgba(211,223,239,1);
    @include font-normal();
    font-family: $font;

    .token-meta {
        margin-bottom: 12px;
        line-height: 20px;
        font-size: 16px;
        @include font-bold();
        color: rgba(36,39,43,1);
        .icon {
            height: 20px;
            width: 20px;
            margin-right: 10px;
            border-radius: 50%;
            box-sizing: border-box;
            border: 1px solid rgba(212,222,231,1);
            margin-bottom: -4px;
        }
    }

    .col {
        margin-bottom: 12px;
        display: flex;
        span {
            line-height: 16px;
            flex: 1;
            font-size: 12px;
            @include font-bold();
            color: rgba(36,39,43,1);
            text-align: right;
            &:first-child {
                text-align: left;
                font-weight: 400;
                color: rgba(62,74,89,0.6);
            }
        }
    }
    .op_group {
        display: flex;
        .op {
            box-sizing: border-box;
            background: rgba(0,122,255,0.05);
            border-radius: 2px;
            border: 1px solid rgba(0,122,255,0.3);
            word-break: keep-all;
            line-height: 26px;
            color: $blue;
            flex: 1;
            text-align: center;
            font-size: 14px;
            @include font-bold();
            &:first-child {
                margin-right: 25px;
            }
        }
    }
}
</style>
