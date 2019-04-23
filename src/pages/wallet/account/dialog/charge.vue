<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title
        span 接收地址
        img.title_icon.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copy")
    .block__content {{address}}
    .qrcode-container
        .qrcode-container__title 请扫码向我转入{{token.tokenSymbol}}
        qrcode(:text="addressQrcode" :options="qrOptions" class="qrcode-container__content")
    .charge-tips 充值操作是将ETH跨链映射至VITE网络，充值后您可通过提现转走
        .dot
</template>

<script>
import qrcode from 'components/qrcode';
import copyOK from 'components/copyOK';
import copy from 'utils/copy';
import { utils } from '@vite/vitejs';
import { modes } from 'qrcode.es';
import { getChargeAddr } from 'services/gate';
import { wallet } from 'utils/wallet';
export default {
    components: { qrcode, copyOK },
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            address: '',
            copySuccess: false,
            amount: 0,
            qrOptions: { size: 124, mode: modes.NORMAL }
        };
    },
    beforeMount() {
        getChargeAddr({ addr: wallet.defaultAddr, tokenId: this.token.tokenId }).then(addr => (this.address = addr));
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
            return utils.uriStringify({
                target_address: this.address,
                params: { amount: this.amount }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.block__title {
    height: 16px;
    font-size: 14px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(29, 32, 36, 1);
    line-height: 16px;
    margin-top: 20px;
    &:first-child {
        margin-top: 0;
    }
    .title_icon {
        float: right;
        &.copy {
            margin-right: 10px;
        }
    }
}
.block__content {
    height: 40px;
    background: rgba(243, 246, 249, 1);
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    font-size: 14px;
    word-break: break-all;
    width: 100%;
    line-height: 40px;
    box-sizing: border-box;
    margin-top: 16px;
    text-align: center;
    &input {
        text-align: left;
    }
}
.qrcode-container {
    width: 455px;
    background: rgba(243, 246, 249, 1);
    border: 1px solid rgba(212, 222, 231, 1);
    margin-top: 20px;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    &__content {
        margin-top: 22px;
    }
}
.charge-tips {
    height: 18px;
    font-size: 14px;
    color: rgba(94, 104, 117, 1);
    line-height: 18px;
    padding-left: 13px;
    margin-top: 20px;
    position: relative;
    width: 100%;
    .dot {
        width: 6px;
        height: 6px;
        background: rgba(0, 122, 255, 1);
        border-radius: 100%;
        position: absolute;
        left: 0;
        top: 6px;
    }
}
</style>

