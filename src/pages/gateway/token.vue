<template>
    <div class="token-wrapper">
        <div class="title">
            <img src="../../assets/imgs/eth_logo.svg"/>{{ token.symbol }}
        </div>
        <div class="content">
            <div class="balance">
                {{ $t('account.balance') }}<span class="num">{{ balance }}</span>
            </div>
            <div class="btn-list">
                <div class="btn __pointer" :class="classList" 
                     @click="_sendTx('transfer', token.name)">{{ $t('account.sendTrans') }}</div>
                <div v-show="token.symbol === 'VITE'" @click="_sendTx('exchange', token.name)"
                     class="btn __pointer" :class="classList">
                    {{ $t('gateway.exchange.vite') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';

export default {
    props: {
        tokenName: {
            type: String,
            default: ''
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
            let decimals = this.token.decimals;
            let balance = this.token.balance;
            return +balance ? BigNumber.toBasic(balance, decimals) : 0;
        },
        classList() {
            let haveBalance = this.balance && this.balance !== 0;
            return {
                '__btn_all_in': haveBalance,
                'unuse': !haveBalance
            };    
        }
    },
    methods: {
        _sendTx(...args) {
            if (!this.balance || this.balance === 0) {
                return;
            }
            this.sendTx && this.sendTx(...args);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.token-wrapper {
    box-sizing: border-box;
    width: 254px;
    background: rgba(255,255,255,1);
    box-shadow: 0px 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    margin-right: 40px;
    margin-top: 30px;
    font-family: $font-bold, arial, sans-serif;
    font-weight: 600;
    .title {
        padding: 18px 25px;
        font-size: 18px;
        color: rgba(29,32,36,1);
        border-bottom: 1px solid rgba(229,237,243,1);
        img {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-bottom: -3px;
            margin-right: 6px;
        }
    }
    .content {
        padding: 20px;
        .balance {
            font-size: 14px;
            color: rgba(29,32,36,1);
            line-height: 20px;
            .num {
                float: right;
                font-size: 20px;
                color: rgba(0,122,255,1);
            }
        }
        .btn-list {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            .btn {
                padding: 0 20px;
                height: 40px;
                line-height: 40px;
                border-radius: 2px;
                font-size:14px;
                flex: 1;
                text-align: center;
                margin-left: 10px;
                &.unuse {
                    background: rgba(238,241,245,1);
                    color: rgba(255,255,255,1);
                }
                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }
}

@media only screen and (max-width: 550px) {
    .token-wrapper {
        width: 100%;
        margin-top: 15px;
        margin-right: 0px;
    }
}
</style>
