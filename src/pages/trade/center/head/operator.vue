<template>
    <div class="gate">
        <span class="__pointer" v-if="operatorInfo" @click="showOperator">
            <img v-show="operatorInfo.icon" class="gate-img" :src="operatorInfo.icon"/>
            {{ operatorInfo.address || '--' }}
        </span>
        <span v-else>--</span>

        <confirm v-if="isShowCinfirm" class="no-padding-confirm"
                 :title="$t('tradeCenter.operator.title')"
                 :closeIcon="true" :singleBtn="true" :close="closeOperator"
                 :leftBtnTxt="$t('btn.understand')" :leftBtnClick="closeOperator">
            <div class="operator-info-title">
                <img :src="operatorInfo.icon"/>
                <div class="title-info">
                    <div class="name">{{ operatorInfo.name }}</div>
                    <div class="address">{{ operatorInfo.address }}</div>
                </div>
            </div>
            <div class="info-item">
                <span class="info_second_title">{{ $t('tradeCenter.operator.introduction') }}:</span>
                <div class="introduction">{{ operatorInfo.introduction }}</div>
            </div>
            <div class="info-item">
                <span class="info_second_title">{{ $t('tradeCenter.operator.txPair') }}:</span>
                <div class="tx-pair-list" v-if="operatorInfo.txPairs.length">
                    <span v-for="(symbol,i) in operatorInfo.txPairs" :key="i">{{ symbol }}</span>
                </div>
            </div>
        </confirm>
    </div>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import operatorList from './operator.json';

import XS_Fund from 'assets/imgs/operator/XS_Fund.png';
import Vgate from 'assets/imgs/operator/Vgate.png';

const operatorIcon = { XS_Fund, Vgate };

export default {
    components: { confirm },
    data() {
        return { isShowCinfirm: false };
    },
    computed: {
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        operatorInfo() {
            if (!this.activeTxPair) {
                return null;
            }

            const operator = operatorList.find(v => v.txPairs.indexOf(this.activeTxPair.symbol) !== -1);
            if (!operator) {
                return null;
            }

            const icon = operator.icon;
            operator.icon = icon ? operatorIcon[icon] || '' : '';
            return operator;
        }
    },
    methods: {
        showOperator() {
            this.isShowCinfirm = true;
        },
        closeOperator() {
            this.isShowCinfirm = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.gate {
    @include font-family-normal();
    color: #007AFF;
    display: flex;
    margin-top: 2px;
    .gate-img {
        width: 14px;
        height: 14px;
        border-radius: 14px;
        margin-right: 2px;
        margin-bottom: -2px;
    }
}

.operator-info-title {
    padding: 30px 20px;
    background: rgba(0,122,255,0.05);
    border-bottom: 1px solid rgba(212,222,231,1);
    img {
        width: 40px;
        height: 40px;
        border-radius: 2px;
        border: 1px solid rgba(212,222,231,1);
        margin-right: 12px;
        margin-bottom: -4px;
    }
    .title-info {
        display: inline-block;
        .name {
            font-size: 14px;
            @include font-family-bold();
            color: rgba(29,32,36,1);
            line-height: 18px;
            margin-bottom: 8px;
        }
        .address {
            font-size: 11px;
            color: rgba(94,104,117,1);
            line-height: 15px;
        }
    }
}
.info-item {
    margin-top: 20px;
    font-size: 12px;
    @include font-family-normal();
    padding: 0 30px;
    word-break: break-word;
    white-space: normal;
    display: flex;
    .info_second_title {
        color: rgba(94,104,117,0.58);
        white-space: nowrap;
        margin-right: 10px;
    }
    .introduction {
        color: rgba(29,32,36,1);
    }
    .tx-pair-list {
        display: flex;
        flex-wrap: wrap;
        color: rgba(0,122,255,1);
        span {
            white-space: nowrap;
            margin-bottom: 6px;
            margin-right: 30px;
        }
    }
}
</style>
