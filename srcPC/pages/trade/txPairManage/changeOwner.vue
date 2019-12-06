<template>
    <confirm :btnUnuse="btnUnuse"
             :showMask="true" :singleBtn="true" :closeIcon="true"
             :title="$t('tradeTxPairManage.changeOwner')"
             :leftBtnTxt="$t('tradeTxPairManage.submitChange')"
             :leftBtnClick="trans" :close="close">

        <div class="__row">
            <div class="__row_t">{{ $t('tradeTxPairManage.txPairName') }}</div>
            <div class="__input_row __unuse_input __bold">{{ txPair.symbol || '' }}</div>
        </div>

        <div class="__row">
            <div class="__row_t">
                {{ $t('tradeOperator.permissionConfirm.address') }}
                <span v-show="!isValidAddress" class="__err">{{ $t('hint.addrFormat') }}</span>
            </div>
            <vite-input v-model="address" :valid="validAddr"
                        :placeholder="$t('wallet.placeholder.addr')"></vite-input>
        </div>

        <div class="__notice"><span>{{ $t('tradeTxPairManage.changeOwnerHint') }}</span></div>
    </confirm>
</template>

<script>
import { wallet } from '@vite/vitejs';
import confirm from 'components/confirm/confirm.vue';
import viteInput from 'components/viteInput';

export default {
    components: { confirm, viteInput },
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        txPair: {
            type: Object,
            default: null
        },
        fetchConfig: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            address: '',
            isValidAddress: true
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
            this.isValidAddress = wallet.isValidAddress(this.address);
        },
        trans() {
            this.fetchConfig({
                operationCode: 1,
                tradeToken: this.txPair.txPairDetail.tradeToken,
                quoteToken: this.txPair.txPairDetail.quoteToken,
                owner: this.address
            }, {
                success: this.$t('tradeTxPairManage.changeOwnerSuccess'),
                fail: this.$t('tradeTxPairManage.changeOwnerFail')
            });
        }
    }
};
</script>
