<template>
    <div class="__tb">
        <div class="__tb_row __tb_head __pointer">
            <template v-if="isSympleHead">
                <div  class="__tb_cell" v-for="(h) in headList" :key="h">{{ h }}</div>
            </template>

            <template v-else>
                <div v-for="(headItem, i) in headList" :key="i"
                     class="__tb_cell" :class="headItem.class || ''">
                    {{ headItem.text || '' }}
                </div>
            </template>
        </div>

        <div ref="tableContent" class="__tb_content" v-show="contentList && contentList.length">
            <template v-if="isSympleContent">
                <div class="__tb_row __pointer __tb_content_row"
                     v-for="(v, i) in contentList" :key="i"
                     @click="_clickRow(v, i)">
                    <div class="__tb_cell"
                         v-for="(item, j) in v " :key="j"
                         @click="clickCell(headList[j], item, j)">{{ item }}</div>
                </div>
            </template>

            <template v-else>
                <div v-for="(rowItem, index) in contentList" :key="index">
                    <div class="__tb_row __tb_content_row" :class="{
                        'active': !!clickRow,
                        '__pointer': !!clickRow
                    }" @click="_clickRow(rowItem, index)" >
                        <span v-for="(headItem, i) in headList" :key="i"
                              @click="clickCell(headList[i].cell, rowItem, index)"
                              :class="`${headItem.class || ''} ${headItem.cellClass || ''}`" class="__tb_cell">
                            <slot :name="`${index}${headList[i].cell}Before`"></slot>
                            {{ rowItem[ headList[i].cell ] }}
                            <slot :name="`${index}${headList[i].cell}After`"></slot>
                        </span>
                    </div>
                    <slot :name="`${index}Row`"></slot>
                </div>
            </template>
        </div>

        <div class="__tb_content __tb_content_no_data" v-show="!contentList || !contentList.length">
            <div class="__tb_no_data">
                <div>{{ noDataText || $t('hint.noData') }}</div>
            </div>
        </div>

        <slot name="tableBottom"></slot>
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
        },
        noDataText: {
            type: String,
            default: ''
        }
    },
    computed: {
        isSympleHead() {
            return !this.headList.find(v => typeof v !== 'string');
        },
        isSympleContent() {
            let isSymple = true;
            this.contentList.forEach(item => {
                if (!isSymple) {
                    return;
                }
                isSymple = !!item.find;
                if (item.find) {
                    isSymple = isSymple ? !item.find(v => typeof v !== 'string') : isSymple;
                }
            });
            return isSymple;
        }
    },
    methods: {
        _clickRow(item, index) {
            this.clickRow && this.clickRow(item, index);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~pcAssets/scss/table.scss';
@import './walletSBP.scss';
@import './walletQuota.scss';
@import './walletTransList.scss';
@import './walletVote.scss';
@import './mintage.scss';
@import './tradeOrderHistory.scss';
@import "./mintTrade.scss";
@import "./dividend.scss";
@import "./txPairManage.scss";
@import "./tradeList.scss";
@import "./incomeList.scss";
@import "./vipList.scss";
@import "./smallStakingList.scss";
</style>
