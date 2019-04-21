<template>
    <div class="token-card">
        <div class="title">
            <div>
                <img
                    v-if="token.icon"
                    :src="token.icon"
                    class="icon"
                />
            <span class="tokenName">{{ token.tokenSymbol }}</span></div>

            <div>
                <span
                    class="gate"
                    v-if="token.type==='OFFICAL_GATE'"
                ></span>
                <span class="bind"></span>
            </div>

        </div>
        <div class="body">
            <div class="item">
                <span class="balance">{{ token.balance || 0 }}</span>
            </div>
            <div class="item">
                <span class="asset">{{ token.asset || 0 }}</span>
            </div>
            <div class="token-tips">
                {{ token.onroadNum || 0 }} {{ $t('wallet.pend') }}
            </div>
        </div>
        <div class="bottom">
            <div
                v-unlock-account="_sendTx"
                class="btn __pointer"
            >{{ $t('actionType.SEND') }}</div>
            <div
                @click="receive"
                class="btn __pointer"
            >{{ $t('actionType.RECEIVE') }}</div>
            <div
                v-if="token.type==='GATE'"
                v-unlock-account="widthdraw"
                class="btn __pointer"
            >{{ $t('actionType.WITHDRAW') }}</div>
            <div
                v-if="token.type==='GATE'"
                @click="charge"
                class="btn __pointer"
            >{{ $t('actionType.CHARGE') }}</div>
        </div>
    </div>
</template>

<script>
import { receiveDialog, chargeDialog, withdrawDialog, tokenInfoDialog } from '../dialog';
import { wallet } from 'utils/wallet';
export default {
    props: {
        token: {
            type: Object,
            default: () => {
                return {
                    symbol: '--',
                    balance: '--',
                    asset: '--',
                    onroadNum: '--',
                    type: 'OFFICAL_GATE'// OFFICAL OFFICALGATE SELFGATE
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
            this.sendTransaction && this.sendTransaction(this.token);
        },
        receive() {
            receiveDialog({ token: this.token });
        },
        charge() {
            chargeDialog({ token: this.token });
        },
        widthdraw() {
            withdrawDialog({ token: this.token });
        },
        showDetail() {
            tokenInfoDialog({ token:this.token });
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
