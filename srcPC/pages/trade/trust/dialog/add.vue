<template lang="pug">
extends /components/dialog/base.pug
block content
    div(v-if="actionType==='deleteAll'")
        i18n.strong(path='trade.proxy.dialog.cancelAllTips' tag="span")
            div.address_container(place="trustAddress") {{trustAddress}}
    div(v-else)
        .__row
            .__row_t {{ $t('trade.proxy.passive.head.0') }}
                .__err(v-if="!isValidAddress") {{$t('hint.addrFormat')}}
            .__input_row.__unuse_input(v-if="!!trustAddress") {{trustAddress}}
            viteInput(v-else v-model="userInputAddress" :valid="validAddr" :placeholder="$t('wallet.placeholder.addr')")
        .__row
            .__row_t {{$t('trade.proxy.passive.head.1')}}
        .pair_section.exists(v-if="existsPair && existsPair.length")
            PairItem(v-for="item in existsPair" :key="item.id" :item="item" class="pairs" :cancelAble="actionType==='delete'" @cancelItem="deleteExist(item)")
        .pair_section(v-if="selectedPairs && selectedPairs.length" :class="{ pair_section__border_top: this.existsPair && this.existsPair.length>0 }")
            PairItem(v-for="item in selectedPairs" :key="item.id" :item="item" :cancelAble="true" @cancelItem="deleteItem(item)" class="pairs")
        SearchTips(:filterMethod="filterMethod" @selected="addItem" class="search" v-if="actionType==='new'||actionType==='add'")
</template>

<script>
import { throttle } from 'lodash';
import { wallet } from '@vite/vitejs';
import PairItem from './pairItem';
import SearchTips from 'uiKit/searchTips';
import viteInput from 'components/viteInput';
import { getProxyAblePairs, configMarketsAgent } from 'pcServices/tradeOperation';
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
            this.isValidAddress = wallet.isValidAddress(this.userInputAddress);
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
                (this.actionType === 'new' || this.actionType === 'add') ? this.$toast(this.$t('trade.proxy.successProxy')) : this.$toast(this.$t('trade.proxy.successCancelProxy'));
            } catch (e) {
                (this.actionType === 'new' || this.actionType === 'add') ? this.$toast(this.$t('trade.proxy.failProxy'), e) : this.$toast(this.$t('trade.proxy.failCancelProxy'), e);
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
@import "pcComponents/confirm/confirmRow.scss";
@import "./confirm.scss";

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

.search {
    height: 205px;
}
</style>
