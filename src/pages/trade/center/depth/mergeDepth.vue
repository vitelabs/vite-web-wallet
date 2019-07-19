<template>
    <div v-show="stepList.length" class="merge-depth-wrapper">
        {{ $t('tradeCenter.mergeDepth') }}
        <div class="select-list">
            <div class="list-head">{{ step }}</div>
            <div class="list" @click="setStep(s)"
                 v-for="(s,i) in stepList" :key="i">{{ s }}</div>
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
        return { step: '' };
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
            if (!this.step && this.step !== 0) {
                return;
            }
            if (this.step > this.maxStep) {
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.merge-depth-wrapper {
    float: right;
    font-size: 12px;
    @include font-family-normal();
    color: rgba(158,164,173,1);
    line-height: 16px;
    padding: 6px 6px 3px;
}
</style>
