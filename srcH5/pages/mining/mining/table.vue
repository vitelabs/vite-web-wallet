<template>
    <div class="list">
        <div v-for="(content, i) in contentList" :key="i" class="item">
            <div v-for="(head, j) in headList" :key="j" class="item-row">
                <span v-if="head.text">{{ head.text }}</span>
                <span v-if="head.cell !== 'amount'">{{ content[head.cell] }}</span>
                <span v-if="head.cell === 'amount'">
                    <span class="amount">{{ content[head.cell].amount }}</span>{{ content[head.cell].token }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        headList: {
            type: Array,
            default: () => []
        },
        contentList: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid rgba(211,223,239,1);
    font-size: 14px;
    @include font-normal();
    color: rgba(62,74,89,0.6);
    line-height: 18px;
    .item-row {
        margin-top: 10px;
        width: 50%;
        white-space: nowrap;
        &:last-child {
            margin-bottom: 12px;
        }
        &:nth-child(2n) {
            text-align: right;
        }
        .amount {
            font-size: 16px;
            @include font-bold();
            color: rgba(36,39,43,1);
            line-height: 20px;
            margin-right: 4px;
            white-space: nowrap;
        }
    }
}
</style>
