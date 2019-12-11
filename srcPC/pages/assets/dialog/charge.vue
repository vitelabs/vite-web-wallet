<template lang="pug">
extends /components/dialog/base.pug
block head
    .head
        .__hint.no_top
            i18n(path='tokenCard.charge.tips.0' tag="span")
                span.strong(place="tokenSymbol") {{ getTokenSymbol(token) }}
        .__hint
            i18n(path='tokenCard.charge.tips.1' tag="span")
                span.strong(place="tokenSymbol") {{ getTokenSymbol(token) }}
                span.strong(place="min") {{ minimumDepositAmount }}
        .__hint
            i18n(path='tokenCard.charge.tips.2' tag="span")
                span.strong(place="confirmationCount") {{ confirmationCount }}
block content
    .__row
        span.__row_t {{$t('tokenCard.charge.addressTitle')}}
        img.copy.__pointer(v-show="!isLoading" src="~assets/imgs/copy_default.svg" @click="copy")
    div.ex-center-loading(v-show="isLoading")
        loading(loadingType="dot")
    div(v-show="!isLoading")
        .__input_row.__unuse_input.top {{ addrErr || address }}
        .qrcode-container {{ $t('tokenCard.charge.codeTips',{tokenSymbol:getTokenSymbol(token)}) }}
            qrcode(:text="addressQrcode" :options="qrOptions" class="qrcode-container__content")
        .__row(v-if="!!labelName&&!!labelValue")
            span.__row_t {{labelName}}
                span.red {{ $t('tokenCard.charge.labelTips',{labelName}) }}
            img.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copyLabel")
        .__input_row.__unuse_input.top(v-if="!!labelName") {{ labelValue }}
        .qrcode-container(v-if="!!labelName") {{ $t('tokenCard.charge.labelCodeTips',{labelName}) }}
            qrcode(:text="labelValue" :options="qrOptions" class="qrcode-container__content")
</template>

<script>
import loading from 'components/loading';
import qrcode from 'components/qrcode';
import copy from 'utils/copy';
import { modes } from 'qrcode.es';
import { getDepositInfo } from 'pcServices/gate';
import bigNumber from 'utils/bigNumber';

export default {
    components: { qrcode, loading },
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    beforeMount() {
        this.isLoading = true;
        getDepositInfo({ addr: this.defaultAddr, tokenId: this.token.tokenId },
            this.token.gateInfo.url)
            .then(res => {
                this.isLoading = false;
                this.address = res.depositAddress;
                this.minimumDepositAmountMin = res.minimumDepositAmount;
                this.labelName = res.labelName;
                this.labelValue = res.label;
                this.confirmationCount = res.confirmationCount;
            })
            .catch(() => {
                this.isLoading = false;
                this.addrErr = this.$t('tokenCard.charge.addrErr');
            });
    },
    data() {
        return {
            isLoading: true,
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
@import "pcComponents/confirm/confirmRow.scss";

.strong{
    color: $blue-color-1;
    @include font-family-bold();
}
.no_top {
    margin-top: 0;
}
.copy {
    float: right;
}
.ex-center-loading {
    text-align: center;
}
.top {
    margin-top: 12px;
}
.red {
    color: $red-color;
    margin-left: 4px;
}

.qrcode-container {
    [data-theme="0"] & {
        background: rgba(243, 246, 249, 1);
        border: 1px solid rgba(212, 222, 231, 1);
    }
    [data-theme="1"] & {
        background-color: $black-color-1;
    }
    margin-top: 20px;
    padding: 20px;
    font-size: 14px;
    line-height: 18px;
    @include font-family-normal();
    @include common_font_color();
    box-sizing: border-box;
    text-align: center;
    &__content {
        margin-top: 20px;
    }
}
.head {
    padding: 20px 30px;
    box-sizing: border-box;
    [data-theme="0"] & {
        border-bottom: 1px solid rgba(212, 222, 231, 1);
        background: rgba(0, 122, 255, 0.05);
    }
    [data-theme="1"] & {
        background: $black-color-3;
    }
}
</style>

