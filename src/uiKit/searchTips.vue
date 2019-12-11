<template>
    <div class="v-search-tips" v-click-outside.includeChildrens="closeTips">
        <div class="search-input-container">
            <img src="~assets/imgs/search_gray.png" class="search-icon" />
            <input type="text" class="search-input" v-model="userInput" @blur="search(userInput)" />
        </div>
        <div class="tips-list" v-show="isShowTips">
            <div
                class="tips-item __pointer"
                v-for="item in searchRes"
                :key="item.id"
                @click="selected(item)"
            >
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script>
import throttle from 'lodash/throttle';

export default {
    props: {
        filterMethod: {
            type: Function,
            default: () => []
        }
    },
    data() {
        return { userInput: '', searchRes: [], isShowTips: false };
    },
    watch: {
        userInput: throttle(function (val) {
            this.search(val);
        }, 300)
    },
    methods: {
        search(val) {
            this.searchRes = this.filterMethod(val);
            if (this.searchRes.length > 0) {
                this.isShowTips = true;
            }
        },
        closeTips() {
            this.isShowTips = false;
        },
        selected(v) {
            this.closeTips();
            this.$emit('selected', v);
            this.userInput = '';
        }
    }
};
</script>

<style lang="scss">
.v-search-tips {
    font-size: 12px;
    max-height: 203px;
    min-height: 34px;
    display: flex;
    flex-direction: column;
    @include font_color_1();
    @include font-family-bold();
    .search-input-container {
        display: flex;
        padding-left: 15px;
        justify-content: flex-start;
        align-items: center;
        border-radius: 2px 2px 0px 0px;
        @include common_border();
        @include bg_color_1();
        .search-input {
            flex-grow: 1;
            height: 34px;
            padding-left: 6px;
            font-size: 12px;
            @include bg_color_1();
            [data-theme="0"] & {
                color: #000;
            }
            [data-theme="1"] & {
                color: $white-color;
            }
        }
        .search-icon {
            width: 12px;
            height: 12px;
        }
    }
    .tips-list {
        flex: 1;
        overflow-y: scroll;
        border-radius: 0px 0px 2px 2px;
        @include common_border();
        border-top: none;
        .tips-item {
            height: 34px;
            padding-left: 33px;
            display: flex;
            align-items: center;
            &:hover {
                background: rgba(0, 122, 255, 0.05);
            }
        }
    }
}
</style>
