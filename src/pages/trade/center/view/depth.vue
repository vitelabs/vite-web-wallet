<template>
    <div class="depth-wrapper">
        <div class="bar">
            <div class="btn active __pointer">{{ $t('trade.depthView') }}</div>
            <div @click="toogleDepth" class="btn __pointer">{{ $t('trade.klineView') }}</div>
        </div>
        <e-charts class="e-charts-wrapper" auto-resize :options="deptChartOption"></e-charts>
    </div>
</template>

<script>
import ECharts from 'vue-echarts';
import BigNumber from 'utils/bigNumber.js';

require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legendScroll');

export default {
    components: { ECharts },
    props: {
        showView: {
            type: String,
            default: 'kline'
        },
        toogleDepth: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        buyList() {
            const buyList = [].concat(this.$store.state.exchangeDepth.buy || []);
            const list = buyList.sort((a, b) => a.price - b.price);

            return list;
        },
        buyAmountList() {
            const _l = [];
            let sum = 0;
            const buyList = [].concat(this.buyList).reverse();
            buyList.forEach(item => {
                sum = BigNumber.plus(sum, item.quantity || 0);

                _l.push(sum);
            });
            _l.reverse();

            return _l;
        },
        sellList() {
            const sellList = [].concat(this.$store.state.exchangeDepth.sell || []);
            const list = sellList.sort((a, b) => a.price - b.price);

            return list;
        },
        sellAmountList() {
            const _l = [];
            this.buyList.forEach(() => {
                _l.push(null);
            });

            let sum = 0;
            this.sellList.forEach(item => {
                sum = BigNumber.plus(sum, item.quantity || 0);
                _l.push(sum);
            });

            return _l;
        },
        priceList() {
            const list = [].concat(this.buyList, this.sellList);
            const _l = [];
            list.forEach(item => {
                _l.push(item.price);
            });

            return _l;
        },
        deptChartOption() {
            return {
                tooltip: {
                    confine: true,
                    formatter: params => {
                        // console.log(params);
                        let res = `${ this.$t('trade.priceTitle', { price: this.activeTxPair ? this.activeTxPair.quoteTokenSymbol : '' }) }: ${ params[0].name }`;
                        res += `<br/>${ params[0].seriesName } : ${ params[0].value }`;

                        return res;
                    },
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: { color: 'rgba(0, 0, 0, 1)' }
                    },
                    backgroundColor: '#afafaf',
                    textStyle: {
                        color: '#fff',
                        fontSize: '12px'
                    },
                    extraCssText: 'box-shadow: 0 0 16px 0 rgba(0, 0, 0, .2);border-radius: 4px;'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.priceList
                },
                yAxis: [{ type: 'value' }],
                series: [ {
                    name: this.$t('trade.amountTable'),
                    type: 'line',
                    itemStyle: { normal: { color: '#4cc453' } },
                    lineStyle: { normal: { color: '#00D764' } },
                    areaStyle: { color: '#00D764' },
                    data: this.buyAmountList
                }, {
                    name: this.$t('trade.amountTable'),
                    type: 'line',
                    itemStyle: { normal: { color: '#e94c4c' } },
                    lineStyle: { normal: { color: '#ED5158' } },
                    areaStyle: { color: '#ED5158' },
                    data: this.sellAmountList
                } ]
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.depth-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f7f9fb;
    padding: 0 6px 10px;
    box-sizing: border-box;

    .bar {
        display: flex;
        height: 38px;
        width: 100%;
        background: #fff;
        flex-direction: row;
        margin-bottom: 6px;
        align-items: center;
        white-space: nowrap;
        justify-content: flex-end;
        .btn {
            line-height: 40px;
            color: #4c525e;
            padding: 0 10px;
            text-align: right;
            user-select: none;
            font-size: 14px;
            font-family: Trebuchet MS, Tahoma, Arial, sans-serif;
            transition: color 0.06s ease;
            &:hover {
                color: #131722;;
            }
            &.active {
                background: rgba(75, 116, 255, 0.1);
            }
        }
    }

    .e-charts-wrapper {
        flex: 1;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #dadde0;
    }
}
</style>

