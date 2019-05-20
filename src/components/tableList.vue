<template>
    <div class="__tb">
        <div class="__tb_row __tb_head __pointer">
            <div v-for="(headItem, i) in headList" :key="i"
                 class="__tb_cell" :class="headItem.class || ''">
                {{ headItem.text || '' }}
            </div>
        </div>

        <div ref="tableContent" class="__tb_content" v-show="contentList && contentList.length">
            <div v-for="(rowItem, index) in contentList" :key="index"
                 class="__tb_row __tb_content_row" :class="{
                     'active': !!clickRow,
                     '__pointer': !!clickRow
            }" @click="_clickRow(rowItem)">
                <span v-for="(headItem, i) in headList" :key="i"
                      @click="clickCell(headList[i].cell, rowItem, index)"
                      v-html="rowItem[ headList[i].cell ]"
                      :class="headItem.class || ''" class="__tb_cell">{{ i }}
                </span>
            </div>
        </div>

        <div class="__tb_content __tb_no_data" v-show="!contentList || !contentList.length">
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
            default: () => []
        },
        contentList: {
            type: Array,
            default: () => []
        },
        clickRow: null,
        clickCell: {
            type: Function,
            default: () => {}
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
@import '~assets/scss/table.scss';
</style>
