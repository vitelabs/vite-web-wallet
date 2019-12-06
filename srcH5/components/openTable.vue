<template>
    <div class="__tb">
        <order-item v-for="v in sortedList" :key="v.orderId" :order="v">
            <div @click="cancel(v)" class="cancel">{{ $t("tradeOpenOrders.table.rowMap.cancel") }}</div>
        </order-item>
    </div>
</template>

<script>
import { utils } from '@vite/vitejs';
import sendTx from 'h5Utils/sendTx';
import statistics from 'utils/statistics';
import orderItem from 'h5Components/orderItem';

const { _Buffer } = utils;

export default {
    components: { orderItem },
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
            statistics.event(`H5${ this.$route.name }`, 'openOrder-cancel', this.address || '');

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
            }).then(() => {
                // this.$toast(this.$t('tradeOpenOrders.confirm.successToast'));
            }).catch(err => {
                console.warn(err);
                // const code = err && err.error ? err.error.code || -1
                //     : err ? err.code : -1;
                // if (code === -37008) {
                //     this.$toast(`${ this.$t('tradeOpenOrders.cancelErr') }(37008)`);
                //     return;
                // }
                // this.$toast(this.$t('tradeOpenOrders.confirm.failToast'), err);
            });
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

/deep/ .__tb_row {
    transition: all 0.4s ease-in-out;
    &.active {
        background: rgba(0,122,255,0.07);;
    }
}
</style>
