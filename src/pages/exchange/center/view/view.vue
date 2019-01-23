<template>
    <div class="ex-view-container">
        <kline></kline>
        <depth></depth>
    </div>
</template>

<script>
import kline from './kline.vue';
import depth from './depth.vue';

export default {
    components: {
        kline, depth
    }
};
</script>

