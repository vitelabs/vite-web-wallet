<template>
    <div class="my-income">
        <div class="item">
            <div class="item-title">
                {{ title }}
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
        }
    },
    methods: {
        goView() {
            openUrl('https://vitex.net/');
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
    margin: 20px 0;
    font-size: 12px;
    @include font-normal();

    .item {
        padding: 20px 12px 15px;
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
