<template>
    <div class="depth-table-wrapper">
        <div class="__center-tb-row" @click="clickRow(item)"
             v-for="(item, i) in depthData" :key="i">
            <span class="__center-tb-item" :class="dataType">{{ item.pirce }}</span>
            <span class="__center-tb-item">{{ item.num }}</span>
            <span class="__center-tb-item">{{ item.pirce * item.num }}</span>
            <span class="percent-wrapper" :class="dataType" :style="{ 'width': getWidth(item) + '%' }"></span>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';

export default {
    props: {
        dataType: {
            type: String,
            default: ''
        },
        depthData: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    methods: {
        getWidth(item) {
            return BigNumber.dividedToNumber(item.pirce, 10000, 2).toString() * 100;
        },
        clickRow(data) {
            console.log(data);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.percent-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    &.buy {
        background: rgba(91,197,0,0.05);;
    }
    &.sell {
        background: rgba(229,73,77,0.05);
    }
}
</style>
