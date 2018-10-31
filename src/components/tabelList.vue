<template>
    <div class="tabel-list">
        <div class="table__head __pointer">
            <div v-for="(headItem, i) in headList" :key="i" 
                 class="cell-text" :class="headItem.class || ''">
                {{ headItem.text || '' }}
            </div>
        </div>

        <div ref="tableContent" class="table-content" v-show="contentList && contentList.length">
            <div v-for="(rowItem, index) in contentList" :key="index"
                 class="t-row" :class="{
                     'active': !!clickRow,
                     '__pointer': !!clickRow
            }" @click="_clickRow(rowItem)">
                <span v-for="(headItem, i) in headList" :key="i" 
                      @click="clickCell(headList[i].cell, rowItem, index)"
                      v-html="rowItem[ headList[i].cell ]" 
                      :class="headItem.class || ''" class="cell-text">{{ i }}
                </span>
            </div>
        </div>

        <div class="table-content no-data" v-show="!contentList || !contentList.length">
            {{ $t('hint.noData') }}
        </div>

        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        headList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        contentList: {
            type: Array,
            default: () =>{
                return [];
            }
        },
        clickRow: null,
        clickCell: {
            type: Function,
            default: ()=>{}
        }
    },
    methods: {
        _clickRow(item) {
            this.clickRow && this.clickRow(item);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.tabel-list {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    min-width: 1050px;
    overflow: auto;
    background: #FFF;
    box-shadow: 0 2px 15px 1px rgba(176, 192, 237, 0.17);
    border-radius: 8px;
    .table__head {
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #f3f6f9;
        font-family: $font-bold;
        color: #1D2024;
    }
    .table-content {
        position: relative;
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .pagination {
        height: 75px;
        line-height: 75px;
        text-align: center;
        border-top: 1px solid #f3f6f9;
    }
}

.t-row {
    border-bottom: 1px solid #f3f6f9;
    color: #5E6875;
    height: 48px;
    line-height: 48px;
    box-sizing: border-box;
    &:last-child {
        border: none;
    }
    &.active:hover {
        background: rgba(88,145,255,.13);
    }
}

.cell-text {
    display: inline-block;
    text-align: left;
    font-size: 14px;
    &:first-child {
        padding-left: 22.5px;
    }
    &:last-child {
        padding-right: 22.5px;
    }
}

.no-data {
    height: 75px;
    line-height: 75px;
    text-align: center;
}

@media only screen and (max-width: 500px) {
    .cell-text {
        white-space: nowrap;
        &:first-child {
            float: left;
            padding-left: 10px;
        }
        &:last-child {
            float: right;
            padding-right: 10px;
        }
    }
}
</style>
