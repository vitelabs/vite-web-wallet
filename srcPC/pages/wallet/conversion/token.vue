<template>
    <div class="token-wrapper">
        <div class="title">
            <img src="~assets/imgs/eth_logo.svg"/>{{ token.symbol }}
        </div>
        <div class="content">
            <div class="balance">
                {{ $t('balance') }}<span class="num">{{ balance }}</span>
            </div>
            <div class="btn-list">
                <div class="btn __pointer" :class="classList"
                     @click="_sendTx('transfer', token.name)">{{ $t('sendTrans.symbol') }}</div>
                <div v-show="token.symbol === 'VITE'" @click="_sendTx('exchange', token.name)"
                     class="btn __pointer" :class="classList">
                    {{ $t('walletConversion.exchange.vite') }}</div>
            </div>
        </div>
    </div>
</template>

<script>// yz todo
import BigNumber from 'utils/bigNumber';

export default {
    props: {
        ethToken: {
            type: Object,
            default: () => {
                return {};
            }
        },
        token: {
            type: Object,
            default: () => {
                return {};
            }
        },
        sendTx: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        balance() {
            const decimals = this.token.decimals;
            const balance = this.token.balance;

            return +balance ? BigNumber.toBasic(balance, decimals) : 0;
        },
        classList() {
            const haveBalance = +this.token.balance && +this.ethToken.balance;

            return {
                '__btn_all_in': haveBalance,
                'unuse': !haveBalance,
                'only': this.token.symbol !== 'VITE'
            };
        }
    },
    methods: {
        _sendTx(...args) {
            if (!+this.token.balance || !+this.ethToken.balance || !this.sendTx) {
                return;
            }
            this.sendTx(...args);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.token-wrapper {
    box-sizing: border-box;
    min-width: 254px;
    border-radius: 2px;
    margin-top: 30px;
    @include font-family-bold();
    @include bg_color_2();
    [data-theme="0"] & {
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    }
    .title {
        padding: 18px 25px;
        font-size: 18px;
        @include common_font_color();
        @include common_border_one(bottom);
        img {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-bottom: -3px;
            margin-right: 6px;
            background: #fff;
            border-radius: 20px;
            padding: 4px;
            box-sizing: border-box;
        }
    }
    .content {
        padding: 20px;
        .balance {
            font-size: 14px;
            @include common_font_color();
            line-height: 20px;
            .num {
                float: right;
                font-size: 20px;
                color: $blue-color-1;
                margin-left: 10px;
            }
        }
        .btn-list {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            .btn {
                box-sizing: border-box;
                height: 40px;
                line-height: 40px;
                border-radius: 2px;
                font-size: 14px;
                width: 102px;
                text-align: center;
                margin-left: 10px;
                white-space: nowrap;
                background: $blue-color-1;
                color: $white-color;
                &.only {
                    min-width: 100%;
                    width: 100%;
                }
                &.unuse {
                    @include gray_btn_color();
                }
                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }
}
</style>
