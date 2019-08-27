<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper(v-if="isDeleteAll")
        i18n.strong(path='trade.proxy.dialog.cancelAllTips' tag="span")
            div.address_container(place="trustAddress") {{trustAddress}}
    .content-wrapper(v-else)
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
    data() {
        return {
            dWidth: 'narrow',
            dLTxt: this.$t('trade.proxy.dialog.confirm.cancel'),
            dRTxt: this.$t('trade.proxy.dialog.confirm.ok')
        };
    },
    computed: {
        pairArray() {
            return this.pairs.map(p => p.symbol.replace('_', '/'));
        },
        dTitle() {
            return this.isDeleteAll ? this.$t('trade.proxy.dialog.titleMap')['deleteAll'] : this.$t('trade.proxy.dialog.confirm.title');
        },
        isDeleteAll() {
            return !(this.pairs && this.pairs.length > 0);
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
    color: #5E6875;
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
.strong {
    color: #1d2024;
    font-size: 14px;
}
.address_container {
    font-size: 12px;
    color: #5e6875;
    word-break: break-all;
    line-height: 14px;
}
</style>

