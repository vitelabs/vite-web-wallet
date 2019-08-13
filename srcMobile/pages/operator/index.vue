<template>
    <div class="operator-wrapper">
        <sec-title v-show="!noData" :isShowHelp="false"></sec-title>
        <income v-show="!noData" v-model="isIncome"></income>
        <token-list v-show="!noData" v-model="isTokenList"></token-list>
        <div v-show="noData" class="become-operator">
            <img src="~assets/imgs/no_operator.svg"/>
            <div class="text">{{ $t('tradeOperator.noOperator') }}</div>
            <div class="btn __pointer" @click="goOperatorTutorial">{{ $t('tradeOperator.learnMore') }}</div>
        </div>
    </div>
</template>

<script>
import income from './income.vue';
import tokenList from './tokenList';
import secTitle from 'components/secTitle';
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
    img {
        display: inline-block;
        width: 340px;
        height: 340px;
    }
    .text {
        font-size: 16px;
        @include font-family-normal();
        color: rgba(36,39,43,1);
        line-height: 20px;
    }
    .btn {
        margin-top: 30px;
        display: inline-block;
        width: 196px;
        height: 44px;
        background: rgba(0,122,255,1);
        border-radius: 2px;
        text-align: center;
        line-height: 44px;
        @include font-family-bold();
        color: rgba(255,255,255,1);
    }
}
</style>

