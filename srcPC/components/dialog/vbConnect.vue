<template lang="pug">
extends /components/dialog/base.pug
block head
    .head {{$t('assets.vb.connect.tips')}}
block content
    qrcode.code_container(:options="qrcodeOpt" :text="vb&&vb.uri")
</template>

<script>
import { initVB } from "wallet/vb";
import { getCurrHDAcc } from "wallet";
import qrcode from "components/qrcode";
import icon from "assets/imgs/start_qrcode_icon.svg";

export default {
    components: { qrcode },
    data() {
        return {
            qrcodeOpt: {
                size: 140,
                image: icon,
                mSize: 0.3
            },
            dTitle: this.$t("assets.vb.title"),
            dWidth: "narrow",
            vb: null
        };
    },
    beforeMount() {
        this.initVB();
    },
    methods: {
        initVB() {
            const lastAccount =
                getCurrHDAcc() && getCurrHDAcc().isBifrost
                    ? getCurrHDAcc().activeAddr
                    : undefined;
            this.vb = initVB({ lastAccount });
            this.vb.on("connect", () => {
                this.close();
            });
            this.vb.on("disconnect", () => {
                this.initVB();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.head {
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    font-size: 14px;
    color: #333;
    font-family: $font-bold;
}
.code_container {
    width: 163px;
    height: 163px;
    margin: 0 auto;
    justify-content: center;
}
</style>

