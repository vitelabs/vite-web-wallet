<template>
    <div class="token-card-wrapper">
        <div class="symbol">{{ token.tokenSymbol || ''}}</div>
        <div class="amount">{{ token.income || ''}}</div>
        <div class="btn-list">
            <span v-if="token.status === 1" class="unuse">{{ $t('tradeOperator.permission') }}</span>
            <span v-if="token.status !== 1" class="__pointer"
                  @click="unlock('changeTransferTokenOwner')">
                {{ $t('tradeOperator.permission') }}</span>
            <span class="__pointer" @click="goTxPairManage">{{ $t('tradeOperator.txPairManage') }}</span>
        </div>

        <confirm v-show="isShowPermission"
                 :showMask="true" :singleBtn="true" :closeIcon="true"
                 :title="$t('tradeOperator.permissionConfirm.title')"
                 :leftBtnTxt="$t('tradeOperator.permissionConfirm.submit')"
                 :btnUnuse="btnUnuse" :close="close" :isLoading="isLoading"
                 :leftBtnClick="changeTransferTokenOwner">
            <div class="__row">
                <div class="__row_t">{{ $t('tradeOperator.permissionConfirm.tokenName') }}</div>
                <div class="__input_row __unuse_input __bold">{{ token.tokenSymbol || '' }}</div>
            </div>

            <div class="__row">
                <div class="__row_t">
                    {{ $t('tradeOperator.permissionConfirm.address') }}
                    <span v-show="!isValidAddress" class="__err">{{ $t('hint.addrFormat') }}</span>
                </div>
                <vite-input v-model="address" :valid="validAddr"
                            :placeholder="$t('wallet.placeholder.addr')"></vite-input>
            </div>

            <div class="__notice"><span>{{ $t('tradeOperator.permissionConfirm.notice') }}</span></div>
        </confirm>
    </div>
</template>

<script>
import { constant, hdAddr } from '@vite/vitejs';
import sendTx from 'utils/sendTx';
import { initPwd } from 'components/password/index.js';
import confirm from 'components/confirm/confirm.vue';
import viteInput from 'components/viteInput';
import { execWithValid } from 'utils/execWithValid';

export default {
    components: { confirm, viteInput },
    props: {
        token: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            address: '',
            isValidAddress: true,
            isShowPermission: false,
            isLoading: false
        };
    },
    computed: {
        btnUnuse() {
            return !this.address || !this.isValidAddress;
        }
    },
    methods: {
        validAddr() {
            if (!this.address) {
                this.isValidAddress = true;
                return;
            }
            this.isValidAddress = hdAddr.isValidHexAddr(this.address);
        },
        unlock: execWithValid(function () {
            this.isShowPermission = true;
        }),
        close() {
            this.isShowPermission = false;
            this.address = '';
            this.isValidAddress = true;
        },

        goTxPairManage() {
            this.$router.push({
                name: 'tradeTxPairManage',
                params: this.token
            });
        },
        changeTransferTokenOwner() {
            const tokenId = this.token.tokenId;

            initPwd({
                submit: () => {
                    this.isLoading = true;

                    sendTx({
                        methodName: 'callContract',
                        data: {
                            toAddress: constant.DexFund_Addr,
                            abi: { 'type': 'function', 'name': 'DexFundTransferTokenOwner', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'owner', 'type': 'address' } ] },
                            params: [ tokenId, this.address ],
                            tokenId
                        }
                    }).then(() => {
                        this.isLoading = false;
                        this.$toast(this.$t('hint.operateSuccess'));
                        this.close();
                    }).catch(err => {
                        console.warn(err);
                        this.$toast(this.$t('hint.operateFail'), err);
                        this.close();
                        this.isLoading = false;
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.token-card-wrapper {
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    box-sizing: border-box;
    padding: 20px 30px;
    margin: 14px 14px 0 0;
    .symbol {
        font-size: 14px;
        @include font-family-bold();
        color: rgba(94,104,117,1);
        line-height: 18px;
    }
    .amount {
        font-size: 18px;
        @include font-family-bold();
        color: rgba(29,32,36,1);
        line-height: 22px;
        margin: 8px 0 30px;
    }
    .btn-list {
        font-size: 12px;
        @include font-family-bold();
        color: rgba(0,122,255,1);
        span {
            display: inline-block;
            box-sizing: border-box;
            padding: 0 30px;
            min-width: 126px;
            text-align: center;
            height: 30px;
            line-height: 30px;
            background: rgba(0,122,255,0.05);
            border-radius: 2px;
            border: 1px solid rgba(0,122,255,0.3);
            &:first-child {
                margin-right: 12px;
            }
            &.unuse {
                background: #efefef;
                color: #666;
                border: none;
            }
        }
    }
}
</style>
