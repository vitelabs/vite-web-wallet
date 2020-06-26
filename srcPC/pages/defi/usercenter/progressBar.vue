<template>
    <div class="progress-bar">
        <div class="progress-bar__label-wrapper" ref="wrapper">
            <span>0%</span>
            <span v-if="activeValue!== 'NaN'" :style="activeStyle">{{activeValue}}%</span>
            <span>{{currencySymbol + ' '}} {{assetValue | formatNum(2)}}</span>
        </div>
        <div class="progress-bar__line">
            <div class="progress-bar__line--active" :style="progressActiveStyle"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        assetValue: {
            type: [ String, Number ],
            default: '0'
        },
        activeValue: {
            type: [ String, Number ],
            default: '0'
        }
    },
    data() {
        return { activeStyle: '' };
    },
    computed: {
        currencySymbol() {
            return this.$store.getters.currencySymbol;
        },
        progressActiveStyle() {
            return `width: ${ this.activeValue }%;`;
        }
    },
    mounted() {
        this.setStyle();
    },
    watch: {
        activeValue: function () {
            this.setStyle();
            const dom = this.$refs.wrapper;
            if (!dom) {
                this.$nextTick(() => {
                    this.setStyle();
                });
            }
        }
    },
    methods: {
        setStyle() {
            let percent = this.activeValue;
            if (percent > 100) {
                percent = 100;
            }
            const dom = this.$refs.wrapper;
            let marginLeft = (percent / 100) * dom.offsetWidth - 33;
            if (marginLeft < 0) {
                marginLeft = 3;
            }
            if (dom) {
                this.activeStyle = `margin-left: ${ marginLeft }px;`;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.progress-bar {
    width: 100%;
    &__line {
        width: 100%;
        height: 3px;
        background: rgba(0,122,255,0.12);
        border-radius: 4px;
        &--active {
            height: 3px;
            background: linear-gradient(270deg,rgba(84,182,255,1) 0%,rgba(42,127,255,1) 100%);
            border-radius: 4px;
        }
    }
    &__label-wrapper {
        font-size: 12px;
        line-height: 16px;
        @include font-family-bold();
        @include font_color_to_white(rgba(94,104,117,0.58));
        position: relative;
        margin-bottom: 4px;
        & > span {
            &:last-child {
                position: absolute;
                right: 0;
            }
        }
    }
}

</style>
