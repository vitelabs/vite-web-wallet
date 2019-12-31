<template>
    <div class="currency-wrapper">
        <div class="small-title bold">
            {{ $t('setting.gate') }}
            <help-tips :helpText="$t('setting.gateHelp')"></help-tips>
        </div>

        <div class="setting common-list-wrapper __pointer">
            <span class="list-title" :class="{
                'down': !isShow,
                'up': isShow
            }" @click="toggleList">{{ $t(`setting.triggerGate.${gate}`) }}</span>
            <ul class="list" v-show="isShow">
                <li v-for="(item, index) in list" :key="index" v-show="item !== gate"
                    @click="setVal(item)">{{ $t(`setting.triggerGate.${index}`) }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import helpTips from 'pcComponents/helpTips';

export default {
    components: { helpTips },
    data() {
        return {
            isShow: false,
            list: [ 0, 1 ]
        };
    },
    computed: {
        gate() {
            return +this.$store.state.env.gate;
        }
    },
    methods: {
        setVal(gate) {
            this.$store.commit('setGate', gate);
            this.toggleList();
        },
        toggleList() {
            this.isShow = !this.isShow;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~pcAssets/scss/list/setting.scss";
@import "./setting.scss";
</style>
