<template>
    <div class="v-search-tips" v-click-outside.includeChildrens="closeTips">
        <div class="search-input-container">
            <img src="~assets/imgs/search_gray.png" class="search-icon" />
            <input type="text" class="search-input" v-model="userInput" />
        </div>
        <div class="tips-list" v-show="showTips">
            <div class="tips-item __pointer" v-for="item in searchRes" :key="item.id" @click="selected(item)">{{item.name}}</div>
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
            this.searchRes = this.filterMethod(val);
        }, 300)
    },
    methods: {
        closeTips() {
            this.isShowTips = false;
        },
        selected(v) {
            this.closeTips();
            this.$emit('selected', v);
            this.userInput = v.name;
        }
    }
};
</script>

<style lang="scss">
.v-serch-tips {
    color: #1D2024;
    font-size: 12px;
    max-height: 203px;
    min-height: 34px;
    .search-input-container {
        display: flex;
        padding-left: 12px;
        justify-content: flex-start;
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
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        .tips-item{
            height: 34px;
            &:hover{
                background: rgba(0,122,255,0.03);
            }
        }
    }
}
</style>
