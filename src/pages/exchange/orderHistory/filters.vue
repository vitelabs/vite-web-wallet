/**  vite-wallet login */

<template>
    <div class="filter-root">
        <div class="filter">
            <div class="filter_label"> {{ $t("exchangeOrderHistory.filter.start") }} </div>
            <FlatPickr
                v-model="fromDate"
                class="filter_content"
                :config="{dateFormat:'Z',enableTime:true,time_24hr:true}"
            ></FlatPickr>
        </div>
        <div class="separator">-</div>
        <div class="filter end">
            <div class="filter_label">{{ $t("exchangeOrderHistory.filter.end") }}</div>
            <FlatPickr
                v-model="toDate"
                class="filter_content"
                :config="{dateFormat:'Z',enableTime:true,time_24hr:true}"
            ></FlatPickr>
        </div>
        <div class="filter">
            <div class="filter_label">{{ $t("exchangeOrderHistory.filter.type") }}</div>
            <input class="filter_content" v-model="ftoken" />
        </div>
        <div class="separator">-</div>
        <div class="filter end">
            <select class="filter_content" v-model="ttoken">
                <option v-for="t in marketMap" :value="t.token" :key="t.token">{{t.name}}</option>
            </select>
        </div>
        <div class="filter end">
            <div class="filter_label">{{ $t("exchangeOrderHistory.filter.side") }}</div>
            <select
                v-model="tradeType"
                class="filter_content"
            >
                <option value="0">{{ $t("exchangeOrderHistory.filter.buy") }}</option>
                <option value="1">{{ $t("exchangeOrderHistory.filter.sell") }}</option>
            </select>
        </div>
        <div
            @click="submit"
            class="search active"
        >{{ $t("exchangeOrderHistory.filter.search") }}</div>
        <div
            @click="reset"
            class="search"
        >{{ $t("exchangeOrderHistory.filter.reset") }}</div>
    </div>
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
    data() {
        return {
            fromDate: '',
            toDate: '',
            tradeType: '',
            ftoken: '',
            ttoken: '',
            tokenMap: []
        };
    },
    components: {
        FlatPickr
    },
    computed:{
        marketMap(){
            return this.$store.state.exchangeMarket.marketMap;
        }
    },
    methods: {
        reset(){
            this.$emit('submit', {
            });
        },
        submit() {
            this.$emit('submit', {
                fdate: this.fromDate?new Date(this.fromDate).getTime()/1000:'',
                tdate: this.toDate?new Date(this.toDate).getTime()/1000:'',
                orderSide: this.tradeType,
                ftoken: this.ftoken,
                ttoken: this.ttoken
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "assets/scss/vars.scss";
.filter-root {
    display: flex;
    align-items: flex-end;
    margin: 0px 10px 20px;
    .filter {
        width: 140px;
        > * {
            width: 100%;
        }
        input,
        select {
            color: #5e6875;
            padding-left: 10px;
            font-size: 14px;
        }
        &:first-child,
        &:nth-child(3) {
            width: 220px;
        }
        &.end {
            margin-right: 18px;
        }
    }
    .separator {
        height: 30px;
        margin: 0 8px;
        display: flex;
    }
    .filter_label {
        color: #24272b;
        font: $font-bold;
    }
    .filter_content {
        margin-top: 6px;
        height: 30px;
        background: #fff;
        border-radius: 2px;
        border: 1px solid rgba(212, 222, 231, 1);
        box-sizing: border-box;
    }
    .search {
        width: 60px;
        height: 30px;
        color: #007aff;
        border-radius: 2px;
        border: 1px solid #007aff;
        text-align: center;
        line-height: 30px;
        margin-right: 18px;
        cursor: pointer;
        &:active,&.active {
            background: rgba(0, 122, 255, 1);
            color: #fff;
        }
    }
}
</style>
