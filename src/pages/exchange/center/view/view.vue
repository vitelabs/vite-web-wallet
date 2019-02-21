<template>
    <div class="ex-view-container">
        <!-- <div class="choose-list">
            <span class="kline" @click="showKline">kline</span>
            <span class="depth" @click="showDepth">depth</span>
        </div> -->
        <div class="view">
            <kline v-show="showView === 'kline'"></kline>
            <depth v-show="showView === 'depth'"></depth>
        </div>
    </div>
</template>

<script>
import kline from './kline.vue';
import depth from './depth.vue';

export default {
    components: {
        kline, depth
    },
    data() {
        return {
            showView: 'kline'
        };
    },
    methods: {
        showKline() {
            this.showView = 'kline';
        },
        showDepth() {
            this.showView = 'depth';
        }
    }
};
</script>

<style lang="scss" scoped>
.ex-view-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.choose-list {
    height: 20px;
    line-height: 20px;
}
.view {
    flex: 1;
}
</style>


