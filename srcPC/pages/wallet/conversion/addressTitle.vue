<template>
    <div class="address-title">
        <div class="pre-title">
            <slot></slot>
        </div>
        <img src="~assets/imgs/copy_default.svg"
             @click="copy" class="title_icon copy __pointer"/>
        <span v-click-outside="closeQrCode"
              ref="codeContainer"
              class="title_icon __pointer qrcode">
            <img src="~assets/imgs/qrcode_default.svg" @click="toggleQrCode"/>
            <div class="code-container" v-show="qrcodeShow">
                <div class="code">
                    <qrcode :text="addressQrcode"
                            :options="{ size: 146 }"
                            @genImage="getImage"></qrcode>
                </div>
                <div class="btn" @click="downLoadQrCode">
                    {{ $t("saveQrcode") }}
                </div>
            </div>
        </span>
        <copy ref="copyDom" class="copy-wrapper"></copy>
    </div>
</template>

<script>
import qrcode from 'components/qrcode';
import copy from 'components/copy';
import { fromBase64 } from 'utils/downloadImg';

export default {
    components: { qrcode, copy },
    props: {
        title: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        addressQrcode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            qrcode: null,
            qrcodeShow: false
        };
    },
    methods: {
        copy() {
            this.$refs.copyDom.copy(this.address);
        },
        getImage(i) {
            this.qrcode = i;
        },
        toggleQrCode() {
            this.qrcodeShow = !this.qrcodeShow;
        },
        closeQrCode(e) {
            if (!e || !e.target) {
                return;
            }

            const codeContainer = this.$refs.codeContainer;
            if (
                !codeContainer
                || e.target === codeContainer
                || codeContainer.contains(e.target)
            ) {
                return;
            }

            this.qrcodeShow = false;
        },
        downLoadQrCode() {
            if (!this.qrcode) {
                return;
            }
            fromBase64(this.qrcode);
            this.qrcodeShow = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.address-title {
    position: relative;
    display: flex;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    letter-spacing: 0.35px;
    padding-bottom: 11px;
    @include font-family-bold();
    .pre-title {
        flex: 1;
    }
}

.title_icon {
    &.qrcode {
        position: relative;
    }

    .code-container {
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
        width: 166px;
        padding: 10px;
        position: absolute;
        right: 100%;
        transform: translateX(20px);
        background: #fff;
        z-index: 1;

        .code {
            width: 146px;
            height: 146px;
            margin: 10px;
        }

        .btn {
            background: #007aff;
            border-radius: 2px;
            color: #fff;
            margin: 10px 8px;
            height: 28px;
            text-align: center;
            line-height: 28px;
        }
    }

    &.copy {
        margin-right: 10px;
    }
}
</style>
