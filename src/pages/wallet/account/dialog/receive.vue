<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title
        span {{$t('tokenCard.receive.addressTitle')}}
        img.title_icon.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copy")
    .block__content {{address}}
        // copyOK(ref="copyTpis")
    .block__title {{$t('tokenCard.receive.amountTitle')}}
        .err {{amountErr}}
    input.block__content.edit(v-model="amount" :placeholder="$t('tokenCard.receive.amountPlaceholder')")
    .qrcode-container
        .qrcode-container__title {{$t('tokenCard.receive.codeTips',{tokenSymbol:token.tokenSymbol})}}
        qrcode(:text="addressQrcode" :options="qrOptions" class="qrcode-container__content")

</template>

<script>
import qrcode from 'components/qrcode';
import copyOK from 'components/copyOK';
import copy from 'utils/copy';
import { utils } from '@vite/vitejs';
import { modes } from 'qrcode.es';
import { wallet } from 'utils/wallet';
import { getValidBalance } from 'utils/validations';

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
            copySuccess: false,
            amount: '',
            qrOptions: { size: 124, mode: modes.NORMAL },
            dTitle: this.$t('tokenCard.receive.title')

        };
    },
    methods: {
        copy() {
            copy(this.address);
            // this.$refs.copyTpis.copyOk();
        }
    },
    computed: {
        amountErr() {
            return getValidBalance({ decimals: this.token.decimals })(this.amount);
        },
        address() {
            return wallet.defaultAddr;
        },
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
    display: flex;
    justify-content: space-between;
    .err{
        color: red;
    }
    &:first-child{
        margin-top: 0;
    }
    .title_icon {
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
    &.edit{
        text-align: left;
        background: rgba(255,255,255,1);
        padding-left: 15px;
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
    font-size:16px;
    &__content{
        margin-top: 22px;

    }
}
</style>

