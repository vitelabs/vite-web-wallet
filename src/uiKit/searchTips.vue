<template>
    <div class="v-search-tips" v-click-outside.includeChildrens="closeTips">
        <div class="search-input-container">
            <img src="~assets/imgs/search_gray.png" class="search-icon" />
            <input type="text" class="search-input" v-model="userInput" />
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
import throttle from "lodash/throttle";

export default {
    props: {
        filterMethod: {
            type: Function,
            default: () => []
        }
    },
    data() {
        return { userInput: "", searchRes: [], isShowTips: false };
    },
    watch: {
        userInput: throttle(function(val) {
            this.searchRes = this.filterMethod(val);
            if (this.searchRes.length > 0) {
                this.isShowTips = true;
            }
        }, 300)
    },
    methods: {
        closeTips() {
            this.isShowTips = false;
        },
        selected(v) {
            this.closeTips();
            this.$emit("selected", v);
            this.userInput = v.name;
        }
    }
};
</script>

<style lang="scss">
@import "~assets/scss/vars.scss";

.v-search-tips {
    color: #1d2024;
    font-size: 12px;
    max-height: 203px;
    min-height: 34px;
    display:flex;
    flex-direction: column;
    @include font-family-bold();
    .search-input-container {
        display: flex;
        padding-left: 15px;
        justify-content: flex-start;
        align-items: center;
        border-radius: 2px 2px 0px 0px;
        border: 1px solid rgba(212, 222, 231, 1);

        .search-input {
            flex-grow: 1;
            height: 34px;
            padding-left: 6px;
            font-size: 12px;
        }
        .search-icon {
            width: 12px;
            height: 12px;
        }
    }
    .tips-list {
        flex:1;
        overflow-y: scroll;
        border-radius: 0px 0px 2px 2px;
        border: 1px solid rgba(212, 222, 231, 1);
        border-top: none;
        .tips-item {
            height: 34px;
            padding-left: 33px;
            display: flex;
            align-items: center;
            &:hover {
                background: rgba(0, 122, 255, 0.03);
            }
        }
    }
}
</style>
