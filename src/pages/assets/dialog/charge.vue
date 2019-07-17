<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title
        span {{$t('tokenCard.charge.addressTitle')}}
        img.title_icon.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copy")
    .block__content(:class="{err:addrErr}") {{addrErr||address}}
    .qrcode-container
        .qrcode-container__title {{$t('tokenCard.charge.codeTips',{tokenSymbol:token.tokenSymbol})}}
        qrcode(:text="addressQrcode" :options="qrOptions" class="qrcode-container__content")
    .charge-tips {{$t('tokenCard.charge.tips.0',{tokenSymbol:token.tokenSymbol})}}
        .dot
    .charge-tips {{$t('tokenCard.charge.tips.1',{tokenSymbol:token.tokenSymbol,min:minimumDepositAmount})}}
        .dot
    .charge-tips {{$t('tokenCard.charge.tips.2')}}
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
        getDepositInfo({ addr: this.defaultAddr, tokenId: this.token.tokenId }, this.token.gateInfo.url).then(res => {
            this.address = res.depositAddress;
            this.minimumDepositAmountMin = res.minimumDepositAmount;
        }).catch(() => (this.addrErr = this.$t('tokenCard.charge.addrErr')));
    },
    data() {
        return {
            minimumDepositAmountMin: '',
            address: '',
            amount: 0,
            qrOptions: { size: 124, mode: modes.NORMAL },
            dTitle: this.$t('tokenCard.charge.title'),
            addrErr: ''
        };
    },
    computed: {
        minimumDepositAmount() {
            return bigNumber.toBasic(this.minimumDepositAmountMin, this.token.decimals);
        },
        addressQrcode() {
            if (this.token.type === 'OFFICAL_GATE' && this.token.tokenSymbol === 'BTC') return `bitcoin:${ this.address }`;
            return this.address;
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        copy() {
            copy(this.address);
            this.$toast(this.$t('hint.copy'));
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./dialog.scss";
@include block;

.block__title .title_icon {
    width: 18px;
    height: 18px;
    float: right;
}
.block__content {
    background: rgba(243, 246, 249, 1);
    color: #5E6875
}
.qrcode-container {
    background: rgba(243, 246, 249, 1);
    border: 1px solid rgba(212, 222, 231, 1);
    margin-top: 20px;
    padding: 20px;
    font-size: 14px;
    line-height: 18px;
    @include font-family-normal();
    color: rgba(29,32,36,1);
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

