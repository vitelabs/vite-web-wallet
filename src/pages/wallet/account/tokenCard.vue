<template>
    <div class="token-card">
        <div class="title">
            <div>
                <img
                    v-if="opt.icon"
                    :src="opt.icon"
                    class="icon"
                />
            <span class="tokenName">{{ opt.symbol }}</span></div>

            <div>
                <span
                    class="gate"
                    v-if="opt.type==='GATE'"
                ></span>
                <span class="bind"></span>
            </div>

        </div>
        <div class="body">
            <div class="item">
                <span class="balance">{{ opt.balance || 0 }}</span>
            </div>
            <div class="item">
                <span class="asset">{{ opt.asset || 0 }}</span>
            </div>
            <div class="token-tips">
                {{ opt.onroadNum || 0 }} {{ $t('wallet.pend') }}
            </div>
        </div>
        <div class="bottom">
            <div
                v-unlock-account="()=>$emit('action','SEND')"
                class="btn __pointer"
            >{{ $t('actionType.SEND') }}</div>
            <div
                @click="receive"
                class="btn __pointer"
            >{{ $t('actionType.RECEIVE') }}</div>
            <div
                v-if="opt.type==='GATE'"
                v-unlock-account="()=>$emit('action','WITHDRAW')"
                class="btn __pointer"
            >{{ $t('actionType.WITHDRAW') }}</div>
            <div
                v-if="opt.type==='GATE'"
                @click="$emit('action','CHARGE')"
                class="btn __pointer"
            >{{ $t('actionType.CHARGE') }}</div>
        </div>
    </div>
</template>

<script>
import { receiveDialog, chargeDialog } from 'components/dialog';
import { wallet } from 'utils/wallet';
export default {
    props: {
        opt: {
            type: Object,
            default: () => {
                return {
                    symbol: '--',
                    balance: '--',
                    asset: '--',
                    onroadNum: '--',
                    type: 'OFFICAL'// OFFICAL OFFICALGATE SELFGATE
                };
            }
        }
    },
    computed: {
        address() {
            return wallet.activeWalletAcc && wallet.activeWalletAcc.getDefaultAddr();
        }
    },
    methods: {
        _sendTx() {
            if (!this.opt.id || !this.opt.balance) {
                return;
            }
            this.sendTransaction && this.sendTransaction(this.opt);
        },
        receive() {
            receiveDialog({ title: '接收VITE', address: this.address });
        },
        charge() {
            chargeDialog({ title: '充值', address: this.address });
        }
    }
};
</script>

<style lang='scss' scoped>
@import "~assets/scss/vars.scss";

.token-card {
    box-sizing: border-box;
    position: relative;
    min-width: 245px;
    background: #fff;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    margin: 0 40px 20px 0;
}

.title {
    border-bottom: 1px solid #e5edf3;
    height: 46px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 12px 30px;
    .tokenName {
        font-size: 18px;
        font-family: $font-bold;
    }
    .gate {
        background: rgba(0, 122, 255, 0.06);
        border-radius: 2px;
        color: #007aff;
        height: 20px;
        line-height: 20px;
    }
    .bind {
        display: inline-block;
        height: 12px;
        width: 12px;
        background: url(~assets/imgs/bind.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
}

.body {
    padding-top: 8px;
    .item {
        height: 22px;
        line-height: 22px;
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        padding-left: 30px;
        .balance {
            font-size: 20px;
            color: #1d2024;
            font-family: $font-bold;
        }
        .asset {
            font-size: 12px;
            color: #5b638d;
        }
    }

    .token-tips {
        background: rgba(0, 122, 255, 0.06);
        margin-top: 16px;
        font-size: 13px;
        color: #5b638d;
        padding-left: 30px;
        height: 24px;
        line-height: 24px;
    }
}
.bottom {
    background: linear-gradient(
        281deg,
        rgba(84, 182, 255, 1) 0%,
        rgba(42, 127, 255, 1) 100%
    );
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    .btn {
        height: 28px;
        line-height: 28px;
        text-align: center;
        color: #fff;
        flex-grow: 1;
        border-right: 1px solid rgba(255, 255, 255, 0.15);
        &.unuse {
            background: #bfbfbf;
        }
    }
}

@media only screen and (max-width: 550px) {
    .token-card {
        width: 100%;
        margin-bottom: 15px;
        margin-left: 0;
    }

    .body {
        padding: 0 15px 20px;

        .item .balance {
            margin-left: 0;
        }
    }

    .title .icon {
        margin-left: 15px;
    }
}
</style>
