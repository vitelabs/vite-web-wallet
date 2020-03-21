<template lang="pug">
extends /components/dialog/base.pug
block head
    .head {{ $t('assets.ledger.confirm.verifyAddress') }}
block content
    span.block-ctx 
        span.first {{activeAddr.substr(0, 10)}}
        span.mid {{activeAddr.substring(10, activeAddr.length - 5)}}
        span.last {{activeAddr.substring(activeAddr.length - 5)}}
</template>

<script>
export default {
    data() {
        return { 
            dShowClose: false
        };
    },
    beforeMount() {
        this.title = this.$t('assets.ledger.title');
        this.width = 'wide';
    },
    computed: {
        activeAddr() {
            const currAcc = this.$store.state.wallet.currHDAcc;
            return currAcc ? currAcc.activeAddr : '';
        }
    },
    filters: {
        first(address) {
            if (!address) return;
            return address.subStr(0, 9);
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
.head {
    box-sizing: border-box;
    padding: 23px;
    display: flex;
    font-size: 16px;
    @include common_font_color();
    @include common_border_one(bottom);
    @include bg_color_2();
}
.block-ctx {
    @include font-family-bold();
    font-size: 18px;
    padding: 20px 0;
    @include font_color_2();
    .first, .last {
        font-size: 20px;
        color: $blue-color-1;
    }
}
</style>

