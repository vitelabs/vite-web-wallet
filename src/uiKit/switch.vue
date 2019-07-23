<template>
    <div
        v-click-outside="hideList"
        @click="toggleList"
        class="switch-wrapper __pointer"
    >
        <span
            class="list-title"
            :class="{
                down: !isShowList,
                up: isShowList,
                'not-allowed': notAllowed
            }"
        >{{ selected.name }}</span>

        <ul
            class="list"
            v-show="isShowList"
        >
            <li
                v-for="item in optList"
                :key="item.value"
                v-show="selected !== value"
                @click="select(item)"
                class="item"
            >
                <div class="name">
                    {{ item.name }}
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        optList: {
            type: Array,
            default: () => []
        },
        value: {
            type: String,
            default: ''
        },
        notAllowed: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return { isShowList: false, selected: this.optList.find(i => i.value === this.value) };
    },
    watch: {
        value: function (value) {
            this.selected = this.optList.find(i => i.value === value);
        }
    },
    methods: {
        toggleList() {
            if (this.notAllowed) {
                return;
            }
            this.isShowList = !this.isShowList;
        },
        hideList() {
            this.isShowList = false;
        },
        select(v) {
            this.selected = v;
            this.$emit('input', v.value);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.switch-wrapper {
    color: #73767a;
    @include font-family-bold();
    font-size: 14px;
    position: relative;
    border: 1px solid rgba(212, 222, 231, 1);
    user-select: none;
    .list-title {
        position: relative;
        box-sizing: border-box;
        border-radius: 2px;
        padding: 0 8px;
        display: flex;
        align-items: center;
        &:after {
            content: "";
            width: 16px;
            height: 16px;
            background: url("~assets/imgs/uiKit/select/down.svg");
            background-size: 16px 16px;
        }
        &.not-allowed {
            &:after {
                display: none;
            }
        }
        &.down {
            &:after {
                transform: rotateX(0deg);
            }
        }
        &.up {
            &:after {
                transform: rotateX(180deg);
            }
        }
    }
    .list {
        position: absolute;
        z-index: 100;
        max-height: 220px;
        overflow: auto;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 5px 10px 0px rgba(176, 192, 237, 0.69);
        margin-top: 10px;
        word-break: break-all;
        font-size: 12px;
        @include font-family-bold();
        color: #73767a;
        .item {
            box-sizing: border-box;
            padding: 8px 12px;
            line-height: 16px;
            &:hover {
                background: rgba(75, 116, 255, 0.1);
            }
        }
    }
}
</style>
