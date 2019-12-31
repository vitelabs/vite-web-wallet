<template>
    <div class="operator-wrapper">
        <sec-title v-show="!noData" :isShowHelp="false"></sec-title>
        <income v-show="!noData" v-model="isIncome"></income>
        <token-list v-show="!noData" v-model="isTokenList"></token-list>
        <div v-show="noData" class="become-operator">
            <span class="no-operator"></span>
            <div class="text">{{ $t('tradeOperator.noOperator') }}</div>
            <div class="btn __pointer" @click="goOperatorTutorial">{{ $t('tradeOperator.learnMore') }}</div>
        </div>
    </div>
</template>

<script>
import income from './income.vue';
import tokenList from './tokenList';
import secTitle from 'pcComponents/secTitle';
import openUrl from 'utils/openUrl';

export default {
    components: { income, secTitle, tokenList },
    data() {
        return {
            isIncome: false,
            isTokenList: false
        };
    },
    computed: {
        noData() {
            return !this.isIncome && !this.isTokenList;
        }
    },
    methods: {
        goOperatorTutorial() {
            openUrl('https://forum.vite.net/topic/2283/guidelines-on-how-to-become-an-operator-on-vitex');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.operator-wrapper {
    width: 100%;
    height: 100%;
}

.become-operator {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    .no-operator {
        display: inline-block;
        width: 340px;
        height: 340px;
        @include background_common_img('no_operator.svg');
    }
    .text {
        font-size: 16px;
        @include font-family-normal();
        @include font_color_to_white(rgba(36,39,43,1));
        line-height: 20px;
    }
    .btn {
        margin-top: 30px;
        display: inline-block;
        width: 196px;
        height: 44px;
        background: $blue-color-1;
        border-radius: 2px;
        text-align: center;
        line-height: 44px;
        @include font-family-bold();
        color: rgba(255,255,255,1);
    }
}
</style>

