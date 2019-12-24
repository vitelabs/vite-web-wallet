<template>
    <div class="add-quota-wrapper __form_border">
        <div class="row">
            <div class="item">
                <div class="__form_input_title">{{ $t('walletFullNode.addQuota.address') }}</div>
                <div class="__form_input all unuse __ellipsis">{{ addr }}</div>
            </div>
            <div class="item">
                <div class="__form_input_title">{{ $t('walletFullNode.addQuota.stakeDays') }}</div>
                <div class="__form_input all unuse">{{ $t('walletQuota.aboutDays', { day: '30' }) }}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="__form_input_title">
                    {{ $t('stakingAmount') }}
                    <span v-show="amountErr" class="err">{{ amountErr }}</span>
                </div>
                <vite-input class="pledge-input-wrapper" type="number"
                            v-model="amount" :valid="testAmount"
                            :placeholder="$t('walletFullNode.addQuota.placeholder', { min: minNum })">
                    <span slot="after" class="unit">VITE</span>
                </vite-input>
            </div>
            <div class="item">
                <div v-show="!btnUnuse" class="__form_btn __pointer" @click="validTx">{{ $t('submitStaking') }}</div>
                <div v-show="btnUnuse"  class="__form_btn unuse">{{ $t('submitStaking') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';
import viteInput from 'components/viteInput';
import { initPwd } from 'pcComponents/password/index.js';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import sendTx from 'pcUtils/sendTx';
import { verifyAmount } from 'pcUtils/validations';
import { execWithValid } from 'pcUtils/execWithValid';

const Vite_Token_Info = constant.Vite_Token_Info;
const amountTimeout = null;
const minNum = 10000;

const StakeABI = { 'inputs': [], 'name': 'stake', 'outputs': [], 'payable': true, 'type': 'function' };
const StakeABIContractAddress = 'vite_d1e0e6ed537123dc42df067968366a736234fb20905f07566f';

export default {
    components: { viteInput },
    destroyed() {
        this.clearAll();
    },
    data() {
        return {
            minNum,
            amount: '',
            amountErr: '',
            loading: false
        };
    },
    computed: {
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        addr() {
            return this.$store.getters.activeAddr;
        },
        btnUnuse() {
            return this.loading || this.amountErr || !this.amount;
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        }
    },
    methods: {
        testAmount() {
            const balance = this.tokenBalList && this.tokenBalList[Vite_Token_Info.tokenId]
                ? this.tokenBalList[Vite_Token_Info.tokenId].totalAmount : 0;

            this.amountErr = verifyAmount({
                formatDecimals: 8,
                decimals: Vite_Token_Info.decimals,
                balance,
                minAmount: BigNumber.toMin(minNum, Vite_Token_Info.decimals),
                errorMap: { lessMin: this.$t('walletQuota.limitAmt', { num: minNum }) }
            })(this.amount);

            return !this.amountErr;
        },

        clearAll() {
            clearTimeout(amountTimeout);
            this.amount = '';
            this.amountErr = '';
        },

        validTx() {
            this._validTx();
        },
        _validTx: execWithValid(function () {
            if (this.btnUnuse) {
                return;
            }

            statistics.event(this.$route.name, 'SubmitQuota', this.addr || '');

            this.testAmount();
            if (this.amountErr) {
                return;
            }

            initPwd({
                title: this.$t('submitStaking'),
                submitTxt: this.$t('walletQuota.confirm.submit.rightBtn'),
                cancelTxt: this.$t('walletQuota.confirm.submit.leftBtn'),
                content: this.$t('walletFullNode.confirmText', { amount: this.amount, days: 30 }),
                submit: () => {
                    this.sendPledgeTx();
                }
            }, true);
        }),

        sendPledgeTx() {
            statistics.event(this.$route.name, 'FullNode-ConfirmQuota', this.addr || '');

            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            this.loading = true;
            const amount = BigNumber.toMin(this.amount || 0, Vite_Token_Info.decimals);

            sendTx({
                methodName: 'callContract',
                data: {
                    toAddress: StakeABIContractAddress,
                    abi: StakeABI,
                    tokenId: Vite_Token_Info.tokenId,
                    amount
                },
                config: {
                    pow: true,
                    powConfig: {
                        cancel: () => {
                            this.loading = false;
                        }
                    }
                }
            }).then(() => {
                this.loading = false;
                this.$toast(this.$t('hint.request', { name: this.$t('submitStaking') }));
                this.clearAll();
            }).catch(err => {
                console.warn(err);
                this.loading = false;
                err && this.$toast(this.$t('walletQuota.pledgeFail'), err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../form.scss";

.add-quota-wrapper {
    position: relative;
    padding: 0 30px 22px;
    .row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
            display: inline-block;
            width: 49%;
            min-width: 510px;
            margin-top: 14px;
        }
    }
    .__form_input.all {
        width: 100%;
    }
    .__form_btn {
        width: 100%;
        margin-top: 28px;
    }
    .unit {
        padding: 0 15px;
    }
}
</style>
