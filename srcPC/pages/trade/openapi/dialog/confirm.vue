<template lang="pug">
extends /components/dialog/base.pug
block content
    div(v-if="isDeleteAll")
        i18n.strong(path='trade.proxy.dialog.cancelAllTips' tag="span")
            div.address_container(place="trustAddress") {{trustAddress}}
    div(v-else)
        .__row
            .__row_t {{$t('trade.proxy.passive.head.0')}}
            .__input_row.__unuse_input.__ellipsis(v-if="!!trustAddress") {{trustAddress}}
        .__row
            .__row_t {{$t('trade.proxy.passive.head.1')}}
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
@import "pcComponents/confirm/confirmRow.scss";
@import "./confirm.scss";

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
</style>

