<template>
    <div class="assets-ct">
        <div class="filter-root">
            <Search class="filter" v-model="filterKey"
                    :placeholder="$t('tradeAssets.search')">
            </Search>
            <div class="filter">
                <input type="checkbox" v-model="hideZero">
                {{ $t("tradeAssets.zero") }}
            </div>
        </div>
        <Table :filter="{ hideZero, filterKey: filterKey.trim() }"></Table>
    </div>
</template>

<script>
import Table from './table';
import Search from 'components/search';

export default {
    components: { Table, Search },
    data() {
        // Optype: 1充值，2提现； optime单位是秒；
        return {
            hideZero: false,
            filterKey: '',
            acc: null,
            addr: ''
        };
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.filter-root {
    display: flex;
    align-items: flex-end;
    margin-bottom: 14px;

    .filter {
        box-sizing: border-box;
        height: 28px;
        padding: 6px;
        font-size: 12px;
        font-family: $font-normal, arial, sans-serif;
        font-weight: 400;
        color: rgba(206, 209, 213, 1);
        line-height: 17px;

        &:first-child {
            width: 260px;
            input {
                width: 100%;
                height: 100%;
            }
        }

        &:last-child {
            margin-left: 20px;
            color: #5e6875;
            width: 140px;
            display: flex;
            align-items: center;
            input {
                margin-right: 10px;
            }
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

.assets-ct {
    height: 100%;
    box-sizing: border-box;
    padding: 14px 10px 0px 10px;
}
</style>

<style lang="scss">
.filter.search .icon {
    width: 12px;
    height: 12px;
    background-size: 12px 12px;
    margin-top: 2px;
    margin-right: 3px;
}
</style>

