<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper
        .search-container
            span.search-icon
            input(v-model="userInput" class="search-input" :placeholder="$t('tokenCard.addToken.placeholder')")
        .search-tips
            .search-tips__item(v-for="(token,index) in searchRes" :class="{active:selectedTokenIds.indexOf(token.tokenId)>=0}" @click="toggleToken(token.tokenId,index)")
                input(type="checkbox" name="addTokenSelected" v-model="selectedTokenIds" :value="token.tokenId" )
                img(:src="token.icon")
                .info
                    .title
                        .name {{token.tokenName}}
                        .tag {{token2Gate[token.tokenId]?token2Gate[token.tokenId].gateway:''}}
                    .desc {{token.tokenId}}
</template>

<script>
import { gateStorage } from 'pcServices/gate';
import throttle from 'lodash/throttle';
import statistics from 'utils/statistics';

const MAX_RES_NUMS = 10;

export default {
    data() {
        return {
            selectedTokenIds: [],
            userInput: '',
            dLTxt: this.$t('tokenCard.addToken.lTxt'),
            dRTxt: this.$t('tokenCard.addToken.rTxt'),
            dTitle: this.$t('tokenCard.addToken.title')
        };
    },
    methods: {
        toggleToken(tokenId, index) {
            const isActive = this.selectedTokenIds.indexOf(tokenId)>=0;
            if (isActive) {
                this.selectedTokenIds = this.selectedTokenIds.filter(id => id !== tokenId);
            } else {
                this.selectedTokenIds.push(tokenId);
            }
        },
        inspector: throttle(function () {
            statistics.event('assets', 'addToken-add', this.activeAddr || '');

            gateStorage.bindTokens(this.selectedTokenIds.map(i => {
                return { tokenId: i, gateInfo: {} };
            }));
            return Promise.resolve(this.selectedTokenIds);
        }, 1000)
    },
    computed: {
        token2Gate() {
            return this.$store.getters.mapToken2Gate;
        },
        searchRes() {
            if (this.userInput === '') {
                return [];
            }
            const shownTokens = [
                ...this.$store.getters.defaultTokenList,
                ...this.$store.getters.officalGateTokenList,
                ...this.$store.getters.userStorageTokenList
            ];
            const shownTokenIds = shownTokens
                .map(t => t.tokenId)
                .concat(this.$store.getters.otherWhithBalance);
            const allTokens = this.$store.state.ledger.allTokens;
            const reg = new RegExp(this.userInput.trim(), 'i');
            return allTokens
                .filter(t => shownTokenIds.indexOf(t.tokenId) === -1 && t.tokenName)
                .filter(t =>
                    t.tokenName.match(reg)
                        || t.tokenSymbol.match(reg)
                        || t.tokenId === this.userInput.trim())
                .slice(0, MAX_RES_NUMS);
        },
        BtnUnuse() {
            return this.selectedTokenIds.length === 0;
        },
        activeAddr() {
            return this.$store.getters.activeAddr;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.content-wrapper {
    min-height: 120px;
}

.search-container {
    position: relative;
    .search-input {
        box-sizing: border-box;
        width: 100%;
        height: 45px;
        padding-left: 33px;
        border-radius: 2px 2px 0px 0px;
        font-size: 12px;
        @include bg_color_1();
        @include common_border();
        @include font_color_1();
    }
    .search-icon {
        width: 18px;
        height: 18px;
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        @include background_common_img_suffix('search', 'svg', 'png');
    }
}

.search-tips {
    flex: 1;
    height: 260px;
    overflow-y: scroll;
    border-radius: 0px 0px 2px 2px;
    @include common_border();
    border-top: none;
    &__item {
        display: flex;
        height: 52px;
        padding: 7px 15px;
        align-items: center;
        cursor: pointer;
        &.active,
        &:hover {
            @include hover_color();
        }
        input {
            height: 16px;
            width: 16px;
        }
        img {
            margin: 0 12px;
            height: 20px;
            width: 20px;
        }
        .info {
            display: flex;
            flex-direction: column;
            font-size: 12px;
            .title {
                display: flex;
                .name {
                    @include font-family-bold();
                    @include common_font_color();
                    font-size: 14px;
                    line-height: 18px;
                }
                .tag {
                    background: rgba(0, 122, 255, 0.06);
                    border-radius: 2px;
                    height: 18px;
                    color: $blue-color-1;
                    line-height: 18px;
                    padding: 0 4px;
                }
            }
            .desc {
                @include gray_font_color_1();
            }
        }
    }
}
</style>
