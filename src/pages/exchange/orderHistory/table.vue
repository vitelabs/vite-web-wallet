<template>
    <div class="ex_tb">
        <div class="head-row">
            <div
                v-for="(h,i) in $t('exchangeOrderHistory.table.heads')"
                :key="h"
            >{{h.replace("#tokenSymbol#","vite")}} <div
                class="sort-btn"
                @click="sortBy(i)"
            ></div>
            </div>

        </div>
        <div class="row-container">
            <div
                class="row"
                v-for="v in sortedList"
                :key="v.orderId"
            >
                <div>{{v.date}}</div>
                <div>{{`${v.ftokenShow}/${v.ttokenShow}`}}</div>
                <div :class="{buy:v.side===0,sell:v.side===1}">{{$t("exchangeOrderHistory.side")[v.side]}}</div>
                <div>{{v.price}}</div>
                <div>{{v.amount}}</div>
                <div>{{v.filledQ}}</div>
                <div>{{v.rate}}</div>
                <div>{{v.average}}</div>
                <div>{{v.fee}}</div>
                <div>{{v.status}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            sortIndex: 0,
            sortType: 1
        };
    },
    methods: {
        sortBy(i) {
            if (i === this.sortIndex) {
                this.sortType *= -1;
                return;
            }
            this.sortIndex = i;
        },
        sortList(list) {
            return list.sort((a, b) => {
                return this.sortType * (a[this.sortIndex] - b[this.sortIndex]);
            });
        }
    },
    computed: {
        sortedList() {
            return this.sortList(this.list);
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
.buy {
    color: #ff0008;
}
.sell {
    color: #5bc500;
}
</style>
