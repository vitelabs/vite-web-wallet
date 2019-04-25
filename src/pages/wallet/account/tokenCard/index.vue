<template>
    <div class="token-card">
        <div class="title">
            <div>
                <img
                    @click="showDetail()"
                    :src="token.icon||getIcon(token.tokenId)"
                    class="icon click-able"
                />
            <span class="token-name click-able" @click="showDetail()">{{ token.tokenSymbol }}</span></div>

            <div>
                <span
                    class="gate"
                    v-if="token.type==='OFFICAL_GATE'||token.type==='THIRD_GATE'"
                    @click="showDetail('gate')"
                >{{gateName}}</span>
                <span class="unbind click-able" v-if="showUnbind" @click="unbind"></span>
            </div>

        </div>
        <div class="body">
            <div class="item click-able" @click="showDetail()">
                <span class="balance">{{ token.balance || 0 }}</span>
            </div>
            <div class="item">
                <span class="asset">{{asset}}</span>
            </div>
            <div class="token-tips">
                {{ token.onroadNum || 0 }} {{ $t('wallet.pend') }}
            </div>
        </div>
        <div class="bottom">
            <div
                v-unlock-account="send"
                class="btn __pointer"
            >{{ $t('tokenCard.actionType.SEND') }}</div>
            <div
                @click="receive"
                class="btn __pointer"
            >{{ $t('tokenCard.actionType.RECEIVE') }}</div>
            <div
                v-if="token.gateInfo.url"
                v-unlock-account="withdraw"
                class="btn __pointer"
            >{{ $t('tokenCard.actionType.WITHDRAW') }}</div>
            <div
                v-if="token.gateInfo.url"
                @click="charge"
                class="btn __pointer"
            >{{ $t('tokenCard.actionType.CHARGE') }}</div>
        </div>
        <transaction
            v-if="isShowTrans"
            :token="token"
            :closeTrans="closeTrans"
        ></transaction>
    </div>
</template>

<script>
import { receiveDialog, chargeDialog, withdrawDialog, tokenInfoDialog } from '../dialog';
import { wallet } from 'utils/wallet';
import getTokenIcon from 'utils/getTokenIcon';
import bigNumber from 'utils/bigNumber';
import { gateStorage } from 'services/gate';
import transaction from '../transaction';

export default {
    components: { transaction },
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
    data() {
        return { isShowTrans: false };
    },
    computed: {
        showUnbind() {
            return this.token.type === 'THIRD_GATE' && (!this.token.balance || bigNumber.isEqual(this.token.balance, '0'));
        },
        address() {
            return wallet.activeWalletAcc && wallet.activeWalletAcc.getDefaultAddr();
        },
        gateName() {
            if (this.$store.getters.mapToken2Gate[this.token.tokenId]) {
                return this.$store.getters.mapToken2Gate[this.token.tokenId].gateway;
            }
            return this.$t('tokenCard.gateInfo.selfdefined');
        },
        asset() {
            const currency = this.$store.state.exchangeRate.coins[this.$i18n.locale];
            const rate = this.$store.state.exchangeRate.rateMap[this.token.tokenId];
            if (rate && this.token.balance) {
                return `${ this.$i18n.locale === 'en' ? '$' : '¥' } ${ bigNumber.multi(this.token.balance, rate[currency]) }`;
            }
            return '--';
        }
    },
    methods: {
        unbind() {
            gateStorage.unbindToken(this.token.tokenId);
        },
        getIcon(id) {
            return getTokenIcon(id);
        },
        receive() {
            receiveDialog({ token: this.token });
        },
        charge() {
            chargeDialog({ token: this.token });
        },
        withdraw() {
            withdrawDialog({ token: this.token });
        },
        showDetail(initTabName) {
            tokenInfoDialog({ token: this.token, initTabName });
        },
        send() {
            if (!this.token.tokenId) {
                return;
            }
            this.isShowTrans = true;
        },
        closeTrans() {
            this.isShowTrans = false;
        }
    }
};
</script>

<style lang='scss' scoped>
@import "~assets/scss/vars.scss";
.click-able{
    cursor: pointer;
}
.token-card {
    box-sizing: border-box;
    position: relative;
    min-width: 300px;
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
    .icon{
        height: 20px;
        width: 20px;
    }
    .token-name {
        font-size: 18px;
        font-family: $font-bold;
    }
    .gate {
        background: rgba(0, 122, 255, 0.06);
        border-radius: 2px;
        color: #007aff;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        cursor: pointer;
    }
    .unbind {
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
        line-height: 22px;
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        padding-left: 30px;
        .balance {
            font-size: 20px;
            color: #1d2024;
            font-family: $font-bold;
            height: 20px;
        }
        .asset {
            height: 16px;
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
