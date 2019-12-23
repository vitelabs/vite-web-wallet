<template>
    <div class="currency-wrapper">
        <div class="small-title bold">
            {{ $t('setting.gate') }}
            <span class="help __pointer" @mouseenter="showHelp" @mouseleave="hideHelp">
                <span v-show="isShowHelp" class="help-text">{{ $t('setting.gateHelp') }}</span>
            </span>
        </div>

        <div class="setting common-list-wrapper __pointer">
            <span class="list-title" :class="{
                'down': !isShow,
                'up': isShow
            }" @click="toggleList">{{ $t(`setting.triggerGate.${gate}`) }}</span>
            <ul class="list" v-show="isShow">
                <li v-for="(item, index) in list" :key="index" v-show="item !== gate"
                    @click="setVal(item)">{{ $t(`setting.triggerGate.${index}`) }}</li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            isShow: false,
            isShowHelp: false,
            list: [ 0, 1 ]
        };
    },
    computed: {
        gate() {
            return +this.$store.state.env.gate;
        }
    },
    methods: {
        setVal(gate) {
            this.$store.commit('setGate', gate);
            this.toggleList();
        },
        toggleList() {
            this.isShow = !this.isShow;
        },
        showHelp() {
            this.isShowHelp = true;
        },
        hideHelp() {
            this.isShowHelp = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~pcAssets/scss/list/setting.scss";
@import "./setting.scss";

.help {
    position: relative;
    background: url('~assets/imgs/info.svg');
    background-size: 100% 100%;
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-bottom: -1px;
    .help-text {
        position: absolute;
        left: 24px;
        top: 6px;
        transform: translateY(-50%);
        z-index: 100;
        width: 200px;
        word-break: break-word;
        line-height: 16px;
        padding: 10px;
        background: #fff;
        box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);
        border-radius: 2px;
        @include font-family-normal();
        @include font_color_2();
        font-size: 12px;
        &:after {
            position: absolute;
            content: ' ';
            top: 50%;
            left: 0;
            transform: translate(-100%, -50%);
            display: inline-block;
            border: 6px solid transparent;
            border-right: 6px solid #fff;
        }
    }
}
</style>
