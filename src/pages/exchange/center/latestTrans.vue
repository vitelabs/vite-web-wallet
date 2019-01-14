<template>
    <div>
        <div class="title">latest trans</div>
        <div class="__center-tb-row">
            <span class="__center-tb-item">price</span>
            <span class="__center-tb-item">amount</span>
            <span class="__center-tb-item">time</span>
        </div>
        <div class="__center-tb-row" @click="clickRow(trans)" 
             v-for="(trans, i) in latestTrans" :key="i">
            <span class="__center-tb-item">{{ trans.price }}</span>
            <span class="__center-tb-item">{{ trans.num }}</span>
            <span class="__center-tb-item">{{ trans.time }}</span>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        latestTrans() {
            return this.$store.state.exchangeLatestTrans.trans;
        }
    },
    methods: {
        clickRow(trans) {
            console.log(trans);
        }
    }
};
</script>

<style lang="scss" scoped>
@import './center.scss';

</style>
