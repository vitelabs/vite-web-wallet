<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper
        .block__title {{$t('trade.proxy.passive.head.0')}}
        .block__content.edit(v-if="!!trustAddress") {{trustAddress}}
        .block__title {{$t('trade.proxy.passive.head.1')}}
        .block__content
            span.pure-pair(v-for="t in transUtil(relation[addr])" :key="t") {{t}}
</template>

<script>
export default {
    props: {
        trustAddress: {
            type: String,
            default: ""
        },
        paris: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dWidth: "narrow",
            dTitle: "确认委托交易对"
        };
    },
    computed: {
        pairArray() {
            return this.pairs.map(p => p.symbol.replace("_", "/"));
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
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    font-size: 12px;
    word-break: break-word;
    width: 100%;
    box-sizing: border-box;
    margin-top: 16px;
    padding: 7px 15px;
    align-items: center;
    display: flex;
    width: 100%;
    justify-content: space-between;
    .pure-pair {
        margin-right: 10px;
    }
}
</style>

