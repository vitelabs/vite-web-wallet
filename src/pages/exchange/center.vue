<template>
    <div :class="{'full-screen': isFullScreen}">
        <sec-title :isShowHelp="false"></sec-title>
        <div @click="fullScreen" >fullScreen</div>
        <change-lang class="change-lang __pointer"></change-lang>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';
import changeLang from 'components/changeLang';

export default {
    components: {
        secTitle, changeLang
    },
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
.change-lang {
    background: #000;
    z-index: 1;
}
</style>
