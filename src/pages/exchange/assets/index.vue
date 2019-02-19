<template>
    <div class="assets-ct">
        <div class="filter-root">
            <Search
                class="filter"
                v-model="filterKey"
                :placeholder="$t('exchangeAssets.search')"
            ></Search>

            <div class="filter"><input
                type="checkbox"
                v-model="hideZero"
            >隐藏0元代币</div>
        </div>
        <Table :filter="{hideZero,filterKey}"></Table>
    </div>
</template>
<script>
// optype: 1充值，2提现； optime单位是秒；
import Table from './table';
import Search from 'components/search';
export default {
    data() {
        return {
            hideZero: false,
            filterKey: '',
            acc:null,
            addr:''
        };
    },

    components: {
        Table,
        Search
    },
    computed: {}
};
</script>
<style lang="scss" scoped>
.filter-root {
    display: flex;
    align-items: flex-end;
    margin-bottom: 10px;
    .filter {
        height: 40px;
        &:first-child {
            width: 400px;
            input {
                width: 100%;
                height: 100%;
            }
        }
        &:last-child {
            margin-left: 18px;
            input {
                margin-right: 10px;
            }
            width: 140px;
            display: flex;
            align-items: center;
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
    overflow: hidden;
    padding: 20px 10px 10px;
    display: flex;
    flex-direction: column;
}
</style>
