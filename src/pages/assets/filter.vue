<template>
    <div class="filter-root">
        <Search
            class="filter"
            v-model="filterKey"
            :placeholder="$t('tradeAssets.search')"
        >
        </Search>
        <div class="filter op" @click="addToken">
            <img src="~assets/imgs/add_token.png" />
            <div>{{ $t("tokenCard.addToken.title") }}</div>
        </div>
        <div class="filter op">
            <input type="checkbox" v-model="hideZero" />
            {{ $t("tradeAssets.zero") }}
        </div>
        <div class="filter op click-able more" @click="more">
            {{ $t("tokenCard.moreRecrods") }}
            <img src="~assets/imgs/moreRecrods.png" />
        </div>
    </div>
</template>
<script>
import { debounce } from 'lodash';
import Search from 'components/search';
import { addTokenDialog } from './dialog';
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
    components: { Search },
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
    margin: 10px 10px;
    height: 34px;
    position: relative;
    .filter {
        box-sizing: border-box;
        padding: 6px;
        font-size: 12px;
        font-family: $font-normal;
        font-weight: 400;
        color: rgba(206, 209, 213, 1);
        line-height: 17px;
        border: none;
        &.more {
            position: absolute;
            right: 0;
            cursor: pointer;
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
            img,
            input {
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
