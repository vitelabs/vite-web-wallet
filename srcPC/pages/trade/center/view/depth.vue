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
        quoteTokenDigit() {
            return this.$store.getters.quoteTokenDecimalsLimit;
        },
        quoteTokenDepthDigit() {
            if ((this.depthStep || this.depthStep === 0) && this.quoteTokenDigit > this.depthStep) {
                return this.depthStep;
            }
            return this.quoteTokenDigit;
        },
        tradeTokenDigit() {
            return this.$store.getters.tradeTokenDecimalsLimit;
        },
        depthStep() {
            return this.$store.state.exchangeDepth.depthStep;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        buyList() {
            const buyList = [].concat(this.$store.state.exchangeDepth.buy || []);
            const list = buyList.sort((a, b) => a.price - b.price);

            return list;
        },
        buyQuantityList() {
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
        buyAmountList() {
            const _l = [];
            let sum = 0;
            const buyList = [].concat(this.buyList).reverse();
            buyList.forEach(item => {
                sum = BigNumber.plus(sum, item.amount || 0);
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
        sellQuantityList() {
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
        sellAmountList() {
            const _l = [];
            this.buyList.forEach(() => {
                _l.push(null);
            });

            let sum = 0;
            this.sellList.forEach(item => {
                sum = BigNumber.plus(sum, item.amount || 0);
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
            const lineColor = +this.theme === 0 ? '#ccc' : '#1E2745';
            const fontColor = +this.theme === 0 ? '#333' : '#545F75';

            const axisLine = { lineStyle: { color: lineColor } };
            const axisLabel = { color: fontColor };

            return {
                tooltip: {
                    confine: true,
                    formatter: params => {
                        const price = BigNumber.formatNum(params[0].name, this.quoteTokenDepthDigit);
                        const quantity = BigNumber.formatNum(params[0].value, this.tradeTokenDigit);

                        let amount;
                        const index = params[0].dataIndex;
                        if (index >= this.buyList.length) {
                            amount = this.sellAmountList[index];
                        } else {
                            amount = this.buyAmountList[index];
                        }
                        amount = BigNumber.formatNum(amount, this.quoteTokenDigit);

                        let res = `${ this.$t('trade.priceTitle', { price: this.activeTxPair ? this.activeTxPair.quoteTokenSymbol : '' }) }: ${ price }`;
                        res += `<br/>${ params[0].seriesName } : ${ quantity }`;
                        res += `<br/>${ this.$t('trade.amountTable') } : ${ amount }`;
                        return res;
                    },
                    trigger: 'axis',
                    ...this.tooltipStyle
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.priceList,
                    axisLine,
                    axisLabel
                },
                yAxis: {
                    type: 'value',
                    axisLine,
                    axisLabel,
                    splitLine: { lineStyle: { color: [lineColor] } }
                },
                series: [ {
                    name: this.$t('trade.quantityTable'),
                    type: 'line',
                    data: this.buyQuantityList,
                    itemStyle: { normal: { color: '#4cc453' } },
                    lineStyle: { normal: { color: '#00D764' } },
                    areaStyle: { color: '#00D764' }
                }, {
                    name: this.$t('trade.quantityTable'),
                    type: 'line',
                    data: this.sellQuantityList,
                    itemStyle: { normal: { color: '#e94c4c' } },
                    lineStyle: { normal: { color: '#ED5158' } },
                    areaStyle: { color: '#ED5158' }
                } ]
            };
        },
        theme() {
            return +this.$store.state.env.theme;
        },
        tooltipStyle() {
            const extraCssText = 'box-shadow: 0 0 16px 0 rgba(0, 0, 0, .2); border-radius: 4px; font-size: 12px; color: #fff';

            return {
                axisPointer: {
                    type: 'line',
                    lineStyle: { color: +this.theme === 0 ? 'rgba(0, 0, 0, 1)' : '#1E2745' }
                },
                backgroundColor: +this.theme === 0 ? '#afafaf' : '#1E2745',
                extraCssText
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
    [data-theme="0"] & {
        background: #f7f9fb;
    }
    [data-theme="1"] & {
        background: $black-color-2;
    }
    padding: 0 6px 10px;
    box-sizing: border-box;

    .bar {
        display: flex;
        height: 38px;
        width: 100%;
        @include bg_color_2();
        flex-direction: row;
        margin-bottom: 6px;
        align-items: center;
        white-space: nowrap;
        justify-content: flex-end;
        .btn {
            line-height: 40px;
            [data-theme="0"] & {
                color: #4c525e;
                &:hover {
                    color: #131722;;
                }
            }
            [data-theme="1"] & {
                color: #C0C6D3;
                &:hover {
                    color: #9db2bd;;
                }
            }
            padding: 0 10px;
            text-align: right;
            user-select: none;
            font-size: 14px;
            font-family: Trebuchet MS, Tahoma, Arial, sans-serif;
            transition: color 0.06s ease;
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
        @include bg_color_2();
        [data-theme="0"] & {
            border: 1px solid #dadde0;
        }
        [data-theme="1"] & {
            border: 1px solid $black-color-4;
        }
    }
}
</style>

