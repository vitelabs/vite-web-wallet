<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper
        .block__title 委托地址
        .block__content.edit(v-if="!!trustAddress") {{trustAddress}}
        input.block__content(v-else v-model="userInputAddress")
        .block__title 委托交易对
        .pair_section.exists
            PairItem(v-for="item in existsPair" :item="item" class="pairs")
        .pair_section.new2add
            PairItem(v-for="item in selectedPairs" :item="item" :cancelAble="true" @cancelItem="deleteItem(item)" class="pairs")
        SearchTips(:filterMethod="filterMethod" @selected="addItem" class="search")
</template>

<script>
import { throttle } from 'lodash';
import PairItem from './pairItem';
import SearchTips from 'uiKit/searchTips';
import { getProxyAblePairs } from 'services/tradeOperation';

// const MAX_RES_NUMS = 10;

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
        }
    },
    data() {
        return {
            allProxyAblePairs: [],
            selectedPairs: [],
            userInputAddress: '',
            userInput: '',
            dLTxt: this.$t('tokenCard.addToken.lTxt'),
            dRTxt: this.$t('tokenCard.addToken.rTxt'),
            dTitle: this.$t('tokenCard.addToken.title')
        };
    },
    beforeMount() {
        getProxyAblePairs().then(data => {
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
            console.log(item);
            const i = this.selectedPairs.findIndex(i => i.id === item.id);
            if (i >= 0) this.selectedPairs.splice(i, 1);
        },
        filterMethod(input) {
            console.log(999);
            return this.allProxyAblePairs.filter(p => p.symbol.replace('_', '/').indexOf(input) >= 0).map(p => Object.assign(p, { name: p.symbol.replace('_', '/'), id: `${ p.tradeToken }/${ p.quoteToken }` }));
        },
        inspector: throttle(function () {})
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
    &.new2add{
        border-top: 1px solid rgba(212,222,231,1);

    }
    .pairs{
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
.search{
    height: 205px;
}
</style>

