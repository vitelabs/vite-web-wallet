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

.block__title {
    height: 16px;
    font-size: 14px;
    @include font-family-bold();
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
    word-break: break-word;
    width: 100%;
    line-height: 40px;
    box-sizing: border-box;
    margin-top: 16px;
    text-align: center;
    &.err{
        color: #FF2929;
    }
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
    font-size: 16px;
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

