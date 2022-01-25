<template lang="pug">
extends /components/dialog/base.pug
block head
    .bri-trans__head
        div You are about to bridge {{tokenInfo.token}} from {{networkPair.from.desc}} to {{networkPair.to.desc}}.
            .assets-container
                img.icon(:src="tokenInfo.icon")
                .text
                    .label Amount
                    .content {{`${transInfo.amount}  ${tokenInfo.token}`}}
block originContent
      .custom-content
        //- .bri-trans__label  Bridge your assets to the following target address:
        .bri-trans__content
            .title Target Address
            .address(@click="addressClick") {{transInfo.toAddress}}
</template>
<script>
import checkbox from 'uiKit/checkbox.vue';
import execCopy from 'utils/copy';

export default {
    components: { checkbox },
    name: 'ConfirmSubmitTx',
    props: [
        'networkPair',
        'tokenInfo',
        'transInfo',
        'inspector',
        'checkApprove'
    ],
    data() {
        return {
            dTitle: 'Transaction Confirmation',
            accepted: false,
            approved: false
        };
    },
    async beforeMount() {
        this.approved = await this.checkApprove();
    },
    computed: {
        dSTxt: function () {
            return this.approved ? 'Submit Transaction' : 'Submit approve';
        }
    },
    watch: {
        btnLoading: async function () {
            this.approved = await this.checkApprove();
        }
    },
    methods: {
        addressClick() {
            execCopy(this.transInfo.toAddress);
            this.$toast(this.$t('hint.copy'));
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.bri-trans {
    &__head {
        @include common_font_color();
        @include bg_color_custom(#d4dee7, $black-color-4);
        display: flex;
        justify-content: center;
        padding: 30px;
        font-size: 14px;
        line-height: 30px;
        .assets-container {
            display: flex;
            align-items: center;
            margin-top: 10px;
            line-height: 14px;
            height: 40px;
            img {
                height: 40px;
                width: 40px;
                margin-right: 10px;
            }
            .text {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                .label {
                    @include font_color_2();
                    font-size: 12px;
                }
            }
        }
    }
}
.custom-content {
    @include common_font_color();
    margin: 20px 30px;
    .bri-trans__label {
        font-size: 12px;
    }
    .bri-trans__content {
        font-size: 14px;
        box-sizing: border-box;
        height: 105px;
        width: 450px;
        margin-top: 20px;
        position: relative;
        @include bg_color_2();
        box-sizing: border-box;
        @include common_font_color();
        border-radius: 2px;
        // box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
        padding: 20px 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        @include box_shadow();
        .title {
            @include font-family-bold();
        }
        .address {
            word-break: break-all;
            cursor: pointer;
        }
    }
}
</style>
