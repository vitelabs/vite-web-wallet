<template>
    <div class="SBP-wrapper">
        <sec-title></sec-title>

        <loading v-if="loadingToken" class="loading"></loading>

        <div v-if="!loadingToken" class="section">
            <div class="title">{{ $t('SBP.section1.title') }}</div>
            <register :tokenInfo="tokenInfo" :sendTx="sendTx" class="content"></register>
        </div>

        <div v-if="!loadingToken" class="section">
            <div class="title">{{ $t('SBP.section2.title') }}</div>
            <list class="content" :tokenInfo="tokenInfo" :sendTx="sendTx"></list>
        </div>

        <div v-if="showConfirmType" class="gray-wrapper">
            <!-- <confirm v-if="showConfirmType === 'cancel'" 
                     :title="$t(`quota.confirm.cancel.title`)" :closeIcon="false"
                     :leftBtnTxt="$t(`quota.confirm.cancel.leftBtn`)" :leftBtnClick="closeConfirm"
                     :rightBtnTxt="$t(`quota.confirm.cancel.rightBtn`)" 
                     :rightBtnClick="submit" :btnUnuse="!!cancelUnuse">
                {{ $t(`quota.confirm.cancel.describe`, { amount: activeAmountLimit }) }}
                <div class="cancel-amount" v-show="amountErr">{{ amountErr }}</div>
                <div class="cancel-input">
                    <input type="text" v-model="cancelAmount"
                           :placeholder="$t('quota.cancelAmount')" />
                </div>
            </confirm> -->

            <pow-process ref="powProcess" v-if="showConfirmType === 'pow'"></pow-process>
        </div>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';
import powProcess from 'components/powProcess';
import loading from 'components/loading';
import register from './register';
import list from './list';

export default {
    components: {
        secTitle, register, list, powProcess, loading
    },
    created() {
        this.tokenInfo = viteWallet.Ledger.getTokenInfo();

        if (!this.tokenInfo) {
            this.loadingToken = true;
            viteWallet.Ledger.fetchTokenInfo().then((tokenInfo) => {
                this.loadingToken = false;
                this.tokenInfo = tokenInfo;
            }).catch((err) => {
                console.warn(err);
            });
        }
    },
    destroyed() {
        // this.clearAll();
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();

        return {
            activeAccount,
            tokenInfo: {},
            loadingToken: false,
            showConfirmType: ''
        };
    },
    methods: {
        showConfirm(type) {
            this.showConfirmType = type;
        },
        closeConfirm() {
            this.showConfirmType = '';
        },
        stopPow(cb) {
            let powProcessEle = this.$refs.powProcess;
            if (!powProcessEle) {
                return;
            }

            powProcessEle.gotoFinish();
            setTimeout(() => {
                this.closeConfirm();
                cb && cb();
            }, 1000);
        },

        sendTx({
            producerAddr, amount, nodeName
        }, type, cb) {
            if (!viteWallet.Net.getNetStatus()) {
                this.$toast(this.$t('nav.noNet'));
                cb && cb(false);
                return;
            }

            amount = viteWallet.BigNumber.toMin(amount || 0, this.tokenInfo.decimals);            
            return this.activeAccount.sendTx({
                tokenId: this.tokenInfo.tokenId,
                producerAddr, nodeName, amount
            }, type);
        }
    }
};
</script>


<style lang="scss" scoped>
@import '~assets/scss/table.scss';

.SBP-wrapper {
    padding: 40px;
    .loading {
        width: 60px;
        height: 60px;
        margin-top: -30px;
        margin-left: -30px;
    }
}

.gray-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
}

.section {
    padding-top: 40px;
    .title {
        border-left: 2px solid rgba(0, 122, 255, 0.7);
        font-family: $font-bold;
        font-size: 18px;
        color: #1d2024;
        line-height: 18px;
        height: 18px;
        margin-bottom: 28px;
        padding-left: 10px;
        margin-bottom: 25px;
    }
    .content {
        background: #FFFFFF;
        border: 1px solid #F6F5F5;
        box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
        border-radius: 2px;
    }
}
</style>
