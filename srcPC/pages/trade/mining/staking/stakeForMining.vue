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
            <vite-input v-model="amount" :valid="testAmount" :placeholder="$t('tradeMining.addPlaceHolder')" @input="noAll">
                <span slot="after" @click="all" class="all-wrapper">
                    <span class="all">{{ $t('tradeAssets.all') }}</span>
                </span>
            </vite-input>
        </div>

        <div class="__hint distance"><span>{{ $t('tradeMining.addHint1') }}</span></div>
        <div class="__hint"><span>{{ $t('tradeMining.addHint2') }}</span></div>
        <div class="__hint"><span>{{ $t('tradeMining.addHint3') }}</span></div>
    </confirm>
</template>

<script>
import confirm from '@pc/components/confirm/confirm.vue';
import viteInput from '@components/viteInput.vue';
import sendTx from '@pc/utils/sendTx';
import bigNumber from '@utils/bigNumber';
import statistics from '@utils/statistics';
import { verifyAmount } from '@pc/utils/validations';
import router from '@pc/router';

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
        noAll() {
            this.isAll = false;
        },
        all() {
            if (!+this.exViteBalance) {
                return;
            }
            this.isAll = true;
            this.amount = bigNumber.toBasic(this.exViteBalance, this.vxTokenDecimals);
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

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
.__hint {
    &.distance {
        margin-top: 20px;
    }
    span {
        display: inline;
    }
    margin-top: 6px;
}
.all-wrapper {
    // color: #00BEFF;
    @include primary_color();
    font-size: 12px;
    margin: 0 15px;
    cursor: pointer;
    .all {
        border-bottom: 1px dashed #00BEFF;
        @include primary_border_color();
    }
}
</style>
