<template>
    <confirm class="small" :btnUnuse="btnUnuse"
             :showMask="true" :singleBtn="true"
             :title="$t('walletMintage.mintageConfirm.title')" :closeIcon="true"
             :close="close" :leftBtnTxt="$t('walletMintage.mintageConfirm.btn')"
             :leftBtnClick="toMintage">
        <div class="_row">
            <span class="_row_title">{{ $t('walletMintage.tokenName') }} : </span>{{ tokenInfo.tokenName }}
        </div>
        <div class="_row">
            <span class="_row_title">{{ $t('walletMintage.tokenSymbol') }} : </span>{{ tokenInfo.tokenSymbol }}
        </div>
        <div class="_row">
            <span class="_row_title">{{ $t('walletMintage.totalSupply') }} : </span>{{ tokenInfo.totalSupply }}
        </div>
        <div class="_row">
            <span class="_row_title">{{ $t('walletMintage.decimals') }} : </span>{{ tokenInfo.decimals }}
        </div>
        <div class="_row">
            <span class="_row_title">{{ $t('walletMintage.isReIssuable') }} : </span>{{ tokenInfo.isReIssuable }}
        </div>
        <div class="_row">
            <span class="_row_title">{{ $t('walletMintage.mintageConfirm.balance') }} : </span>{{ showBalance }}
        </div>
        <div class="_row">
            <span class="_row_title">{{ $t('walletMintage.mintageConfirm.fee') }} : </span>{{ fee }} VITE
            <span v-show="btnUnuse" class="err">{{ $t('hint.insufficientBalance') }}</span>
        </div>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import confirm from 'components/confirm/confirm.vue';
import { initPwd } from 'pcComponents/password/index.js';
import sendTx from 'pcUtils/sendTx';
import BigNumber from 'utils/bigNumber';

const fee = '1000';
const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { confirm },
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        clear: {
            type: Function,
            default: () => {}
        },
        tokenInfo: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return { fee };
    },
    computed: {
        btnUnuse() {
            const max = BigNumber.toMin(fee, Vite_Token_Info.decimals);
            return BigNumber.compared(this.balance, max) < 0;
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        },
        balance() {
            const tokenId = Vite_Token_Info.tokenId;
            return this.tokenBalList[tokenId] ? this.tokenBalList[tokenId].totalAmount : 0;
        },
        showBalance() {
            if (!this.balance) {
                return 0;
            }
            return BigNumber.toBasic(this.balance, Vite_Token_Info.decimals);
        }
    },
    methods: {
        toMintage() {
            initPwd({
                submit: () => {
                    this.mintage();
                }
            });
        },
        mintage() {
            const decimals = this.tokenInfo.decimals || 0;
            const totalSupply = BigNumber.toMin(this.tokenInfo.totalSupply || 0, decimals);
            const maxSupply = this.tokenInfo.isReIssuable ? BigNumber.toMin(this.tokenInfo.maxSupply || 0, decimals) : '0';
            const isOwnerBurnOnly = this.tokenInfo.isReIssuable ? !!this.tokenInfo.ownerBurnOnly : false;

            sendTx({
                methodName: 'issueToken',
                data: {
                    decimals,
                    maxSupply,
                    isOwnerBurnOnly,
                    totalSupply,
                    isReIssuable: !!this.tokenInfo.isReIssuable,
                    tokenName: this.tokenInfo.tokenName,
                    tokenSymbol: this.tokenInfo.tokenSymbol
                }
            }).then(() => {
                this.$toast(this.$t('walletMintage.hint.success'));
                this.$store.dispatch('getAllTokens');
                this.close && this.close();
                this.clear && this.clear();
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('walletMintage.hint.fail'), err);
            });
        }
    }

};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

._row {
    line-height: 40px;
    font-size: 14px;
    font-family: $font-normal;
    font-weight: 400;
    color: rgba(29,32,36,1);
    ._row_title {
        color: rgba(94,104,117,0.58);
    }
    .err {
        padding: 0 5px;
        border-left: 1px solid #D4DEE7;
        color: rgba(255,0,8,1);
    }
}
</style>

