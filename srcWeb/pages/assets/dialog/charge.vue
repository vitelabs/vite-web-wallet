<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title
        span {{$t('tokenCard.charge.addressTitle')}}
        img.title_icon.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copy")
    .block__content(:class="{err:addrErr}") {{addrErr||address}}
    .qrcode-container
        .qrcode-container__title {{$t('tokenCard.charge.codeTips',{tokenSymbol:getTokenSymbol(token)})}}
        qrcode(:text="addressQrcode" :options="qrOptions" class="qrcode-container__content")
    .block__title(v-if="!!labelName&&!!labelValue")
        span {{labelName}}
            span.red {{$t('tokenCard.charge.labelTips',{labelName})}}
        img.title_icon.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copyLabel")
    .block__content(v-if="!!labelName") {{labelValue}}
    .qrcode-container(v-if="!!labelName")
        .qrcode-container__title {{$t('tokenCard.charge.labelCodeTips',{labelName})}}
        qrcode(:text="labelValue" :options="qrOptions" class="qrcode-container__content")
    .charge-tips {{$t('tokenCard.charge.tips.0',{tokenSymbol:getTokenSymbol(token)})}}
        .dot
    .charge-tips {{$t('tokenCard.charge.tips.1',{tokenSymbol:getTokenSymbol(token),min:minimumDepositAmount})}}
        .dot
    .charge-tips {{$t('tokenCard.charge.tips.2',{confirmationCount})}}
        .dot
</template>

<script>
import qrcode from 'components/qrcode';
import copy from 'utils/copy';
import { modes } from 'qrcode.es';
import { getDepositInfo } from 'services/gate';
import bigNumber from 'utils/bigNumber';

export default {
    components: { qrcode },
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    beforeMount() {
        getDepositInfo({ addr: this.defaultAddr, tokenId: this.token.tokenId },
            this.token.gateInfo.url)
            .then(res => {
                this.address = res.depositAddress;
                this.minimumDepositAmountMin = res.minimumDepositAmount;
                this.labelName = res.labelName;
                this.labelValue = res.label;
                this.confirmationCount = res.confirmationCount;
            })
            .catch(() => (this.addrErr = this.$t('tokenCard.charge.addrErr')));
    },
    data() {
        return {
            confirmationCount: '',
            minimumDepositAmountMin: '',
            address: '',
            amount: 0,
            qrOptions: { size: 124, mode: modes.NORMAL },
            dTitle: this.$t('tokenCard.charge.title'),
            addrErr: '',
            labelName: '',
            labelValue: ''
        };
    },
    computed: {
        minimumDepositAmount() {
            return bigNumber.toBasic(this.minimumDepositAmountMin,
                this.token.decimals);
        },
        addressQrcode() {
            return this.address;
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        getTokenSymbol(token) {
            if (token.tokenSymbol === 'USDT' && token.index === 0) {
                return 'USDT(ERC20)';
            }
            return token.tokenSymbol;
        },
        copy() {
            copy(this.address);
            this.$toast(this.$t('hint.copy'));
        },
        copyLabel() {
            copy(this.labelValue);
            this.$toast(this.$t('hint.copy'));
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./dialog.scss";
@include block;

.block__title {
    .title_icon {
        width: 18px;
        height: 18px;
        float: right;
    }
    .red {
        color: #ff2929;
    }
}
.block__content {
    background: rgba(243, 246, 249, 1);
    color: #5e6875;
}
.qrcode-container {
    background: rgba(243, 246, 249, 1);
    border: 1px solid rgba(212, 222, 231, 1);
    margin-top: 20px;
    padding: 20px;
    font-size: 14px;
    line-height: 18px;
    @include font-family-normal();
    color: rgba(29, 32, 36, 1);
    box-sizing: border-box;
    text-align: center;
    &__content {
        margin-top: 20px;
    }
}
.charge-tips {
    @include font-family-normal();
    line-height: 18px;
    font-size: 14px;
    color: rgba(94, 104, 117, 1);
    padding-left: 13px;
    margin-top: 10px;
    position: relative;
    width: 100%;
    margin-top: 20px;
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

