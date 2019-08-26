<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper
        .block__title {{$t('trade.proxy.passive.head.0')}}
        div.block__content(v-if="!!trustAddress") {{trustAddress}}
        .block__title {{$t('trade.proxy.passive.head.1')}}
        div.block__content
            span.pure-pair(v-for="t in pairArray" :key="t") {{t}}
</template>

<script>
export default {
    props: {
        trustAddress: {
            type: String,
            default: ''
        },
        pairs: {
            type: Array,
            default: () => []
        }
    },
    beforeMount(){
        window.ffff=this;
    },
    data() {
        return {
            dWidth: 'narrow',
            dTitle: '确认委托交易对',
            dLTxt:'取消',
            dRTxt:'确定'
        };
    },
    computed: {
        pairArray() {
            return this.pairs.map(p => p.symbol.replace('_', '/'));
        }
    },
    methods: {
        inspector() {
            return Promise.resolve();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.block__title {
    height: 16px;
    font-size: 12px;
    @include font-family-bold();
    color: rgba(29, 32, 36, 1);
    line-height: 16px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .err {
        color: #ff2929;
        font-size: 12px;
    }
    &:first-child {
        margin-top: 0;
    }
}

.block__content {
    position: relative;
    color:#5E6875;
    font-size: 12px;
    word-break: break-all;
    width: 100%;
    box-sizing: border-box;
    margin-top: 4px;
    align-items: center;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    .pure-pair {
        margin-right: 10px;
    }
}
</style>

