<template>
    <div class="__tb_row">
        <div class="__tb_row_item">
            <div class="left">
                <span class="side_icon" :class="{
                    'buy': order.side===0,
                    'sell': order.side===1
                }">{{ $t("tradeOrderHistory.side")[order.side] }}</span>
                <span class="trade">{{ order.tradeTokenSymbol }}</span>
                <span class="symbol">{{ `/${order.quoteTokenSymbol}` }}</span>
                <span class="time">
                    {{ order.createTime|d }}
                </span>
            </div>
            <slot></slot>
        </div>
        <div class="__tb_row_item _flex">
            <div class="__tb_cell">
                {{ $t('mobileTradeCenter.orderQuantity') }}:
                {{ order.quantity + ' ' + getOriginSymbol(order.tradeTokenSymbol) }}
            </div>
            <div class="__tb_cell">
                {{ $t('mobileTradeCenter.orderPrice') }}:
                {{ order.price + ' ' + getOriginSymbol(order.quoteTokenSymbol) }}
            </div>
        </div>
        <div class="__tb_row_item _flex">
            <div class="__tb_cell">
                {{ $t('mobileTradeCenter.executedQuantity') }}:
                {{ order.executedQuantity + ' ' + getOriginSymbol(order.tradeTokenSymbol) }}
            </div>
            <div class="__tb_cell">
                {{ $t('mobileTradeCenter.avgPrice') }}:
                {{ order.executedAvgPrice + ' ' + getOriginSymbol(order.quoteTokenSymbol) }}
            </div>
        </div>
    </div>
</template>

<script>
import d from 'dayjs';

export default {
    props: {
        order: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    filters: {
        d(v) {
            return d.unix(v).format('YYYY-MM-DD HH:mm');
        }
    },
    methods: {
        getOriginSymbol(symbol) {
            return symbol.split('-')[0];
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.__tb {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.__tb_row {
    font-size: 12px;
    @include font-normal();
    margin-bottom: 18px;
    padding: 0 24px;

    .__tb_row_item {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        white-space: nowrap;
        &:last-child {
            margin-bottom: 0px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(211,223,239,1);
        }
        .left {
            display: flex;
            align-items: center;
        }
        &._flex {
            line-height: 18px;
            font-size: 14px;
            color: rgba(62,74,89,0.6);
        }
        .__tb_cell {
            white-space: nowrap;
        }
    }
    .side_icon{
        display: inline-block;
        padding: 2px;
        line-height: 16px;
        text-align: center;
        border-radius: 2px;
        margin-right: 6px;
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
        font-size: 16px;
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
</style>
