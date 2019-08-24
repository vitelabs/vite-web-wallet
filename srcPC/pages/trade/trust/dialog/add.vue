<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper
        .block_title 委托地址
        .block_content(v-if="!!trustAddress") {{trustAddress}}
        input.block_content.edit(v-else v-model="userInputAddress")
        .block_title 委托交易对
        .exists_section
            PairItem(v-for="item in existsPair" :item="item")
        .add_section
            PairItem(v-for="item in existsPair" :item="item" :cancelAble="true" @cancelItem="deleteItem(item)")
        .search-container
            img.search-icon(src="~assets/imgs/search_gray.png")
            input(v-model="userInput" class="search-input" :placeholder="$t('tokenCard.addToken.placeholder')")
        SearchTips(:filterMethod="filterMethod" @selected="addItem")
</template>

<script>
import { throttle } from 'lodash';
import PairItem from './pairItem';
import SearchTips from 'uiKit/searchTips';

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
            selectedPairs: [],
            userInputAddress: '',
            dLTxt: this.$t('tokenCard.addToken.lTxt'),
            dRTxt: this.$t('tokenCard.addToken.rTxt'),
            dTitle: this.$t('tokenCard.addToken.title')
        };
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
        filterMethod() {
            return [];
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
.exists_section {
    display: flex;
    flex-wrap: wrap;
}
.add_section {
    display: flex;
    flex-wrap: wrap;
}
</style>

