<template>
    <e-charts class="e-charts-wrapper" auto-resize :options="deptChartOption" @legendselectchanged="legendSelectChanged"></e-charts>
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
    // data() {
    //     return {
    //         : 
    //     };
    // },
    // mounted() {
    //     this.deptChartOption.tooltip.formatter = this.deptChartHover;
    // },
    computed: {
        buyList() {
            let buyList = [].concat(this.$store.state.exchangeDepth.buy || []);
            let list = buyList.sort((a, b) => {
                return b.amount - a.amount;
            });
            return list;
        },
        buyAmountList() {
            let _l = [];
            this.buyList.forEach((item) => {
                _l.push(item.amount);
            });
            return _l;
        },
        sellList() {
            let sellList = [].concat(this.$store.state.exchangeDepth.sell || []);
            let list = sellList.sort((a, b) => {
                return a.amount - b.amount;
            });
            return list;
        },
        sellAmountList() {
            let _l = [];
            this.sellList.forEach((item) => {
                _l.push(item.amount);
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
                grid: { left: 0, top: 0, right: 0, bottom: 0 },
                tooltip: {
                    confine: true,
                    trigger: 'axis',
                    // axisPointer: {type: 'line', lineStyle: {color: 'rgba(0, 0, 0, 1)'}},
                    backgroundColor: '#afafaf',
                    textStyle: { color: '#fff', fontSize: '12px' },
                    // extraCssText: 'box-shadow: 0 0 16px 0 rgba(0, 0, 0, .2);border-radius: 4px;'
                },
                xAxis: {
                    type: 'category',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { show: false },
                    // boundaryGap: false,
                    data: this.priceList
                },
                yAxis: [{
                    type: 'value',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { show: false },
                    splitLine: { show: false }
                }],
                series: [
                    {
                        name: '买单',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        showSymbol: false,
                        symbolSize: 3,
                        sampling: 'average',
                        itemStyle: {normal: {color: '#4cc453'}},
                        lineStyle: {normal: {color: '#5BC500'}},
                        areaStyle: {color: '#5BC500'},
                        data: this.buyAmountList
                    },
                    {
                        name: '卖单',
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        showSymbol: false,
                        symbolSize: 3,
                        sampling: 'average',
                        itemStyle: {normal: {color: '#e94c4c'}},
                        lineStyle: {normal: {color: '#E5494D'}},
                        areaStyle: {color: '#E5494D'},
                        data: this.sellAmountList
                    }
                ]
            };
        }
    },
    methods: {
        legendSelectChanged(obj) {
            const selected = obj.selected;
            if (selected) {
                this.deptChartOption.legend.selected[obj.name] = selected[obj.name];
            }
        },
        deptChartHover(value) {
            let result = '';
            value.map(item => {
                if (item.value !== '') {
                    result = value[0].axisValue + item.value;
                }
            });
            return result;
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

