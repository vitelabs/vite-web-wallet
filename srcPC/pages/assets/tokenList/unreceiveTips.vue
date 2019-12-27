<template>
    <span v-show="unreceivedNum !== 0" class="unreceive-bubble __pointer">
        {{ unreceivedNum }}
        <tooltips class="fee-tips" v-show="!isLogin && !isShowBubble" :content="$t('hint.unreceived')"></tooltips>
        <tooltips class="fee-tips bubble" v-show="isShowBubble" :content="$t('hint.unreceivedNum', {number: unreceivedNum})">></tooltips>
    </span>
</template>

<script>
import { StatusMap } from 'wallet';
import tooltips from 'components/tooltips';

export default {
    components: { tooltips },
    props: {
        unreceivedNum: {
            type: Number,
            default: 0
        }
    },
    data() {
        return { isShowBubble: false };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        isStartShowBubble() {
            return this.unreceivedNum !== 0 && !this.isLogin;
        }
    },
    watch: {
        isStartShowBubble() {
            if (!this.isStartShowBubble) {
                this.isShowBubble = false;
                return;
            }
            this.startShowBubble();
        }
    },
    methods: {
        startShowBubble() {
            this.isShowBubble = true;
            setTimeout(() => {
                this.isShowBubble = false;
            }, 5000);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "assets/scss/vars.scss";

.unreceive-bubble {
    position: relative;
    display: inline-block;
    overflow: visible;
    width: 13px;
    height: 13px;
    border-radius: 20px;
    background: #E5494D;
    text-align: center;
    color: #fff;
    font-size: 11px;
    line-height: 13px;
    @include font-family-normal();
    font-weight: 300;

    .fee-tips {
        z-index: 100;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        color: #5E6875;
        width: 200px;
        [data-theme="0"] & {
            box-shadow: 0px 5px 20px 0px rgba(176,192,237,0.4);
        }
        word-break: break-word;
        @include font-family-normal();
        /deep/.trigle {
            border: 7px solid transparent;
            [data-theme="0"] & {
                border-bottom: 7px solid $white-color;
            }
            [data-theme="1"] & {
                border-bottom: 7px solid $black-color-4;
            }
            top: -14px;
            transform: translateX(-50%);
            left: 50%;
        }
    }
    .fee-tips.bubble {
        display: inline-block;
    }
    &:hover .fee-tips {
        display: inline-block;
    }
}
</style>
