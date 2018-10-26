<template>
    <div class="pledge-tx-wrapper">
        <div class="row">
            <div class="item">
                <div class="title">{{ $t('quota.fromAddr') }}</div>
                <div class="input-item all unuse __ellipsis">{{ addr }}</div>
            </div>
            <div class="item">
                <div class="title">{{ $t('quota.amount') }}</div>
                <div class="input-item all __ellipsis">
                    <input v-model="amount" class="amount" type="text" 
                           :placeholder="$t('quota.amountPlaceholder')" />
                    <span class="unit">VITE</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="title">{{ $t('quota.toAddr') }}</div>
                <div class="input-item all __ellipsis">
                    <input v-model="toAddr" type="text" 
                           :placeholder="$t('quota.addrPlaceholder')" />
                </div>
            </div>
            <div class="item">
                <div class="title">{{ $t('quota.time') }}</div>
                <span class="input-item unuse about">{{ $t('quota.aboutDays') }}</span>
                <span class="btn __pointer" @click="confirmTx">{{ $t('quota.btn') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import toast from 'utils/toast/index.js';

export default {
    props: {
        showConfirm: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        let activeAccount = viteWallet.Wallet.getActiveAccount();

        return {
            activeAccount,
            addr: activeAccount.getDefaultAddr(),
            amount: '',
            toAddr: ''
        };
    },
    methods: {
        confirmTx() {
            this.showConfirm();
        },

        sendPledgeTx() {
            this.activeAccount.sendTx({
                tokenId: 'tti_5649544520544f4b454e6e40',
                toAddr: this.toAddr,
                amount: this.amount
            }, 'get').then(() => {
                toast(this.$t('quota.pledgeSuccess'));
            }).catch((err) => {
                if (err && err.error && err.error.code && err.error.code === -35002) {
                    this.startPowTx();
                    return;
                }
                toast(this.$t('quota.pledgeFail'));
            });
        },
        startPowTx() {
            this.activeAccount.getPowTxBlock({
                tokenId: 'tti_5649544520544f4b454e6e40',
                toAddr: this.toAddr,
                amount: this.amount
            }, 'get').then((block) => {
                this.activeAccount.sendRawTx(block).then(() => {
                    toast(this.$t('quota.pledgeSuccess'));
                }).catch(() => {
                    toast(this.$t('quota.pledgeFail'));
                });
            }).catch((err) => {
                console.warn(err);
                toast(this.$t('quota.pledgeFail'));
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.pledge-tx-wrapper {
    .row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        &:last-child {
            margin-top: 30px;
        }
        .item {
            display: inline-block;
            width: 49%;
            min-width: 470px;
            margin-top: 0;
        }
        .title {
            font-family: $font-bold;
            font-size: 14px;
            color: #1D2024;
            letter-spacing: 0.35px;
            line-height: 16px;
            margin-bottom: 16px;
        }
        .about, .btn {
            display: inline-block;
            width: 48%;
        }
        .btn {
            border-radius: 2px;
            background: #007AFF;
            color: #fff;
            line-height: 40px;
            text-align: center;
            float: right;
        }
    }

    .input-item {
        box-sizing: border-box;
        height: 40px;
        line-height: 40px;
        background: #FFFFFF;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        font-size: 14px;
        color: #5E6875;
        padding: 0 15px;
        &.all {
            width: 100%;
        }
        &.unuse {
            background: #F3F6F9;
        }
        .unit {
            float: right;
        }
        input {
            width: 100%;
            background: transparent;
            font-size: 14px;
            &.amount {
                width: 80%;
                min-width: 397px;
            }
        }
    }
}

@media only screen and (max-width: 1410px) {
    .pledge-tx-wrapper .row .item {
        margin-top: 20px;
        &:first-child {
            margin-top: 0;
        }
    }
}

@media only screen and (max-width: 750px) {
    .pledge-tx-wrapper .row .item {
        width: 100%;
        min-width: 0;
    }
    .pledge-tx-wrapper .input-item input.amount {
        min-width: 0;
    }
}
</style>
