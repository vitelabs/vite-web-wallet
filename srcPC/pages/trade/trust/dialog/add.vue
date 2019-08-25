<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper(v-if="actionType==='deleteAll'")
        i18n(path='tokenCard.charge.tips.0' tag="span")
            span.strong(place="tokenSymbol") {{trustAddress}}
    .content-wrapper(v-else)
        .block__title 委托地址
        .block__content.edit(v-if="!!trustAddress") {{trustAddress}}
        input.block__content(v-else v-model="userInputAddress")
        .block__title 委托交易对
        .pair_section.exists
            PairItem(v-for="item in existsPair" :item="item" class="pairs" :cancelAble="actionType==='delete'" @cancelItem="deleteExist(item)")
        .pair_section.new2add
            PairItem(v-for="item in selectedPairs" :item="item" :cancelAble="true" @cancelItem="deleteItem(item)" class="pairs")
        SearchTips(:filterMethod="filterMethod" @selected="addItem" class="search")
</template>

<script>
import { throttle } from 'lodash';
import PairItem from './pairItem';
import SearchTips from 'uiKit/searchTips';
import { getProxyAblePairs, configMarketsAgent } from 'pcServices/tradeOperation';

export default {
    components: { PairItem, SearchTips },
    props: {
        trustAddress: {
            type: String,
            default: ''
        },
        existsPair: {
            type: Array,
            default: () => []
        },
        actionType: {
            type: String, // new|add|delete|deleteAll
            default: 'new'
        }
    },
    data() {
        const rTxtMap = {
            new: '添加',
            add: '添加',
            delete: '确认修改',
            delteAll: '确认'
        };
        const titleMap = {
            new: '新增委托',
            add: '增加委托交易对',
            delete: '减少委托交易对',
            delteAll: '确认撤销委托'
        };
        return {
            allProxyAblePairs: [],
            selectedPairs: [],
            deletedPairs: [],
            userInputAddress: '',
            userInput: '',
            dLTxt: '取消',
            dWidth: this.actionType === 'deleteAll' ? 'narrow' : undefined,
            dRTxt: rTxtMap[this.actionType],
            dTitle: titleMap[this.actionType]
        };
    },
    beforeMount() {
        (this.actionType === 'new' || this.actionType === 'add')
            && getProxyAblePairs().then(data => {
                this.allProxyAblePairs = data;
            });
    },
    methods: {
        addItem(item) {
            if (this.selectedPairs.find(i => i.id === item.id)) {
                return;
            }
            this.selectedPairs.push(item);
        },
        deleteItem(item) {
            const i = this.selectedPairs.findIndex(i => i.id === item.id);
            if (i >= 0) this.selectedPairs.splice(i, 1);
        },
        deleteExist(item) {
            this.deletedPairs.push(item);
        },
        filterMethod(input) {
            return this.allProxyAblePairs
                .filter(p => p.symbol.replace('_', '/').indexOf(input) >= 0)
                .map(p =>
                    Object.assign(p, {
                        name: p.symbol.replace('_', '/'),
                        id: `${ p.tradeToken }/${ p.quoteToken }`
                    }));
        },
        inspector: throttle(function () {
            const actionType = (this.actionType === 'new' || this.actionType === 'add') ? 1 : 2;
            if (this.actionType === 'deleteAll') this.deletedPairs = this.existsPair;
            const manilpulatePairs = (this.actionType === 'new' || this.actionType === 'add') ? this.selectedPairs : this.deletedPairs;
            const tradeTokens = manilpulatePairs.map(p => p.tradeToken);
            const quoteTokens = manilpulatePairs.map(p => p.quoteToken);
            return configMarketsAgent({ actionType, agent: this.trustAddress || this.userInputAddress, tradeTokens, quoteTokens });
        })
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.pair_section {
    display: flex;
    flex-wrap: wrap;
    padding: 6px 0;
    &.exists {
        border-bottom: 1px solid rgba(212, 222, 231, 1);
    }
    .pairs {
        margin: 6px;
        margin-right: 0;
    }
}
.block__title {
    height: 16px;
    font-size: 12px;
    @include font-family-bold();
    color: rgba(29, 32, 36, 1);
    line-height: 16px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .err {
        color: #ff2929;
        font-size: 12px;
    }
    &:first-child {
        margin-top: 0;
    }
}

.block__content {
    position: relative;
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    font-size: 12px;
    word-break: break-word;
    width: 100%;
    box-sizing: border-box;
    margin-top: 16px;
    padding: 7px 15px;
    align-items: center;
    display: flex;
    width: 100%;
    justify-content: space-between;

    .all {
        color: rgba(0, 122, 255, 1);
        line-height: 16px;
        font-size: 12px;
        border-bottom: 1px dashed rgba(0, 122, 255, 1);
        cursor: pointer;
        float: right;
        display: flex;
        word-break: keep-all;
    }
    .token__title {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 20px;
            height: 20px;
            margin-right: 20px;
        }
    }
    input {
        width: 100%;
    }
    .light {
        color: #5e6875;
    }
    .blue {
        color: #007aff;
    }
    &.edit {
        text-align: left;
        background: rgba(243, 246, 249, 1);
        @include font-family-bold();
    }
}
.search {
    height: 205px;
}
</style>

