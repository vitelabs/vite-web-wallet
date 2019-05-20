<template>
    <div class="address-title">
        <span>{{ title }}</span>
        <span v-click-outside="closeQrCode" ref="codeContainer" class="title_icon __pointer qrcode">
            <img src="../assets/imgs/qrcode_default.svg" @click="toggleQrCode" />
            <div class="code-container" v-show="qrcodeShow">
                <div class="code">
                    <qrcode :text="addressQrcode"
                            :options="{ size:146 }"
                            @genImage="getImage"></qrcode>
                </div>
                <div class="btn" @click="downLoadQrCode">{{ $t('saveQrcode') }}</div>
            </div>
        </span>
        <img src="../assets/imgs/copy_default.svg" @click="copy" class="title_icon copy __pointer"/>
        <copyOK :copySuccess="copySuccess"></copyOK>
    </div>
</template>

<script>
import qrcode from 'components/qrcode';
import copyOK from 'components/copyOK';
import copy from 'utils/copy';

export default {
    components: { qrcode, copyOK },
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
            copySuccess: false,
            qrcode: null,
            qrcodeShow: false
        };
    },
    methods: {
        copy() {
            copy(this.address);

            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 1000);
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
            if (!codeContainer
                || e.target === codeContainer
                || codeContainer.contains(e.target)) {
                return;
            }

            this.qrcodeShow = false;
        },
        downLoadQrCode() {
            if (!this.qrcode) {
                return;
            }

            // IE
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                const arr = this.qrcode.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                window.navigator.msSaveBlob(new Blob([u8arr], { type: mime }), 'download.png');
            } else {
                location.href = this.qrcode.replace('image/png', 'image/octet-stream');
            }
            this.qrcodeShow = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.address-title {
    position: relative;
    display: block;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    letter-spacing: 0.35px;
    padding-bottom: 24px;
    font-family: $font-bold, arial, sans-serif;
}

.title_icon {
    float: right;

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
