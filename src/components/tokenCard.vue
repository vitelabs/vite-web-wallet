<template>
    <div class="token-card">
        <div class="title">
            <img v-if="opt.icon" :src="opt.icon" class="icon" />
            <span class="tokenName">{{ opt.symbol }}</span>
        </div>
        <div class="body">
            <div class="item">
                <span>{{ $t('balance') }}</span>
                <span class="balance">{{ opt.balance || 0 }}</span>
            </div>
            <div class="item">
                <span>{{ $t('wallet.fundFloat') }}</span>
                <span class="balance">{{ opt.fundFloat || 0 }}</span>
            </div>
            <div class="token-tips">
                <span>{{ opt.onroadNum || 0 }} {{ $t('wallet.pend') }}</span>
            </div>
        </div>
        <div v-unlock-account="_sendTx" class="btn __pointer"
             :class="{ 'unuse': !opt.id || !+opt.balance }">{{ $t('sendTrans.send') }}</div>
    </div>
</template>

<script>
import viteIcon from 'assets/imgs/vite.svg';
import vcpIcon from 'assets/imgs/VCC.svg';
import vttIcon from 'assets/imgs/vtt.svg';

export default {
    props: {
        opt: {
            type: Object,
            default: () => {
                return {
                    symbol: '--',
                    balance: '--',
                    fundFloat: '--',
                    unConfirmes: '--'
                };
            }
        },
        sendTransaction: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            iconMap: {
                VITE: viteIcon,
                VCP: vcpIcon,
                VTT: vttIcon
            }
        };
    },
    methods: {
        _sendTx() {
            if (!this.opt.id || !this.opt.balance) {
                return;
            }
            this.sendTransaction && this.sendTransaction(this.opt);
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
    height: 56px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    .icon {
        margin-left: 25px;
    }

    .tokenName {
        margin-left: 10px;
        font-size: 18px;
        font-family: $font-bold, arial, sans-serif;
    }
}

.body {
    padding: 0 30px 20px;

    .item {
        font-family: $font-bold, arial, sans-serif;
        height: 22px;
        line-height: 22px;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;

        .balance {
            font-size: 20px;
            color: #007aff;
            margin-left: 20px;
        }
    }

    .token-tips {
        margin-top: 8px;
        font-size: 12px;
        color: #5b638d;
        display: flex;
        justify-content: flex-end;
    }
}

.btn {
    background: #007aff;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #fff;

    &.unuse {
        background: #bfbfbf;
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
