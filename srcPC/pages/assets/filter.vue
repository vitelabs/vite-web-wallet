<template>
    <div class="filter-root">
        <Search
            class="filter"
            v-model="filterKey"
            :placeholder="$t('tradeAssets.search')"
        >
        </Search>
        <div class="filter op __pointer" @click="addToken">
            <span class="op__input add_token" ></span>
            <div>{{ $t("tokenCard.addToken.title") }}</div>
        </div>
        <div class="filter op">
            <Checkbox @input="hideZeroAssets" :value="hideZero" class="op__input" />
            {{ $t("tradeAssets.zero") }}
        </div>
        <div class="filter op click-able more __pointer" @click="more">
            {{ $t("tokenCard.moreRecords") }}
            <span class="more_records"></span>
        </div>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import Search from 'components/search';
import { addTokenDialog } from './dialog';
import Checkbox from 'uiKit/checkbox';
import statistics from 'utils/statistics';

export default {
    data() {
        return { filterKey: '' };
    },
    computed: {
        activeAddr() {
            return this.$store.getters.activeAddr;
        },
        hideZero() {
            return !!this.$store.state.env.hideZeroAssets;
        }
    },
    mounted() {
        this.$emit('newFilter', {
            hideZero: this.hideZero,
            filterKey: this.filterKey
        });
    },
    watch: {
        hideZero() {
            if (this.hideZero) {
                statistics.event(this.$route.name, 'hideLowBalances', this.activeAddr || '');
            } else {
                statistics.event(this.$route.name, 'showLowBalances', this.activeAddr || '');
            }
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
            statistics.event(this.$route.name, 'addToken', this.activeAddr || '');
            addTokenDialog().catch(e => console.error(e));
        },
        more() {
            statistics.event(this.$route.name, 'moreRecords', this.activeAddr || '');
            this.$router.push({ name: 'walletTransList' });
        },
        hideZeroAssets(isHideZero) {
            this.$store.commit('setHideZeroAssets', isHideZero);
        }
    }
};
</script>

<style lang="scss" scoped>
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
            .more_records {
                width: 16px;
                height: 16px;
                margin-left: 8px;
                @include background_common_img_suffix('moreRecords', 'svg', 'png');
            }
        }
        &:first-child {
            width: 260px;
            height: 100%;
            @include box_shadow();
            [data-theme="1"] & {
                border: 1px solid $black-color-4;
            }
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
                &.add_token {
                    @include background_common_img_suffix('add_token', 'svg', 'png');
                }
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
