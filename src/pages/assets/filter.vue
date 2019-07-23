<template>
    <div class="filter-root">
        <Search
            class="filter"
            v-model="filterKey"
            :placeholder="$t('tradeAssets.search')"
        >
        </Search>
        <div class="filter op __pointer" @click="addToken">
            <img src="~assets/imgs/add_token.svg" class="op__input" />
            <div>{{ $t("tokenCard.addToken.title") }}</div>
        </div>
        <div class="filter op">
            <Checkbox v-model="hideZero" class="op__input" />
            {{ $t("tradeAssets.zero") }}
        </div>
        <div class="filter op click-able more __pointer" @click="more">
            {{ $t("tokenCard.moreRecords") }}
            <img src="~assets/imgs/moreRecords.svg" />
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import Search from 'components/search';
import { addTokenDialog } from './dialog';
import Checkbox from 'uiKit/checkbox';

export default {
    data() {
        return {
            hideZero: false,
            filterKey: ''
        };
    },
    watch: {
        hideZero() {
            this.updateFilter();
        },
        filterKey() {
            this.updateFilter();
        }
    },
    components: { Search, Checkbox },
    methods: {
        updateFilter: debounce(function () {
            this.$emit('newFilter', {
                hideZero: this.hideZero,
                filterKey: this.filterKey
            });
        }, 0.5),
        addToken() {
            addTokenDialog().catch(e => console.error(e));
        },
        more() {
            this.$router.push({ name: 'walletTransList' });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.filter-root {
    display: flex;
    align-items: flex-end;
    margin: 10px 0;
    height: 34px;
    position: relative;
    min-height: 34px;
    .filter {
        box-sizing: border-box;
        padding: 6px;
        font-size: 12px;
        @include font-family-normal();
        font-weight: 400;
        color: rgba(206, 209, 213, 1);
        line-height: 17px;
        border: none;
        display: flex;
        align-items: center;
        &.more {
            position: absolute;
            right: 0;
            bottom: 0px;
            cursor: pointer;
            img{
                margin-left: 8px;
            }
        }
        &:first-child {
            width: 260px;
            height: 100%;
            box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
            input {
                width: 100%;
                height: 100%;
            }
        }
        &.op {
            margin-left: 20px;
            color: #5e6875;
            display: flex;
            align-items: center;
            .op__input {
                height: 16px;
                width: 16px;
                cursor: pointer;
                margin-right: 10px;
            }
            display: flex;
        }
    }

    .filter_content {
        margin-top: 6px;
        height: 30px;
        background: #fff;
        border-radius: 2px;
        border: 1px solid rgba(212, 222, 231, 1);
        box-sizing: border-box;
    }
}
</style>
