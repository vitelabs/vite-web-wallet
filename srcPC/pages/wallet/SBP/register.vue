<template>
    <div class="register-wrapper">
        <div class="row">
            <div class="item">
                <div class="__form_input_title">
                    {{ $t('walletSBP.section1.nodeName') }}
                    <span v-show="nodeNameErr" class="err">{{ nodeNameErr }}</span>
                </div>
                <span class="__form_tips" :class="{'active': tipsType === 'name'}">
                    {{  tipsType === 'name' ? $t('walletSBP.section1.nameHint') : '' }}
                </span>
                <vite-input v-model="nodeName" :valid="testName"
                            :placeholder="$t('walletSBP.section1.namePlaceholder')"
                            @blur="hideTips" @focus="showTips('name')"></vite-input>
            </div>
            <div class="item">
                <div class="__form_input_title">
                    {{ $t('walletSBP.section1.producerAddr') }}
                    <span v-show="producerAddrErr" class="err">{{ producerAddrErr }}</span>
                </div>
                <span class="__form_tips" :class="{'active': tipsType === 'addr'}">
                    {{ tipsType === 'addr' ? $t('walletSBP.section1.addrHint') : '' }}
                </span>
                <vite-input v-model="producerAddr" :valid="testAddr"
                            :placeholder="$t('walletSBP.section1.addrPlaceholder')"
                            @blur="hideTips" @focus="showTips('addr')"></vite-input>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="__form_input_title">{{ $t('walletSBP.section1.quotaAddr') }}</div>
                <div class="__form_input all unuse __ellipsis">{{ quotaAddr }}</div>
            </div>
            <div class="item">
                <div class="__form_input_title">{{ $t('walletSBP.section1.quotaTime') }}</div>
                <div class="__form_input all unuse __ellipsis">{{ $t('walletSBP.section1.time') }}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="__form_input_title">
                    {{ $t('stakingAmount') }}
                    <span v-show="amountErr" class="err">{{ amountErr }}</span>
                </div>
                <div class="__form_input all unuse __ellipsis">1,000,000 VITE</div>
            </div>
            <div class="item">
                <div v-show="!btnUnuse" class="__form_btn __pointer" :class="{
                    'unuse': btnUnuse
                }" @click="_validTx">{{ $t('walletSBP.section1.confirmBtn') }}</div>
                <div v-show="btnUnuse" class="__form_btn __pointer"  :class="{
                    'unuse': btnUnuse
                }">{{ $t('walletSBP.section1.confirmBtn') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { wallet, constant } from '@vite/vitejs';
import viteInput from 'components/viteInput';
import { initPwd } from 'pcComponents/password/index.js';
import sendTx from 'pcUtils/sendTx';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { execWithValid } from 'pcUtils/execWithValid';

const Vite_Token_Info = constant.Vite_Token_Info;
const amount = 1000000;

export default {
    components: { viteInput },
    props: {
        canUseAddr: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            nodeName: '',
            nodeNameErr: '',
            producerAddr: '',
            producerAddrErr: '',
            tipsType: '',
            loading: false
        };
    },
    destroyed() {
        this.$store.dispatch('stopLoopRegList');
    },
    computed: {
        quotaAddr() {
            return this.$store.getters.activeAddr;
        },
        regNameList() {
            return this.$store.getters.regNameList;
        },
        regAddrList() {
            return this.$store.getters.regAddrList;
        },
        amountErr() {
            const balance = this.tokenBalList[Vite_Token_Info.tokenId] ? this.tokenBalList[Vite_Token_Info.tokenId].totalAmount : 0;
            const minAmount = BigNumber.toMin(amount, Vite_Token_Info.decimals);
            if (BigNumber.compared(balance, minAmount) < 0) {
                return this.$t('hint.insufficientBalance');
            }

            return '';
        },
        btnUnuse() {
            return this.amountErr || this.loading || !this.nodeName || !this.producerAddr || this.nodeNameErr || this.producerAddrErr;
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        }
    },
    watch: {
        producerAddr: function () {
            this.hideTips();
        },
        nodeName: function () {
            this.hideTips();
        }
    },
    methods: {
        testName() {
            const nodeName = this.nodeName.trim();
            if (!nodeName) {
                return;
            }

            if (!nodeName
                || !/^[a-zA-Z0-9_\.]+$/g.test(nodeName)
                || nodeName.length > 40) {
                this.nodeNameErr = this.$t('walletSBP.section1.nameErr');

                return;
            }

            if (this.regNameList.indexOf(nodeName) !== -1) {
                this.nodeNameErr = this.$t('walletSBP.section1.nameUsed');
                return;
            }

            this.producerAddr && this.testAddr();
            this.nodeNameErr = '';
        },
        testAddr() {
            if (!this.producerAddr) {
                return;
            }

            if (!wallet.isValidAddress(this.producerAddr)) {
                this.producerAddrErr = this.$t('walletSBP.section1.addrErr');
                return;
            }

            const nodeName = this.nodeName.trim();
            if (!this.canUseAddr(nodeName, this.producerAddr)) {
                this.producerAddrErr = this.$t('walletSBP.section1.addrUsed');
                return;
            }

            this.producerAddrErr = '';
        },

        hideTips() {
            this.tipsType = '';
        },
        showTips(type) {
            this.tipsType = type;
        },

        clearAll() {
            this.producerAddr = '';
            this.nodeName = '';
            this.nodeNameErr = '';
            this.producerAddrErr = '';
        },

        _validTx() {
            statistics.event(this.$route.name, 'regSBP', this.quotaAddr || '');
            this.validTx();
        },
        validTx: execWithValid(function () {
            if (this.loading) {
                return;
            }

            this.testName();
            this.testAddr();
            if (this.btnUnuse) {
                return;
            }

            initPwd({
                title: this.$t('walletSBP.confirm.title'),
                submitTxt: this.$t('walletSBP.confirm.rightBtn'),
                cancelTxt: this.$t('walletSBP.confirm.leftBtn'),
                content: this.$t('walletSBP.confirm.describe', { amount }),
                submit: () => {
                    this.sendRegisterTx();
                }
            }, true);
        }),
        sendRegisterTx() {
            this.loading = true;
            const nodeName = this.nodeName.trim();
            const producerAddr = this.producerAddr;

            sendTx({
                methodName: 'registerSBP',
                data: {
                    sbpName: nodeName,
                    blockProducingAddress: producerAddr,
                    rewardWithdrawAddress: producerAddr,
                    amount: BigNumber.toMin(amount, Vite_Token_Info.decimals)
                },
                config: {
                    pow: false,
                    confirm: {
                        showMask: true,
                        operate: this.$t('walletSBP.register')
                    }
                }
            }).then(() => {
                this.loading = false;
                this.$toast(this.$t('walletSBP.section1.registerSuccess'));
                this.clearAll();

                this.$store.dispatch('loopRegList', {
                    nodeName,
                    operate: 1,
                    producer: producerAddr
                });
            }).catch(err => {
                console.warn(err);
                this.loading = false;
                this.$toast(this.$t('walletSBP.section1.registerFail'), err);
            });
        }
    }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "../form.scss";

.register-wrapper {
    position: relative;
    padding: 6px 30px 30px 20px;

    .row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .item {
            position: relative;
            display: inline-block;
            width: 49%;
            min-width: 470px;
            margin-top: 14px;

            &:first-child {
                margin-right: 10px;
            }
        }

        .__form_btn {
            position: relative;
            bottom: -28px;
            width: 100%;
        }
    }

    .__form_input.all {
        width: 100%;
    }
}
</style>

