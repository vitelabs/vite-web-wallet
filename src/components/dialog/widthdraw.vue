<template lang="pug">
extends ./base.pug
block content
    .block__title 账户余额
    .block__content.edit.space {{address}}
        div
            img
            .symbol
        .right.blue amount
    .block__title 提现地址
    .block__content {{address}}
    .block__title 提现金额
    .block__content {{address}}
    .block__title 手续费
    .block__content.edit.space {{address}}
        div   提现手续费
        div fee symbol
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
    padding:15px;
    &.edit{
        text-align: left;
        background:rgba(255,255,255,1);
    }
    &.space{
        display: flex;
        justify-content: space-between;
    }
}
</style>

