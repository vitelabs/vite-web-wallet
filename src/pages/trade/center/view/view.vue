<template>
    <div class="ex-view-container">
        <kline :toogleDepth="toogleDepth" v-show="showView === 'kline'"></kline>
        <depth :toogleDepth="toogleDepth" v-if="showView === 'depth'"></depth>
    </div>
</template>

<script>
import kline from './kline.vue';
import depth from './depth.vue';

export default {
    components: { kline, depth },
    data() {
        return { showView: 'kline' };
    },
    methods: {
        toogleDepth() {
            this.showView = this.showView === 'depth' ? 'kline' : 'depth';
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


