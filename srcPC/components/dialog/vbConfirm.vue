<template lang="pug">
extends ../../../src/components/dialog/base.pug
block head
    .head {{ isHardware ? $t('assets.ledger.confirm.tips') : $t('assets.vb.confirm.tips')}}
block content
    span.block-ctx(v-if="!isHardware")
    lottie(v-else type="validate" class="ledger_lottie")
</template>

<script>
import Lottie from '@pc/components/animation/lottie.vue';

export default {
    components: { Lottie },
    data() {
        return { dShowClose: false };
    },
    beforeMount() {
        this.dTitle = this.isHardware ? this.$t('assets.ledger.title') : this.$t('assets.vb.title');
        this.dSTxt = this.isHardware ? this.$t('assets.ledger.closeAlert') : this.$t('assets.vb.closeAlert') ;
    },
    computed: {
        isHardware() {
            const currAcc = this.$store.state.wallet.currHDAcc;
            return currAcc && currAcc.isHardware;
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
@use "@assets/scss/theme.scss" as *;
.head {
    box-sizing: border-box;
    padding: 23px;
    display: flex;
    background: rgba(0, 122, 255, 0.05);
    font-size: 16px;
    @include common_font_color();
    @include common_border_one(bottom);
}
.block-ctx {
    display: inline-block;
    height: 138px;
    width: 140px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    @include background_common_img('vb_confirm.png');
}
</style>

