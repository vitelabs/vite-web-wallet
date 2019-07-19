<template>
    <div v-show="stepList.length" class="merge-depth-wrapper">
        {{ $t('tradeCenter.mergeDepth') }}
        <div class="select-list __pointer" @click="toggleShowStepList">
            {{ $t('tradeCenter.depthStep', { step }) }}
            <div v-show="isShowStepList" class="list" @click="setStep(s)">
                <div class="item" v-for="(s,i) in stepList" :key="i">{{ $t('tradeCenter.depthStep', { step: s }) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
const maxDigit = 8;

export default {
    mounted() {
        this.$store.dispatch('exSetDepthStep', this.step);
    },
    data() {
        return {
            step: '',
            isShowStepList: false
        };
    },
    computed: {
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        ttokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        maxStep() {
            if (!this.ttokenDetail || !this.activeTxPair) {
                return '';
            }

            const tDigit = this.ttokenDetail.tokenDecimals;
            const pariDigit = this.activeTxPair.pricePrecision;

            const digit = tDigit > pariDigit ? pariDigit : tDigit;
            return digit > maxDigit ? maxDigit : digit;
        },
        stepList() {
            if (!this.maxStep && this.maxStep !== 0) {
                return [];
            }

            const list = [];
            for (let i = 0; i <= this.maxStep; i++) {
                list.push(i);
            }
            return list;
        }
    },
    watch: {
        activeTxPair() {
            this.step = '';
        },
        maxStep() {
            if ((!this.step && this.step !== 0)
                || this.step > this.maxStep) {
                this.step = this.maxStep;
            }
        },
        step() {
            this.$store.dispatch('exSetDepthStep', this.step);
        }
    },
    methods: {
        setStep(_step) {
            this.step = _step;
            this.toggleShowStepList();
        },
        toggleShowStepList() {
            this.isShowStepList = !this.isShowStepList;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.merge-depth-wrapper {
    position: relative;
    float: right;
    font-size: 12px;
    @include font-family-normal();
    color: rgba(158,164,173,1);
    line-height: 16px;
    padding: 6px 6px 3px;
    .select-list {
        position: relative;
        display: inline-block;
        background: rgba(255,255,255,1);
        border-radius: 2px;
        border: 1px solid rgba(212,222,231,1);
        padding: 2px 4px;
        font-size: 11px;
        color: rgba(115,118,122,1);
        line-height: 12px;
        min-width: 60px;
        &::before {
            content: '';
            float: right;
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
            background: url('~assets/imgs/uiKit/select/down.svg');
            background-size: 16px 16px;
            margin-top: -2px;
        }
        .list {
            position: absolute;
            background: rgba(255,255,255,1);
            box-shadow: 0px 5px 10px 0px rgba(176,192,237,0.69);
            border-radius: 2px;
            z-index: 2;
            margin-top: 6px;
            width: 100%;
            left: 0;
            .item {
                box-sizing: border-box;
                width: 100%;
                text-align: center;
                padding: 2px 10px;
                line-height: 16px;
                &:hover {
                    background: rgba(75,116,255,0.1);
                }
            }
        }
    }
}
</style>
