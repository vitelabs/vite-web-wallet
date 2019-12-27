<template>
    <div v-click-outside.includeChildrens="closeQrCode" class="qrcode-popup">
        <div @click="toggleQrCode" class="btn-wrapper">
            <slot></slot>
        </div>
        <div class="code-container" v-show="qrcodeShow">
            <div class="code">
                <qrcode
                    :text="qrcodeString"
                    :options="{ size: 146 }"
                    @genImage="getImage"
                ></qrcode>
            </div>
            <div class="btn __pointer" @click="downLoadQrCode">
                {{ $t("saveQrcode") }}
            </div>
        </div>
    </div>
</template>

<script>
import qrcode from 'components/qrcode';
import { fromBase64 } from 'utils/downloadImg';

export default {
    components: { qrcode },
    props: {
        qrcodeString: {
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
        getImage(i) {
            this.qrcode = i;
        },
        toggleQrCode() {
            this.qrcodeShow = !this.qrcodeShow;
        },
        closeQrCode() {
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
.qrcode-popup {
    display: flex;
    position: relative;
    .btn-wrapper{
        display: flex;
    }
    .code-container {
        [data-theme="0"] & {
            box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
        }
        @include bg_color_4();
        width: 166px;
        padding: 10px;
        position: absolute;
        right: 100%;
        transform: translateX(20px);
        z-index: 1;
        .code {
            width: 146px;
            height: 146px;
            padding: 10px;
            background: #fff;
        }

        .btn {
            background: $blue-color-1;
            border-radius: 2px;
            color: #fff;
            margin: 10px 8px;
            height: 28px;
            text-align: center;
            line-height: 28px;
        }
    }
}
</style>
