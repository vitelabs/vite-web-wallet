<template lang="pug">
extends ./base.pug
block content
    .body
    .head
        span 接收地址
        img.title_icon.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copy")
    .block__content {{address}}
    .qrcode-container
        .qrcode-container__title 请扫码向我转入{{tokenSymbol}}
        qrcode(:text="addressQrcode" :options="qrOptions" class="qrcode-container__content")
    .tips 充值操作是将ETH跨链映射至VITE网络，充值后您可通过提现转走
        .dot
    copyOK(:copySuccess="copySuccess")
</template>

<script>
import qrcode from 'components/qrcode';
import copyOK from 'components/copyOK';
import copy from 'utils/copy';
import { utils } from '@vite/vitejs';
import { modes } from 'qrcode.es';
export default {
    components: { qrcode, copyOK },
    props: {
        address: {
            type: String,
            default: ''
        },
        tokenSymbol: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            copySuccess: false,
            amount: 0,
            qrOptions: { size: 124, mode: modes.NORMAL }
        };
    },
    methods: {
        copy() {
            copy(this.address);
            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 1000);
        }
    },
    computed: {
        addressQrcode() {
            return utils.tools.uriStringify({
                target_address: this.address,
                params: { amount: this.amount }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.body {
    .head {
        box-sizing: border-box;
        padding: 30px;
        display: flex;
        .icon {
            width: 40px;
            height: 40px;
        }
        .token__title {
            display: flex;
            flex-direction: column;
            &__name {
                font-family: $font-bold;
                color: rgba(29, 32, 36, 1);
            }
            &__symbol {
                font-size: 12px;
                color: rgba(94, 104, 117, 1);
            }
        }
    }
}
</style>

