<template>
    <div class="mintage __form_border">
        <div class="item">
            <div class="__form_input_title">{{ $t('walletMintage.address') }}</div>
            <div class="__form_input unuse">{{ activeAddr }}</div>

            <div class="row">
                <span class="__form_tips" :class="{'active': tipsType === 'tokenName'}">
                    {{  tipsType === 'tokenName' ? $t('walletMintage.hint.tokenName') : '' }}
                </span>
                <div class="__form_input_title">
                    {{ $t('walletMintage.tokenName') }}
                    <span v-show="tokenNameErr" class="err">{{ tokenNameErr }}</span>
                </div>
                <vite-input v-model="tokenName" :valid="isTokenName"
                            @blur="hideTips" @focus="showTips('tokenName')"></vite-input>
            </div>

            <div class="row">
                <span class="__form_tips" :class="{'active': tipsType === 'tokenSymbol'}">
                    {{  tipsType === 'tokenSymbol' ? $t('walletMintage.hint.tokenSymbol') : '' }}
                </span>
                <div class="__form_input_title">
                    {{ $t('walletMintage.tokenSymbol') }}
                    <span v-show="tokenSymbolErr" class="err">{{ tokenSymbolErr }}</span>
                </div>
                <vite-input v-model="tokenSymbol" :valid="isTokenSymbol"
                            @blur="hideTips" @focus="showTips('tokenSymbol')"></vite-input>
            </div>

            <div class="row">
                <span class="__form_tips" :class="{'active': tipsType === 'decimals'}">
                    {{  tipsType === 'decimals' ? $t('walletMintage.hint.decimals') : '' }}
                </span>
                <div class="__form_input_title">
                    {{ $t('walletMintage.decimals') }}
                    <span v-show="decimalsErr" class="err">{{ decimalsErr }}</span>
                </div>
                <vite-input v-model="decimals" @blur="hideTips" @focus="showTips('decimals')"></vite-input>
            </div>
        </div>

        <div class="item right">
            <div class="row">
                <div class="__form_input_title">
                    {{ $t('walletMintage.totalSupply') }}
                    <span v-show="totalSupplyErr" class="err">{{ totalSupplyErr }}</span>
                </div>
                <vite-input v-model="totalSupply"></vite-input>
            </div>

            <div class="row">
                <div class="__form_input_title">{{ $t('walletMintage.isReIssuable') }}</div>
                <bool-radio v-model="isReIssuable"></bool-radio>
            </div>

            <div class="row" v-show="isReIssuable">
                <div class="half">
                    <div class="__form_input_title">
                        {{ $t('walletMintage.maxSupply') }}
                        <span v-show="maxSupplyErr" class="err">{{ maxSupplyErr }}</span>
                    </div>
                    <vite-input v-model="maxSupply"></vite-input>
                </div>
                <div class="half">
                    <div class="__form_input_title">{{ $t('walletMintage.isOwnerBurnOnly') }}</div>
                    <bool-radio v-model="ownerBurnOnly"></bool-radio>
                </div>
            </div>

            <div v-show="canMintage" class="__form_btn __pointer" v-unlock-account="toMintage">{{ $t('walletMintage.mint') }}</div>
            <div v-show="!canMintage" class="__form_btn __pointer unuse">{{ $t('walletMintage.mint') }}</div>
        </div>

        <mintage-confirm v-if="tokenInfo" :tokenInfo="tokenInfo"
                         :close="closeConfirm" :clear="clearAll"></mintage-confirm>
    </div>
</template>

<script>
import { utils } from '@vite/vitejs';
import viteInput from 'components/viteInput';
import boolRadio from 'components/boolRadio';
import BigNumber from 'utils/bigNumber';
import mintageConfirm from './confirm';

const maxNum = BigNumber.exponentiated(2, 256, '-1');

export default {
    components: { viteInput, boolRadio, mintageConfirm },
    data() {
        return {
            tipsType: '',

            decimals: '0',
            isReIssuable: false,
            maxSupply: '0',
            ownerBurnOnly: true,
            totalSupply: '',
            tokenName: '',
            tokenSymbol: '',

            tokenNameErr: '',
            tokenSymbolErr: '',
            totalSupplyErr: '',
            decimalsErr: '',
            maxSupplyErr: '',

            tokenInfo: null
        };
    },
    computed: {
        activeAddr() {
            return this.$store.getters.activeAddr;
        },
        canMintage() {
            // Required
            if (!(this.decimals !== '' && this.totalSupply && this.tokenName && this.tokenSymbol)) {
                return false;
            }

            // if isReIssuable; maxSupply required
            if (this.isReIssuable && !this.maxSupply) {
                return false;
            }

            return !this.tokenNameErr && !this.tokenSymbolErr && !this.totalSupplyErr && !this.decimalsErr && !this.maxSupplyErr;
        }
    },
    watch: {
        isReIssuable() {
            if (this.isReIssuable) {
                return;
            }
            this.ownerBurnOnly = true;
            this.maxSupply = '';
            this.maxSupplyErr = '';
        },
        totalSupply() {
            this.isTotalSupply();
            this.isDecimals();
            this.isMaxSupply();
        },
        decimals() {
            this.isTotalSupply();
            this.isDecimals();
            this.isMaxSupply();
        },
        maxSupply() {
            this.isTotalSupply();
            this.isDecimals();
            this.isMaxSupply();
        }
    },
    methods: {
        isTokenName() {
            const Len = 40;
            const tokenName = this.tokenName.trim();

            if (!tokenName) {
                this.tokenNameErr = this.$t('walletMintage.err.tokenNameNull');
                return false;
            }

            if (!/^[a-zA-Z_]+(\s{1}[a-zA-Z_]+)*$/g.test(tokenName) || tokenName.length > Len) {
                this.tokenNameErr = this.$t('walletMintage.err.tokenNameFormat');
                return false;
            }

            this.tokenNameErr = '';
            return true;
        },
        isTokenSymbol() {
            const tokenSymbol = this.tokenSymbol.trim();

            if (!tokenSymbol) {
                this.tokenSymbolErr = this.$t('walletMintage.err.tokenSymbolNull');
                return false;
            }

            if (!/^[A-Z0-9]{1,10}$/g.test(tokenSymbol)) {
                this.tokenSymbolErr = this.$t('walletMintage.err.tokenSymbolFormat');
                return false;
            }

            this.tokenSymbolErr = '';
            return true;
        },
        isTotalSupply() {
            if (this.decimals === '' || this.decimalsErr) {
                this.totalSupplyErr = '';
                return false;
            }

            if (!this.totalSupply) {
                this.totalSupplyErr = this.$t('walletMintage.err.totalSupplyNull');
                return false;
            }

            if (!utils.isNonNegativeInteger(this.totalSupply)) {
                this.totalSupplyErr = this.$t('walletMintage.err.totalSupplyFormat');
                return false;
            }

            const decimals = this.decimals || 0;
            const unit = BigNumber.exponentiated(10, decimals);
            const totalSupply = BigNumber.multi(this.totalSupply, unit);

            if (BigNumber.compared(totalSupply, maxNum) > 0) {
                this.totalSupplyErr = this.$t('walletMintage.err.supplyMax');
                return false;
            }

            this.totalSupplyErr = '';
            return true;
        },
        isDecimals() {
            if (!this.decimals) {
                this.decimalsErr = this.$t('walletMintage.err.decimalsNull');
                return false;
            }

            if (!utils.isNonNegativeInteger(this.decimals)) {
                this.decimalsErr = this.$t('walletMintage.err.decimalsFormat');
                return false;
            }

            if (!this.totalSupply || this.totalSupplyErr) {
                this.decimalsErr = '';
                return false;
            }

            const min = BigNumber.exponentiated(10, this.decimals);

            if (BigNumber.compared(this.totalSupply, min) < 0) {
                this.decimalsErr = this.$t('walletMintage.err.decimalsMax');
                return false;
            }

            this.decimalsErr = '';
            return true;
        },
        isMaxSupply() {
            if (!this.isReIssuable) {
                this.maxSupplyErr = '';
                return true;
            }

            if (!this.maxSupply) {
                this.maxSupplyErr = this.$t('walletMintage.err.maxSupplyNull');
                return false;
            }

            if (!utils.isNonNegativeInteger(this.maxSupply)) {
                this.maxSupplyErr = this.$t('walletMintage.err.maxSupplyFormat');
                return false;
            }

            if ((this.totalSupply === '' || this.totalSupplyErr)
                || (this.decimals === '' || this.decimalsErr)) {
                this.maxSupplyErr = '';
                return false;
            }

            if (BigNumber.compared(this.maxSupply, this.totalSupply) < 0) {
                this.maxSupplyErr = this.$t('walletMintage.err.maxSupplyMin');
                return false;
            }

            const decimals = this.decimals || 0;
            const unit = BigNumber.exponentiated(10, decimals);
            const maxSupply = BigNumber.multi(this.maxSupply, unit);

            if (BigNumber.compared(maxSupply, maxNum) > 0) {
                this.maxSupplyErr = this.$t('walletMintage.err.supplyMax');
                return false;
            }

            this.maxSupplyErr = '';
            return true;
        },

        validAll() {
            this.isTokenName();
            this.isTokenSymbol();
            this.isTotalSupply();
            this.isDecimals();
            this.isMaxSupply();
        },
        clearAll() {
            this.decimals = '0';
            this.isReIssuable = false;
            this.maxSupply = '0';
            this.ownerBurnOnly = true;
            this.totalSupply = '';
            this.tokenName = '';
            this.tokenSymbol = '';
            this.$emit('fetchTokenList');
        },

        hideTips() {
            this.tipsType = '';
        },
        showTips(tipsType) {
            this.tipsType = tipsType;
        },

        toMintage() {
            this.validAll();
            if (!this.canMintage) {
                return;
            }

            this.tokenInfo = {
                tokenName: this.tokenName.trim(),
                tokenSymbol: this.tokenSymbol.trim(),
                totalSupply: this.totalSupply,
                decimals: this.decimals,
                isReIssuable: this.isReIssuable,
                maxSupply: this.maxSupply,
                ownerBurnOnly: this.ownerBurnOnly
            };
        },
        closeConfirm() {
            this.tokenInfo = null;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "../form.scss";

.mintage {
    width: 100%;

    .item {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        width: 50%;
        min-height: 330px;
        padding: 6px 25px 20px 30px;
        &.right {
            float: right;
        }

        .row {
            position: relative;
            .half {
                width: 45%;
                display: inline-block;
                &:last-child {
                    margin-left: 28px;
                }
            }
        }
    }
}

.__form_input_title {
    margin-top: 14px;
}
.__form_btn {
    position: absolute;
    bottom: 20px;
    right: 25px;
    left: 30px;
}
</style>
