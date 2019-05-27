<template>
    <div class="filter-root">
        <Search
            class="filter"
            v-model="filterKey"
            :placeholder="$t('tradeAssets.search')"
        >
        </Search>
        <div class="addToken"></div>
        <div class="filter">
            <input
                type="checkbox"
                v-model="hideZero"
            />
            {{ $t("tradeAssets.zero") }}
        </div>
    </div>
</template>
<script>
import { debounce } from 'lodash';
import Search from 'components/search';
export default {
    data() {
        return {
            hideZero: false,
            filterKey: ''
        };
    },
    components: { Search },
    methods: {
        updateFilter: debounce(function () {

        }, 0.5)
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

  .filter {
    box-sizing: border-box;
    padding: 6px;
    font-size: 12px;
    font-family: $font-normal;
    font-weight: 400;
    color: rgba(206, 209, 213, 1);
    line-height: 17px;
    border: none;
    &:first-child {
      width: 260px;
      height: 100%;
      box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
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
</style>
