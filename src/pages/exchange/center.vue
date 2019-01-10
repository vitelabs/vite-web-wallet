<template>
    <div :class="{'full-screen': isFullScreen}" @click="fullScreen">center</div>
</template>

<script>
export default {
    created() {
        // ....
        this.$onKeyDown(27, () => {
            this.isFullScreen = false;
        });
    },
    data() {
        return {
            isFullScreen: false
        };
    },
    methods: {
        fullScreen() {
            this.isFullScreen = !this.isFullScreen;
        }
    }
};
</script>

<style lang="scss" scoped>
.full-screen {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 900;
}
</style>
