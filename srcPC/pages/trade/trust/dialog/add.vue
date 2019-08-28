<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper(v-if="actionType==='deleteAll'")
        i18n.strong(path='trade.proxy.dialog.cancelAllTips' tag="span")
            div.address_container(place="trustAddress") {{trustAddress}}
    .content-wrapper(v-else)
        .block__title {{$t('trade.proxy.passive.head.0')}}
            .err(v-if="!isValidAddress") {{$t('hint.addrFormat')}}
        .block__content.edit(v-if="!!trustAddress") {{trustAddress}}
        viteInput.block__content(v-else v-model="userInputAddress" :valid="validAddr" :placeholder="$t('wallet.placeholder.addr')")
        .block__title {{$t('trade.proxy.passive.head.1')}}
        .pair_section.exists
            PairItem(v-for="item in existsPair" :key="item.id" :item="item" class="pairs" :cancelAble="actionType==='delete'" @cancelItem="deleteExist(item)")
        .pair_section(:class="{pair_section__border_top:this.existsPair&&this.existsPair.length>0}")
            PairItem(v-for="item in selectedPairs" :key="item.id" :item="item" :cancelAble="true" @cancelItem="deleteItem(item)" class="pairs")
        SearchTips( :filterMethod="filterMethod" @selected="addItem" class="search" v-if="actionType==='new'||actionType==='add'")
</template>

<script>
import { throttle } from 'lodash';
import { hdAddr } from '@vite/vitejs';
import PairItem from './pairItem';
import SearchTips from 'uiKit/searchTips';
import viteInput from 'components/viteInput';
import {
    getProxyAblePairs,
    configMarketsAgent
} from 'pcServices/tradeOperation';
import { confirmDialog } from './index';

export default {
    components: { PairItem, SearchTips, viteInput },
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
        const rTxtMap = this.$t('trade.proxy.dialog.rTxtMap');
        const titleMap = this.$t('trade.proxy.dialog.titleMap');
        return {
            allProxyAblePairs: [],
            selectedPairs: [],
            deletedPairs: [],
            userInputAddress: '',
            userInput: '',
            dLTxt: this.$t('trade.proxy.dialog.cancel'),
            dWidth: this.actionType === 'deleteAll' ? 'narrow' : undefined,
            dRTxt: rTxtMap[this.actionType],
            dTitle: titleMap[this.actionType],
            isValidAddress: true
        };
    },
    beforeMount() {
        window.fffff = this;
        (this.actionType === 'new' || this.actionType === 'add')
            && getProxyAblePairs().then(data => {
                this.allProxyAblePairs = data;
            });
    },
    methods: {
        validAddr() {
            if (this.actionType !== 'new' || !this.userInputAddress) {
                this.isValidAddress = true;
                return;
            }
            this.isValidAddress = hdAddr.isValidHexAddr(this.userInputAddress);
        },
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
            const i = this.existsPair.findIndex(i => i.id === item.id);
            if (i >= 0) this.existsPair.splice(i, 1), this.deletedPairs.push(item);
        },
        filterMethod(input) {
            if (!input) return [];
            return this.allProxyAblePairs
                .filter(p =>
                    p.symbol
                        .replace('_', '/')
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                        && !this.selectedPairs.find(p1 => p1.symbol === p.symbol)
                        && !this.existsPair.find(p2 => p2.symbol === p.symbol))
                .map(p =>
                    Object.assign(p, {
                        name: p.symbol.replace('_', '/'),
                        id: `${ p.tradeToken }/${ p.quoteToken }`
                    }));
        },
        inspector: throttle(async function () {
            const actionType
                = this.actionType === 'new' || this.actionType === 'add' ? 1 : 2;
            if (this.actionType === 'deleteAll') this.deletedPairs = this.existsPair;
            const manilpulatePairs
                = this.actionType === 'new' || this.actionType === 'add'
                    ? this.selectedPairs
                    : this.deletedPairs;
            const tradeTokens = manilpulatePairs.map(p => p.tradeToken);
            const quoteTokens = manilpulatePairs.map(p => p.quoteToken);
            if (this.actionType !== 'deleteAll') {
                await confirmDialog({
                    pairs: this.actionType === 'delete' ? this.existsPair : [].concat(this.existsPair, this.selectedPairs),
                    trustAddress: this.trustAddress || this.userInputAddress
                });
            }
            try {
                await configMarketsAgent({
                    actionType,
                    agent: this.trustAddress || this.userInputAddress,
                    tradeTokens,
                    quoteTokens
                });
                this.$toast(this.$t('trade.proxy.dialog.successProxy'));
            } catch (e) {
                this.$toast(this.$t('trade.proxy.dialog.failProxy'), e);
                return Promise.reject(e);
            }
        })
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        dBtnUnuse() {
            return !this.isValidAddress || (this.actionType === 'new' && !this.userInputAddress);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.strong {
    color: #1d2024;
    font-size: 14px;
}
.address_container {
    font-size: 12px;
    color: #5e6875;
    word-break: break-all;
    line-height: 14px;
}
.pair_section {
    display: flex;
    flex-wrap: wrap;
    padding: 6px 0;
    &.__border_top {
        border-top: 1px solid rgba(212, 222, 231, 1);
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

