<template>
    <div v-show="stepList.length" class="merge-depth-wrapper">
        {{ $t('tradeCenter.mergeDepth') }}
        <div class="select-list __pointer" @click.self="toggleShowStepList">
            {{ $t('tradeCenter.depthStep', { step }) }}
            <div v-show="isShowStepList" class="list">
                <div class="item" @click="setStep(s)"
                     v-for="(s,i) in stepList" :key="i">
                    {{ $t('tradeCenter.depthStep', { step: s }) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return { isShowStepList: false };
    },
    computed: {
        step() {
            return this.$store.state.exchangeDepth.depthStep;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        ttokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        maxStep() {
            return this.$store.getters.exTxPairMaxStep;
        },
        minStep() {
            return this.$store.getters.exTxPairMinStep;
        },
        stepList() {
            if (this.maxStep < 0) {
                return [];
            }

            const list = [];
            for (let i = this.minStep; i <= this.maxStep; i++) {
                list.push(i);
            }
            return list;
        }
    },
    watch: {
        activeTxPair(val, oldval) {
            if (oldval && val && val.symbol === oldval.symbol) {
                return;
            }

            this.$store.dispatch('exSetDepthStep', this.maxStep);
        }
    },
    methods: {
        setStep(_step) {
            this.$store.dispatch('exSetDepthStep', _step);
            this.isShowStepList = false;
        },
        toggleShowStepList() {
            this.isShowStepList = !this.isShowStepList;
        }
    }
};
</script>

<style lang="scss" scoped>
.merge-depth-wrapper {
    position: relative;
    float: right;
    font-size: 12px;
    @include font-family-normal();
    line-height: 16px;
    padding: 6px 6px 3px;
    [data-theme="0"] & {
        color: #9ea4ad;
    }
    [data-theme="1"] & {
        color: $gray-color-2;
    }
    .select-list {
        position: relative;
        display: inline-block;
        border-radius: 2px;
        padding: 2px 4px;
        font-size: 11px;
        line-height: 12px;
        min-width: 60px;
        @include bg_color_1();
        @include common_border();
        [data-theme="0"] & {
            color: #73767a;
        }
        [data-theme="1"] & {
            color: #C0C6D3;
        }
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
            @include bg_color_1();
            [data-theme="0"] & {
                box-shadow: 0px 5px 10px 0px rgba(176,192,237,0.69);
            }
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
