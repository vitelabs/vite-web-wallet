<template>
    <div class="ex_tb">
        <div class="head-row">
            <div
                v-for="(h) in $t('exchangeAssets.table.heads')"
                :key="h"
            >{{h.replace("#tokenSymbol#","vite")}}
            </div>
            <div></div>
        </div>
        <div class="row-container">
            <div
                class="row"
                v-for="token in list"
                :key="token.id"
            >
                <div>{{token.symbol}}</div>
                <div>{{token.balance}}</div>
                <div>{{token.available}}</div>
                <div>{{token.lock}}</div>
                <div>{{token.worth}}</div>
                <div
                    @click="recharge(token.id)"
                    class="click-able"
                >{{$t("exchangeAssets.table.rowMap.recharge")}}</div>
                <div
                    @click="withdraw(token.id)"
                    class="click-able"
                >{{$t("exchangeAssets.table.rowMap.withdraw")}}</div>
                <div
                    @click="detail(token.id)"
                    class="click-able"
                >{{$t("exchangeAssets.table.rowMap.detail")}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import confirm from "components/confirm";
import {deposit} from "services/exchange"
export default {
    data() {
        return {
            sortIndex: 0,
            sortType: 1
        };
    },
    methods: {
        withdraw(tokenId) {
            deposit({tokenId,amount:'1'})
        },
        recharge(tokenId) {
            deposit({tokenId,amount:'1'})
        },
        detail(token) {}
    },
    computed: {
        balance() {
            const exB = this.$store.getters.exBalanceList;
            const walletB = this.$store.getters.tokenBalanceList;
            const res = {};
            Object.keys(exB).forEach(t => {
                res[t] = {
                    available: exB[t].available,
                    lock: exB[t].lock,
                    balance: 0,
                    icon: "",
                    id: t,
                    symbol: exB[t].tokenInfo.tokenSymbol
                };
            });
            Object.keys(walletB).forEach(t => {
                if (res[t]) {
                    res[t].icon = walletB[t].icon;
                    res[t].balance = walletB[t].balance;
                    return;
                }
                res[t] = {
                    available: 0,
                    lock: 0,
                    balance: walletB[t].balance,
                    icon: walletB[t].icon,
                    id: t,
                    symbol: walletB[t].symbol
                };
            });
            Object.keys(res).forEach(t => {
                if(!this.$store.state.exchangeRate.rateMap[t]){
                    res[t].worth="-";
                    return;
                }
                res[t].worth = `${this.$i18n.locale === "zh" ? "¥" : "$"}${
                    this.$store.state.exchangeRate.rateMap[t][
                        this.$i18n.locale === "zh" ? "cny" : "usd"
                    ]
                }`;
            });
            return res;
        },
        list() {
            return Object.keys(this.balance)
                .map(k => this.balance[k])
                .filter(v => v)
                .sort((a, b) => a.available - b.available);
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../components/table.scss";
.ex_tb {
    height: 100%;
    padding-bottom: 10px;
}
@include rowWith {
    width: 8%;
    &:first-child,
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
        width: 15%;
    }
}
</style>
