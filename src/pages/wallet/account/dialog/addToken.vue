<template lang="pug">
extends /components/dialog/base.pug
block content
    search(v-model="userInput" class="search-input")
    .search-tips
        .search-tips__item(v-for="token in searchRes" :class="{active:selectedTokenIds.indexOf(token.tokenId)>=0}")
            input(type="checkbox" name="addTokenSelected" v-model="selectedTokenIds" :value="token.tokenId" )
            img(:src="token.icon||token.tokenId|id2icon")
            .info
                .title
                    .name {{token.tokenName}}
                    .tag {{token2Gate[token.tokenId]?token2Gate[token.tokenId].gateway:''}}
                .desc {{token.tokenId}}

</template>

<script>
import search from 'components/search';
import { gateStorage } from 'services/gate';

const MAX_RES_NUMS = 10;
export default {
    components: { search },
    data() {
        return {
            selectedTokenIds: [],
            userInput: '',
            dLTxt: '取消',
            dRTxt: '添加',
            dTitle: '添加代币'
        };
    },
    methods: {
        inspector() {
            const map = {};
            this.selectedTokenIds.map(i => (map[i] = {}));
            gateStorage.bindTokens(map);
            return Promise.resolve(this.selectedTokenIds);
        }
    },
    computed: {
        token2Gate() {
            return this.$store.getters.mapToken2Gate;
        },
        searchRes() {
            if (this.userInput === '') {
                return [];
            }
            const shownTokens = [ ...this.$store.getters.defaultTokenList, ...this.$store.getters.officalGateTokenList, ...this.$store.getters.userStorageTokenList ];
            const shownTokenIds = shownTokens.map(t => t.tokenId).concat(this.$store.getters.otherWhithBalance);
            const allTokens = this.$store.state.ledger.allTokens;
            return allTokens.filter(t => shownTokenIds.indexOf(t.tokenId) === -1).filter(t => t.tokenId.indexOf(this.userInput) >= 0 || t.tokenName.indexOf(this.userInput) >= 0 || t.tokenSymbol.indexOf(this.userInput) >= 0).slice(0, MAX_RES_NUMS);
        },
        BtnUnuse() {
            return this.selectedTokenIds.length === 0;
        }
    }
};
</script>

<style lang="scss" scoped>
.search-input{
    width: 100%;
    height: 50px;
}
.search-tips{
    max-height: 260px;
    overflow-y: scroll;
    &__item{
        display: flex;
        height: 52px;
        padding: 7px 15px;
        align-items: center;
        cursor: pointer;
        &.active,&:hover{
            background: rgba(0,122,255,0.03);
        }
        input{
            height: 16px;
            width: 16px;
        }
        img{
            margin: 0 12px;
            height: 20px;
            width: 20px;
        }
        .info{
            display: flex;
            flex-direction: column;
            font-size: 12px;
            .title{
                display: flex;
                .name{
                    color: #1D2024;
                    font-size: 14px;
                }
                .tag{
                    height: 16px;

                    background-color: rgba(0,122,255,0.06);
                    color: #007AFF;
                    line-height: 16px;
                }
            }
            .desc{
                color: #5E6875;
            }
        }
    }
}
</style>

