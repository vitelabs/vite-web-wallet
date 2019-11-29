<template>
    <confirm v-show="isShow" :showMask="true" :title="$t('tradeMining.addTitle') "
             :closeIcon="true" :close="close"
             :leftBtnClick="staking" :leftBtnTxt="$t('tradeMining.addBtn')"
             :singleBtn="true" :btnUnuse="!canOrder">

        <div class="__row">
            <div class="__row_t">{{ $t('tokenCard.heads.availableExAmount') }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="viteTokenInfo ? viteTokenInfo.icon : ''" class="__icon" />VITE
                <span class="__right">{{ exViteBalance }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">
                {{ $t('wallet.sum') }}
                <span v-show="amountErr" class="__err">{{ amountErr }}</span>
            </div>
            <vite-input v-model="amount" :valid="testAmount" :placeholder="$t('tradeMining.addPlaceHolder')"></vite-input>
        </div>

        <div class="__hint"><span>{{ $t('tradeMining.addHint') }}</span></div>

    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import viteInput from 'components/viteInput';
import sendTx from 'pcUtils/sendTx';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { verifyAmount } from 'pcUtils/validations';
import router from 'pcRouter';
import { abiList } from 'services/apiServer';

const minLimit = 134;

export default {
    components: { confirm, viteInput },
    data() {
        return {
            amount: '',
            amountErr: '',
            isShow: false
        };
    },
    computed: {
        canOrder() {
            return this.amount && !this.amountErr;
        },
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        },
        rawBalance() {
            if (!this.viteTokenInfo) {
                return null;
            }
            const list = this.$store.getters.exBalanceList;
            return list[this.viteTokenInfo.tokenId];
        },
        exViteBalance() {
            return this.rawBalance ? this.rawBalance.available : 0;
        },
        accountAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        show() {
            this.isShow = true;
        },
        close() {
            this.amount = '';
            this.amountErr = '';
            this.isShow = false;
        },
        testAmount() {
            if (!this.viteTokenInfo) {
                this.amountErr = this.$t('hint.amtFormat');
                return false;
            }

            this.amountErr = verifyAmount({
                decimals: this.viteTokenInfo.decimals,
                formatDecimals: 8,
                minAmount: bigNumber.toMin(minLimit, this.viteTokenInfo.decimals),
                balance: this.rawBalance ? this.rawBalance.availableExAmount || 0 : 0,
                errorMap: {
                    less0: this.$t('wallet.hint.amount'),
                    lessMin: this.$t('walletQuota.cancelLimitAmt', { num: minLimit })
                }
            })(this.amount);

            return !this.amountErr;
        },

        staking() {
            statistics.event(router.currentRoute.name, 'addQuota-submit', this.accountAddr || '');


            const amount = bigNumber.toMin(this.amount, this.viteTokenInfo.decimals);
            sendTx({
                methodName: 'dexStakeForMining',
                data: {
                    actionType: 1,
                    amount
                }
            }).then(() => {
                this.$toast(this.$t('hint.request', { name: this.$t('submitStaking') }));
                this.close();
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('walletQuota.pledgeFail'), err);
            });
        }
    }
};
</script>
