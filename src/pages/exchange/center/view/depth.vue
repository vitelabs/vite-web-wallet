<template>
    <e-charts class="e-charts-wrapper" auto-resize :options="deptChartOption"></e-charts>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts';

require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legendScroll');

export default {
    components: {
        ECharts
    },
    computed: {
        buyList() {
            let buyList = [].concat(this.$store.state.exchangeDepth.buy || []);
            let list = buyList.sort((a, b) => {
                return b.price - a.price;
            });
            return list;
        },
        buyAmountList() {
            let _l = [];
            this.buyList.forEach((item) => {
                _l.push(item.quantity);
            });
            return _l;
        },
        sellList() {
            let sellList = [].concat(this.$store.state.exchangeDepth.sell || []);
            let list = sellList.sort((a, b) => {
                return a.price - b.price;
            });
            return list;
        },
        sellAmountList() {
            let _l = [];
            this.buyList.forEach(() => {
                _l.push(null);
            });
            this.sellList.forEach((item) => {
                _l.push(item.quantity);
            });
            return _l;
        },
        priceList() {
            let list = [].concat(this.buyList, this.sellList);
            let _l = [];
            list.forEach((item) => {
                _l.push(item.price);
            });
            return _l;
        },
        deptChartOption() {
            return {
                tooltip: {
                    confine: true,
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
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: this.$t('exchange.amountTable'),
                    type: 'line',
                    itemStyle: {normal: {color: '#4cc453'}},
                    lineStyle: {normal: {color: '#5BC500'}},
                    areaStyle: {color: '#5BC500'},
                    data: this.buyAmountList
                },{
                    name: this.$t('exchange.amountTable'),
                    type: 'line',
                    itemStyle: {normal: {color: '#e94c4c'}},
                    lineStyle: {normal: {color: '#E5494D'}},
                    areaStyle: {color: '#E5494D'},
                    data: this.sellAmountList
                }]
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.e-charts-wrapper {
    width: 100%;
    height: 100%;
}
</style>

