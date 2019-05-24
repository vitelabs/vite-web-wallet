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
        >{{ showStr }}</span
        >

        <ul class="list" v-show="isShowList">
            <li
                v-for="item in optList"
                :key="item.value"
                v-show="selectedValue !== value"
                @click.stop="select(item.value)"
                class="item"
            >
                <div class="name">
                    {{ item.name }}
                </div>
                <div>{{ addrObj.addr }}</div>
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
        }
    },
    data() {
        return { isShowList: false, selectedValue: this.value };
    },
    watch: {
        value: function (value) {
            this.selectedValue = value;
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
            this.selectedValue = v;
            this.$emit('input', v);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.switch-wrapper {
    width: 100%;
    color: #73767a;
    font-family: $font-bold, arial, sans-serif;
    font-weight: 600;
    font-size: 14px;

    .list-title {
        position: relative;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid rgba(212, 222, 231, 1);
        padding: 0 8px;

        &:after {
            content: "";
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-bottom: -2px;
            background: url("~assets/imgs/addr_switch.svg");
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
        width: 250px;
        max-height: 220px;
        overflow: auto;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 5px 10px 0px rgba(176, 192, 237, 0.69);
        margin-top: 10px;
        word-break: break-all;
        .item {
            box-sizing: border-box;
            padding: 8px 12px;
            line-height: 16px;
            &:hover {
                background: rgba(75, 116, 255, 0.1);
            }
            .name {
                font-size: 12px;
                font-family: $font-bold, arial, sans-serif;
                font-weight: 600;
                color: rgba(115, 118, 122, 1);
            }
            .switch-address {
                font-size: 11px;
                font-family: $font-normal, arial, sans-serif;
                font-weight: 400;
                color: rgba(162, 167, 175, 1);
            }
        }
    }
}
</style>
