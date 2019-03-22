<template>
    <div class="filter-root">
        <div class="filter">
            <div class="filter_label"> {{ $t("exchangeOrderHistory.filter.start") }} </div>
            <FlatPickr
                v-model="fromDate"
                class="filter_content"
                :config="{dateFormat:'Y-m-d H:i',enableTime:true,time_24hr:true}"
            ></FlatPickr>
        </div>
        <div class="separator">-</div>
        <div class="filter end">
            <div class="filter_label">{{ $t("exchangeOrderHistory.filter.end") }}</div>
            <FlatPickr
                v-model="toDate"
                class="filter_content"
                :config="{dateFormat:'Y-m-d H:i',enableTime:true,time_24hr:true}"
            ></FlatPickr>
        </div>
        <div class="filter">
            <div class="filter_label">{{ $t("exchangeOrderHistory.filter.type") }}</div>
            <select class="filter_content" v-model="ftoken">
                <option :value="token.token" v-for="token in ftokenMap" :key="token.token">{{token.name}}</option>
            </select>
        </div>
        <div class="separator">-</div>
        <div class="filter end">
            <select class="filter_content" v-model="ttoken">
                <option v-for="t in marketMap" :value="t.token" :key="t.token">{{t.name}}</option>
            </select>
        </div>
        <div class="filter end">
            <div class="filter_label">{{ $t("exchangeOrderHistory.filter.side") }}</div>
            <select v-model="tradeType" class="filter_content">
                <option value="0">{{ $t("exchangeOrderHistory.filter.buy") }}</option>
                <option value="1">{{ $t("exchangeOrderHistory.filter.sell") }}</option>
            </select>
        </div>
        <div @click="submit" class="search active">
            {{ $t("exchangeOrderHistory.filter.search") }}
        </div>
        <div @click="reset" class="search">
            {{ $t("exchangeOrderHistory.filter.reset") }}
        </div>
    </div>
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import { tokenMap } from 'services/exchange';
import 'flatpickr/dist/flatpickr.css';

export default {
    components: { FlatPickr },
    beforeMount() {
        this.ttoken = this.currentToken;
    },
    data() {
        return {
            fromDate: '',
            toDate: '',
            tradeType: '',
            ftoken: '',
            ttoken: '',
            tokenMap: [],
            ftokenMap: []
        };
    },
    computed: {
        marketMap() {
            return this.$store.state.exchangeMarket.marketMap;
        },
        currentToken() {
            return this.$store.state.exchangeMarket.currentMarket;
        }
    },
    watch: {
        ttoken() {
            tokenMap({ tokenId: this.ttoken }).then(data => (this.ftokenMap = data));
        }
    },
    methods: {
        reset() {
            this.fromDate = '';
            this.toDate = '';
            this.tradeType = '';
            this.ftoken = '';
            this.ttoken = this.currentToken;
            this.$emit('submit', {});
        },
        submit() {
            this.$emit('submit', {
                fdate: this.fromDate ? new Date(this.fromDate).getTime() / 1000 : '',
                tdate: this.toDate ? new Date(this.toDate).getTime() / 1000 : '',
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
    font-size: 12px;
    .filter {
        color: #5e6875;
        font-family: $font-normal;
        width: 132px;
        > * {
            width: 100%;
        }
        input, select {
            padding-left: 10px;
        }
        &.end {
            margin-right: 18px;
        }
    }
    .separator {
        height: 28px;
        margin: 0 8px;
        display: flex;
        color: #D4DEE7;
    }
    .filter_content {
        margin-top: 6px;
        height: 28px;
        background: #fff;
        border-radius: 2px;
        border: 1px solid rgba(212, 222, 231, 1);
        box-sizing: border-box;
    }
    .search {
        width: 60px;
        height: 28px;
        color: #007aff;
        border-radius: 2px;
        border: 1px solid #007aff;
        font-family: Avenir-Book;
        font-weight: normal;
        text-align: center;
        line-height: 28px;
        margin-right: 8px;
        cursor: pointer;
        &:active, &.active {
            background: rgba(0, 122, 255, 1);
            color: #fff;
        }
    }
}
</style>
