<template>
    <confirm v-show="isShow" :showMask="true" :title="$t('tradeMining.addTitle')"
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
import { constant } from '@vite/vitejs';
import viteInput from 'components/viteInput';
import confirm from 'h5Components/confirm/confirm.vue';
import bigNumber from 'utils/bigNumber';
import sendTx from 'h5Utils/sendTx';
import { verifyAmount } from 'h5Utils/validations';
import { abiList } from 'services/apiServer';

const Vite_Token_Info = constant.Vite_Token_Info;
const minLimit = 134;

export default {
    components: { confirm, viteInput },
    data() {
        return {
            isShow: false,
            amount: '',
            amountErr: ''
        };
    },
    computed: {
        viteTokenInfo() {
            return this.$store.state.env.tokenMap[Vite_Token_Info.tokenId];
        },
        canOrder() {
            return this.amount && !this.amountErr;
        },
        rawBalance() {
            const list = this.$store.getters.exBalanceList;
            return list[Vite_Token_Info.tokenId];
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
            this.amountErr = verifyAmount({
                decimals: Vite_Token_Info.decimals,
                formatDecimals: 8,
                minAmount: bigNumber.toMin(minLimit, Vite_Token_Info.decimals),
                balance: this.rawBalance ? this.rawBalance.availableExAmount || 0 : 0,
                errorMap: {
                    less0: this.$t('wallet.hint.amount'),
                    lessMin: this.$t('walletQuota.cancelLimitAmt', { num: minLimit })
                }
            })(this.amount);

            return !this.amountErr;
        },

        staking() {
            const amount = bigNumber.toMin(this.amount, Vite_Token_Info.decimals);
            sendTx({
                abi: JSON.stringify(abiList.StakeForMining.abi),
                methodName: 'callContract',
                data: {
                    abi: abiList.StakeForMining.abi,
                    toAddress: abiList.StakeForMining.contractAddr,
                    params: [ 1, amount ],
                    tokenId: Vite_Token_Info.tokenId
                }
            }).then(() => {
                this.close();
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>
