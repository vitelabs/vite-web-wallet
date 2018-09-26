<template>
    <div class="token-card">
        <div class="title">
            <img :src="iconMap[opt.symbol] || iconMap['default']" class="icon" />
            <span class="tokenName">{{ opt.symbol }}</span>
        </div>
        <div class="body">
            <div class="item">
                <span>{{ $t('accDetail.balance') }}</span>
                <span class="balance">{{ opt.balance || 0 }}</span>
            </div>
            <div class="item">
                <span>{{ $t('accDetail.fundFloat') }}</span>
                <span class="balance">{{ opt.fundFloat || 0 }}</span>
            </div>
            <div class="tips">
                <span>{{ opt.unConfirmes || 0 }} {{ $t('accDetail.pend') }}</span>
            </div>
        </div>
        <div class="btn __pointer" :class="{ unuse: !opt.id }" 
             @click="sendTransaction(opt)">{{ $t('accDetail.sendTrans') }}</div>
    </div>
</template>

<script>
import viteIcon from 'assets/imgs/vite.svg';
import vcpIcon from 'assets/imgs/VCC.svg';
import vvIcon from 'assets/imgs/vv.svg';

export default {
    props: {
        opt: {
            type: Object,
            default: () => ({
                symbol: '--',
                balance: '--',
                fundFloat: '--',
                unConfirmes: '--'
            })
        },
        sendTransaction: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            iconMap: {
                VITE: viteIcon,
                VCP: vcpIcon,
                VV: vvIcon,
                default: viteIcon
            }
        };
    }
};
</script>

<style lang='scss' scoped>
.token-card {
    position: relative;
    width: 254px;
    background: #fff;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    margin-left: 40px;
    &:first-child {
        margin-left: 0;
    }
}
.title {
    border-bottom: 1px solid #e5edf3;
    height: 56px;
    display: flex;
    align-items: center;
    .icon {
        margin-left: 25px;
    }
    .tokenName {
        margin-left: 10px;
        font-size: 18px;
    }
}
.body {
    padding: 0 30px 20px;
    .item {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        .balance {
        font-size: 20px;
        color: #007aff;
        }
    }
    .tips {
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
</style>
