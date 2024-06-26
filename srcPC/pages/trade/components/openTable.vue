<template>
    <div class="__tb">
        <div class="__tb_row __tb_head __pointer">
            <div class="__tb_cell" v-for="(h) in $t('tradeOpenOrders.table.heads')" :key="h">
                {{ h }}
            </div>
            <div class="__tb_cell">{{ $t('tradeAssets.operate') }}</div>
        </div>
        <div v-show="sortedList && sortedList.length" class="__tb_content">
            <div class="__tb_row __pointer __tb_content_row" :class="{
                'active': !!changeList[v.orderId]
            }" v-for="v in sortedList" :key="v.orderId">
                <div class="__tb_cell">{{ v.createTime|d }}</div>
                <div class="__tb_cell">{{ `${v.tradeTokenSymbol}/${v.quoteTokenSymbol}` }}</div>
                <div class="__tb_cell" :class="{
                    'buy': v.side===0,
                    'sell': v.side===1
                }">{{ $t("tradeOrderHistory.side")[v.side] }}</div>
                <div class="__tb_cell">{{ v.price + ' ' + getOriginSymbol(v.quoteTokenSymbol) }}</div>
                <div class="__tb_cell">{{ v.quantity + ' ' + getOriginSymbol(v.tradeTokenSymbol) }}</div>
                <div class="__tb_cell">{{ v.executedQuantity + ' ' + getOriginSymbol(v.tradeTokenSymbol) }}</div>
                <div class="__tb_cell">{{ `${(v.executedPercent*100).toFixed(2)}%` }}</div>
                <div class="__tb_cell">{{ v.executedAvgPrice + ' ' + getOriginSymbol(v.quoteTokenSymbol) }}</div>
                <div class="__tb_cell">{{ v.amount + ' ' + getOriginSymbol(v.quoteTokenSymbol) }}</div>
                <div @click="_cancel(v)" class="__tb_cell click-able">
                    {{ $t("tradeOpenOrders.table.rowMap.cancel") }}
                </div>
            </div>
        </div>
        <div class="__tb_content __tb_content_no_data"  v-show="!sortedList || !sortedList.length">
            <div class="__tb_no_data">
                <div>{{ $t('hint.noData') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import d from 'dayjs';
import sendTx from '@pc/utils/sendTx';
import statistics from '@utils/statistics';
import { execWithValid } from '@pc/utils/execWithValid';
import { initPwd } from '@pc/components/password/index.js';

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
        _cancel(order) {
            statistics.event(this.$route.name, 'openOrder-cancel', this.address || '');
            this.cancel(order);
        },
        cancel: execWithValid(function (order) {
            const failSubmit = e => {
                this.$toast(this.$t('tradeOpenOrders.confirm.failToast'), e);
            };

            const successSubmit = () => {
                this.$toast(this.$t('tradeOpenOrders.confirm.successToast'));
            };
            initPwd({
                title: this.$t('tradeOpenOrders.confirm.title'),
                content: this.$t('tradeOpenOrders.confirm.content'),
                submitTxt: this.$t('tradeOpenOrders.confirm.submitTxt'),
                cancelTxt: this.$t('tradeOpenOrders.confirm.cancelTxt'),
                submit: () => {
                    sendTx({
                        methodName: 'dexCancelOrder',
                        data: { orderId: order.orderId },
                        vbExtends: {
                            'type': 'dexCancel',
                            'side': order.side,
                            'tradeTokenSymbol': order.tradeTokenSymbol,
                            'quoteTokenSymbol': order.quoteTokenSymbol,
                            'price': `${ order.price } ${ this.getOriginSymbol(order.quoteTokenSymbol) }`
                        }
                    })
                        .then(successSubmit)
                        .catch(err => {
                            console.warn(err);
                            const code = err && err.error ? err.error.code || -1
                                : err ? err.code : -1;
                            if (code === -37008) {
                                this.$toast(`${ this.$t('tradeOpenOrders.cancelErr') }(37008)`);
                                return;
                            }
                            failSubmit(err);
                        });
                }
            }, true);
        })
    }
};
</script>

<style lang="scss" scoped>
@use '../../../assets/scss/table.scss' as *;

.__tb {
    flex: 1;
    box-shadow: none;
    .__tb_content_row {
        transition: all 0.4s ease-in-out;
        &.active {
            background: rgba(0,122,255,0.07);;
        }
    }
}

.order-tab {
    @include rowWith {
        &:first-child {
            padding-left: 6px;
        }
        &:last-child {
            padding-right: 10px;
        }
    }
}

@include rowWith {
    width: 10%;

    &:first-child {
        width: 150px;
    }
    &:nth-child(2) {
        width: 150px;
    }
    &:nth-child(3) {
        width: 40px;
    }
}

.buy {
    color: #5bc500;
}
.sell {
    color: #ff0008;
}
</style>
