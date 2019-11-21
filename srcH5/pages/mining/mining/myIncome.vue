<template>
    <div class="my-income">
        <div class="item">
            <div class="item-title">
                <span class="item-title-text">
                    {{ title }}
                    <span v-show="isShowHelp" class="help __pointer"
                          @click="triggerHelp" v-click-outside="hideHelp">
                        <span v-show="isShowHelpTips" class="help-text">{{ helpTips }}</span>
                    </span>
                </span>

                <span class="view-link" @click="goView">{{ $t('mobileMining.viewLink') }}</span>
            </div>
            <div class="item-amount">{{ miningTotal | formatNum }}</div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import openUrl from 'utils/openUrl';

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        miningTotal: {
            type: String,
            default: '0'
        },
        isShowHelp: {
            type: Boolean,
            default: false
        },
        helpTips: {
            type: String,
            default: ''
        }
    },
    data() {
        return { isShowHelpTips: false };
    },
    methods: {
        goView() {
            openUrl('https://vitex.net/');
        },
        triggerHelp() {
            this.isShowHelpTips = !this.isShowHelpTips;
        },
        hideHelp() {
            this.isShowHelpTips = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.my-income {
    background: url('~h5Assets/imgs/big_bg.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 2px;
    line-height: 16px;
    padding: 0 6px;
    margin: 20px 0;
    font-size: 12px;
    @include font-normal();

    .item-title-text {
        position: relative;
    }
    .help {
        position: absolute;
        top: -8px;
        background: url('~assets/imgs/info.svg') center no-repeat;
        background-size: 16px 16px;
        width: 30px;
        height: 30px;
        display: inline-block;
        .help-text {
            position: absolute;
            top: 35px;
            right: 15px;
            width: 150px;
            padding: 10px;
            background: #fff;
            transform: translateX(50%);
            box-shadow: 0 2px 10px 1px rgba(176, 192, 237, 0.42);
            border-radius: 2px;
            color: rgba(62, 74, 89, 0.6);
            font-size: 12px;
            line-height: 16px;
            &:after {
                position: absolute;
                content: ' ';
                top: 0;
                left: 50%;
                transform: translate(-50%, -100%);
                display: inline-block;
                border: 6px solid transparent;
                border-bottom: 6px solid #fff;
            }
        }
    }

    .item {
        padding: 20px 6px 14px;
        .item-title {
            color: rgba(62,74,89,0.6);
            margin-bottom: 6px;
            .view-link {
                float: right;
                color: $blue;
                line-height: 16px;
                &::after {
                    width: 16px;
                    height: 16px;
                    content: ' ';
                    display: inline-block;
                    background: url('~h5Assets/imgs/right_arrow.svg');
                    background-size: 100% 100%;
                    margin-bottom: -4px;
                }
            }
        }
        .item-amount {
            font-size: 24px;
            @include font-bold();
            line-height: 30px;
            color: rgba(62,74,89,1);
        }
    }
}
</style>
