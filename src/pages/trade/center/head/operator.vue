<template>
    <div class="gate __pointer">
        <span v-if="operatorInfo" @click="showOperator">
            <img v-show="operatorInfo.icon" class="gate-img" :src="operatorInfo.icon"/>
            {{ operatorInfo.address || '--' }}
        </span>
        <span v-else>--</span>

        <confirm v-show="isShowCinfirm" :title="$t('tradeCenter.operator.title')"
                 :closeIcon="true" :singleBtn="true" :close="closeOperator"
                 :leftBtnTxt="$t('btn.understand')" :leftBtnClick="closeOperator">

        </confirm>
    </div>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import operatorList from './operator.json';

import XS_Fund from 'assets/imgs/operator/XS_Fund.png';
import Vgate from 'assets/imgs/operator/Vgate.png';

const operatorIcon = { XS_Fund, Vgate };
console.log(operatorIcon);
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
</style>
