<template>
    <div class="__tb">
        <div v-show="sortedList && sortedList.length">
            <div class="__tb_row" :class="{
                'active': !!changeList[v.orderId]
            }" v-for="v in sortedList" :key="v.orderId">
                <div class="__tb_row_item">
                    <div>
                        <span class="side_icon" :class="{
                            'buy': v.side===0,
                            'sell': v.side===1
                        }">{{ $t("tradeOrderHistory.side")[v.side] }}</span>
                        <span class="trade">{{ v.tradeTokenSymbol }}</span>
                        <span class="symbol">{{ `/${v.quoteTokenSymbol}` }}</span>
                        <span class="time">
                            {{ v.createTime|d }}
                        </span>
                    </div>

                    <div @click="cancel(v)" class="cancel">{{ $t("tradeOpenOrders.table.rowMap.cancel") }}</div>
                </div>
                <div class="__tb_row_item _flex">
                    <div class="__tb_cell">
                        {{ $t('mobileTradeCenter.orderQuantity') }}:
                        {{ v.quantity + ' ' + getOriginSymbol(v.tradeTokenSymbol) }}
                    </div>
                    <div class="__tb_cell">
                        {{ $t('mobileTradeCenter.orderPrice') }}:
                        {{ v.price + ' ' + getOriginSymbol(v.quoteTokenSymbol) }}
                    </div>
                </div>
                <div class="__tb_row_item _flex">
                    <div class="__tb_cell">
                        {{ $t('mobileTradeCenter.executedQuantity') }}:
                        {{ v.executedQuantity + ' ' + getOriginSymbol(v.tradeTokenSymbol) }}
                    </div>
                    <div class="__tb_cell">
                        {{ $t('mobileTradeCenter.avgPrice') }}:
                        {{ v.executedAvgPrice + ' ' + getOriginSymbol(v.quoteTokenSymbol) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="__tb_no_data" v-show="!sortedList || !sortedList.length">{{ $t('hint.noData') }}</div>
    </div>
</template>

<script>
import d from 'dayjs';
import { utils } from '@vite/vitejs';
import sendTx from 'h5Utils/sendTx';
import statistics from 'utils/statistics';

const { _Buffer } = utils;

export default {
    props: {
        changeList: {
            type: Object,
            default: () => {
                return {};
            }
        },
        list: {
            type: Array,
            default: () => []
        }
    },
    filters: {
        d(v) {
            return d.unix(v).format('YYYY-MM-DD HH:mm');
        }
    },
    computed: {
        sortedList() {
            return this.list.slice(0).sort((a, b) => (b.createTime - a.createTime));
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        getOriginSymbol(symbol) {
            return symbol.split('-')[0];
        },
        cancel(order) {
            statistics.event(this.$route.name, 'openOrder-cancel', this.address || '');

            sendTx({
                methodName: 'dexTradeCancelOrder',
                data: {
                    orderId: _Buffer.from(order.orderId, 'hex').toString('base64'),
                    tradeToken: order.tradeToken
                },
                vbExtends: {
                    'type': 'dexCancel',
                    'side': order.side,
                    'tradeTokenSymbol': order.tradeTokenSymbol,
                    'quoteTokenSymbol': order.quoteTokenSymbol,
                    'price': `${ order.price } ${ this.getOriginSymbol(order.quoteTokenSymbol) }`
                }
            }).then(() => {
                this.$toast(this.$t('tradeOpenOrders.confirm.successToast'));
            }).catch(err => {
                console.warn(err);
                const code = err && err.error ? err.error.code || -1
                    : err ? err.code : -1;
                if (code === -37008) {
                    this.$toast(`${ this.$t('tradeOpenOrders.cancelErr') }(37008)`);
                    return;
                }
                this.$toast(this.$t('tradeOpenOrders.confirm.failToast'), err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.__tb_no_data {
    text-align: center;
    color: rgba(62, 74, 89, 0.6);
}

.__tb_row {
    font-size: 12px;
    @include font-normal();
    border-bottom: 1px solid rgba(211,223,239,1);
    margin-bottom: 18px;
    .__tb_row_item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        &._flex {
            line-height: 18px;
            font-size: 14px;
            color: rgba(62,74,89,0.6);
        }
    }
    .side_icon{
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        border-radius: 2px;
        &.buy {
            background: rgba(1,215,100,0.1);
            color: $green;
        }
        &.sell {
            background: rgba(229,73,77,0.1);
            color: $red;
        }
    }
    .symbol {
        @include font-bold();
        color: rgba(62,74,89,0.3);
        padding: 0 5px 0 2px;
    }
    .trade {
        @include font-bold();
        font-size: 18px;
        color: rgba(36,39,43,1);
    }
    .time {
        color: rgba(62,74,89,0.3);
        line-height: 16px;
        padding-left: 5px;
        border-left: 1px solid rgba(229, 229, 234, 1)
    }
    .cancel {
        line-height: 16px;
        background: rgba(0,122,255,0.05);
        border-radius: 11px;
        border: 1px solid rgba(0,122,255,0.3);
        padding: 2px 10px;
        color: $blue;
        font-size: 14px;
        @include font-bold();
    }
}

.__tb_row {
    transition: all 0.4s ease-in-out;
    &.active {
        background: rgba(0,122,255,0.07);;
    }
}
</style>
