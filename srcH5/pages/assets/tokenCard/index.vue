<template>
    <div class="token-card">
        <div class="col title __pointer" @click="() => showDetail()">
            <div class="token-meta">
                <img :src="token.icon" class="icon"/>
                <div class="name-wrapper">
                    <div class="token-symbol">
                        {{ getTokenNameString(token.tokenSymbol, token.index) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="col">{{ `${token.balance || 0} ${token.tokenSymbol}` }}</div>
        <div class="col">{{ `${exBanlance || 0} ${token.tokenSymbol}` }}</div>
        <div class="col">
            <div>{{ `${avaliableExBalance || 0} ${token.tokenSymbol}` }}</div>
            <div class="op_group">
                <div class="op" @click="_exCharge">
                    {{ $t("tokenCard.actionType.EXCHARGE") }}
                </div>
                <div class="op" @click="_exWithdraw">
                    {{ $t("tokenCard.actionType.EXWITHDRAW") }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    tokenInfoDialog,
    exWithdrawDialog,
    exChargeDialog
} from '../dialog';
import statistics from 'utils/statistics';
import bigNumber from 'utils/bigNumber';
import { getTokenNameString } from 'utils/tokenParser';

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
        getTokenNameString(...args) {
            return getTokenNameString(...args);
        },
        showDetail(initTabName = 'tokenInfo') {
            statistics.event(this.$route.name, `tokenDialog-${ initTabName }`, this.address || '');

            tokenInfoDialog({ token: this.token, initTabName }).catch(e => {
                console.error(e);
            });
        },

        _exCharge() {
            statistics.event(this.$route.name, 'exchange-deposit', this.address || '');
            exChargeDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        },
        _exWithdraw() {
            statistics.event(this.$route.name, 'exchange-withdraw', this.address || '');
            exWithdrawDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
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
    border-bottom: 1px solid rgba(227, 235, 245, 0.6);
    height: 71px;
    .col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding: 8px 0;
        color: #5e6875;
        font-size: 12px;
        align-self: stretch;
        position: relative;
        @include colWidth;
        overflow: auto;
        .underline {
            border-bottom: 1px dotted #5e6875;
        }
        .op_group {
            display: flex;
            .op {
                word-break: keep-all;
                background: rgba(0, 122, 255, 0.05);
                border-radius: 2px;
                border: 1px solid rgba(0, 122, 255, 0.3);
                line-height: 16px;
                cursor: pointer;
                color: #007aff;
                margin-right: 6px;
                padding-right: 2px;
                padding-left: 2px;
            }
        }

        &.title {
            @include font-family-bold();
            color: #5e6875;
            .icon {
                height: 16px;
                width: 16px;
                margin-right: 4px;
                margin-bottom: 11px;
                border-radius: 50%;
                border: 1px solid rgba(212,222,231,1);
            }
            .token-meta {
                display: flex;
                .name-wrapper {
                    display: inline-block;
                    .token-name {
                        font-size: 11px;
                        @include font-family-normal();
                        color: rgba(94,104,117,0.58);
                        line-height: 15px;
                    }
                }
            }
        }
    }
}
</style>
