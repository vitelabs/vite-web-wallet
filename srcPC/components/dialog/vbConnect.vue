<template lang="pug">
extends ../../../src/components/dialog/base.pug
block head
    .head {{$t('assets.vb.connect.tips')}}
block content
    qrcode.code_container(:options="qrcodeOpt" :text="vb&&vb.uri")
</template>

<script>
import { initVB } from '@pc/wallet/vb';
import { getCurrHDAcc } from '@pc/wallet';
import qrcode from '@components/qrcode.vue';
import icon from '@assets/imgs/start_qrcode_icon.svg';

export default {
    components: { qrcode },
    data() {
        return {
            qrcodeOpt: {
                size: 240,
                image: icon,
                mSize: 0.3
            },
            dTitle: this.$t('assets.vb.title'),
            dWidth: 'narrow',
            vb: null
        };
    },
    beforeMount() {
        this.initVB();
    },
    methods: {
        initVB() {
            const lastAccount
                = getCurrHDAcc() && getCurrHDAcc().isBifrost
                    ? getCurrHDAcc().activeAddr
                    : undefined;
            this.vb = initVB({ lastAccount });
            this.vb.on('connect', () => {
                this.close();
            });
            this.vb.on('disconnect', () => {
                this.initVB();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
.head {
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    font-size: 14px;
    font-family: $font-bold;
    @include font_color_to_white(#333);
}
.code_container {
    margin: 0 auto;
    justify-content: center;
}
</style>

