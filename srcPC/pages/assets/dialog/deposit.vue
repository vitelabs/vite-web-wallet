<template lang="pug">
extends /components/dialog/base.pug
block head
    .head
        .__hint.no_top
            i18n(path='tokenCard.charge.tips.0' tag="span")
                strong.strong(place="tokenSymbol") {{ tokenSymbol }}
                strong.strong(place="min") {{ minimumDepositAmount }}
        .__hint
            i18n(path='tokenCard.charge.tips.1' tag="span")
                strong.strong(place="tokenSymbol") {{ tokenSymbol }}
                strong.strong(place="min") {{ minimumDepositAmount }}
                strong.strong(place="confirmationCount") {{ confirmationCount }}
        .__hint
            i18n(path='tokenCard.charge.tips.2' tag="span")
        tips(v-if="noticeMsg" class="tips") {{noticeMsg}}
        div(v-if="multiNetwork && multiNetwork.length")
            select-network(v-model="selectedNetwork" :list="multiNetwork" @change="onChangeNetwork")
block content
    .__row
        span.__row_t {{$t('tokenCard.charge.addressTitle')}}
        img.copy.__pointer(v-show="!isLoading" src="~assets/imgs/copy_default.svg" @click="copy")
    div.ex-center-loading(v-show="isLoading")
        loading(loadingType="dot")
    div(v-if="!isLoading" :key="selectedNetwork")
        .__input_row.__unuse_input.top.more {{ addrErr || address }}
        .qrcode-container(v-if="address") {{ $t('tokenCard.charge.codeTips',{tokenSymbol}) }}
            qrcode(:text="addressQrcode" :options="qrOptions" class="qrcode-container__content")
        .__row(v-if="showLabel")
            span.__row_t {{labelName}}
                span.red {{ $t('tokenCard.charge.labelTips',{labelName}) }}
            img.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copyLabel")
        .__input_row.__unuse_input.top(v-if="showLabel") {{ labelValue }}
        .qrcode-container(v-if="showLabel") {{ $t('tokenCard.charge.labelCodeTips',{labelName}) }}
            qrcode(:text="labelValue" :options="qrOptions" class="qrcode-container__content")
</template>

<script>
import loading from 'components/loading';
import qrcode from 'components/qrcode';
import tips from 'pcComponents/tips';
import copy from 'utils/copy';
import selectNetwork from './selectNetwork';
import { modes } from 'qrcode.es';
import { getDepositInfo, getMetaInfo } from 'pcServices/gate';
import bigNumber from 'utils/bigNumber';

export default {
    components: { qrcode, loading, selectNetwork, tips },
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    beforeMount() {
        this.getDepositInfo();
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
            type: -1,
            addrErr: '',
            labelName: '',
            labelValue: '',
            selectedNetwork: 0,
            noticeMsg: ''
        };
    },
    computed: {
        showLabel() {
            return this.type === 1 && !!this.labelName && !!this.labelValue;
        },
        minimumDepositAmount() {
            return bigNumber.toBasic(this.minimumDepositAmountMin,
                this.token.decimals);
        },
        addressQrcode() {
            return this.address;
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        multiNetwork() {
            return this.token.gateInfo.multiNetwork;
        },

        /*
            gateInfoExample:
            {
                decimal: 18
                icon: ""
                name: "Ether"
                platform: "ETH"
                symbol: "ETH"
                tokenAddress: null
                tokenCode: "1"
                tokenIndex: null,
                url: ''
            }
        */
        gateInfo() {
            if (this.multiNetwork && this.multiNetwork.length) {
                return this.multiNetwork[this.selectedNetwork];
            }
            return this.token.gateInfo.mappedToken || this.token.gateInfo;
        },
        tokenSymbol() {
            if (this.gateInfo.standard) {
                return `${ this.token.tokenSymbol } (${ this.gateInfo.standard }) `;
            }
            return this.token.tokenSymbol;
        }
    },
    methods: {
        copy() {
            copy(this.address);
            this.$toast(this.$t('hint.copy'));
        },
        copyLabel() {
            copy(this.labelValue);
            this.$toast(this.$t('hint.copy'));
        },
        getDepositInfo() {
            this.isLoading = true;
            this.clearData();
            Promise.all([
                getMetaInfo({ tokenId: this.token.tokenId }, this.gateInfo.url).then(res => {
                    this.type = res.type;
                }),
                getDepositInfo({ addr: this.defaultAddr, tokenId: this.token.tokenId },
                    this.gateInfo.url)
                    .then(res => {
                        this.address = res.depositAddress;
                        this.minimumDepositAmountMin = res.minimumDepositAmount;
                        this.labelName = res.labelName;
                        this.labelValue = res.label;
                        this.confirmationCount = res.confirmationCount;
                        this.noticeMsg = res.noticeMsg;

                        // Custom for vite new erc20 tips
                        if (this.token.tokenSymbol === 'VITE') {
                            this.noticeMsg = this.$t('tokenCard.viteTips');
                        }
                    }) ]).catch(() => (this.addrErr = this.$t('tokenCard.charge.addrErr'))).finally(() => {
                this.isLoading = false;
            });
        },
        onChangeNetwork() {
            this.getDepositInfo();
        },
        clearData() {
            this.address = '';
            this.minimumDepositAmountMin = '';
            this.labelName = '';
            this.labelValue = '';
            this.confirmationCount = 0;
            this.addrErr = '';
            this.noticeMsg = '';
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
.__input_row.more {
    height: auto;
    word-break: break-word;
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
    display: flex;
    flex-direction: column;
    &__content {
        margin: 20px auto 0;
        justify-content: center;
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

.tips {
    font-size: 12px;
    margin-top: 20px;
    border: none;
}
</style>

