<template>
    <div class="acc-list-wrapper">
        <div class="small-title">{{ $t('setting.setDefault') }}</div>
        <div class="acc-list __pointer">
            <div ref="listWrapper" class="list-wrapper">
                <div ref="list">
                    <div class="acc-item"
                         v-for="(addrObj, index) in addrList" :key="index"
                         @click="setDefault(addrObj.addr, index)" >
                        <span class="select" :class="{
                            'active': defaultAddr === addrObj.address
                        }"></span>
                        <div class="describe __ellipsis">
                            <div v-show="showNameInput !== index" class="bold">
                                {{ addrObj.name || `${$t('addrName', { index:index + 1 })}`  }}
                            </div>
                            <form class="name-input" autocomplete="off">
                                <input ref="nameInput" type="text" autocomplete="off"
                                       v-show="showNameInput === index"
                                       v-model="editName"
                                       :placeholder="index"
                                       @blur="rename(addrObj.address, index)"/>
                            </form>
                            <div class="__ellipsis">{{ addrObj.address }}</div>
                        </div>
                        <img @click.stop="startRename(addrObj.address, index)" class="icon __pointer" :class="{
                            'not-allowed': !isLogin&&currHDAcc.isBifrost
                        }" src="~assets/imgs/edit_default.svg"/>
                        <img @click.stop="copy(addrObj.address)" class="icon __pointer" src="~assets/imgs/copy_default.svg"/>
                    </div>
                </div>
            </div>

            <div v-show="isLogin && addrList.length < 10&&!currHDAcc.isBifrost" class="add" @click="addAddr">
                <span class="acc-add"></span><span class="describe bold">{{ $t('setting.addAddr') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import copy from 'utils/copy';
import { StatusMap } from 'wallet';

export default {
    data() {
        return {
            showNameInput: '',
            editName: ''
        };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        addrList() {
            return this.$store.state.wallet.addrList;
        },
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        }
    },
    watch: {
        addrList: function (val, oldVal) {
            if (val.length <= oldVal.length || val.length - oldVal.length > 1) {
                return;
            }

            Vue.nextTick(() => {
                if (!this.$refs.list || !this.$refs.listWrapper) {
                    return;
                }

                const height = this.$refs.list.offsetHeight;
                const wrapperHeight = this.$refs.listWrapper.offsetHeight;
                this.$refs.listWrapper.scrollTop = height - wrapperHeight;
            });
        }
    },
    methods: {
        copy(addr) {
            copy(addr);
            this.$toast(this.$t('hint.copy'));
        },
        addAddr() {
            this.$store.commit('currHDAccAddAddr');
        },
        setDefault(address, index) {
            if (!this.isLogin) {
                return;
            }
            this.$store.commit('switchActiveAcc', { address, index });
        },

        startRename(addr, index) {
            if (!this.isLogin) {
                return;
            }
            if (this.showNameInput === index) {
                return;
            }

            this.showNameInput = index;
            Vue.nextTick(() => {
                this.$onKeyDown(13, () => {
                    this.rename(addr, index);
                });
                this.$refs.nameInput[index].focus();
            });
        },
        rename(addr, index) {
            if (!this.editName) {
                this.clearEditName();
                return;
            }

            const editName = this.editName.trim();

            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(editName)) {
                this.$toast(this.$t('create.hint.name'));
                this.clearEditName();
                return;
            }

            const long = 26;
            if (editName.length > 26) {
                this.$toast(this.$t('create.hint.nameLong', { long }));
                this.clearEditName();
                return;
            }

            this.$store.commit('changeAddrName', {
                address: addr,
                index,
                name: this.editName
            });
            this.clearEditName();
        },
        clearEditName() {
            this.showNameInput = '';
            this.editName = '';
            this.$offKeyDown();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./setting.scss";

.acc-list {
    @include bg_color_1();
    [data-theme="0"] & {
        border: 1px solid #d4dee7;
    }
    border-radius: 2px;
    font-size: 12px;

    .list-wrapper {
        max-height: 190px;
        overflow: auto;
    }

    .bold {
        @include font-family-bold();
        font-weight: 600;
    }
    .normal {
        font-weight: 400;
    }

    .acc-item {
        line-height: 20px;
        position: relative;
        padding: 10px 15px;
        display: flex;
        align-items: center;
        @include common_border();
        &:last-child {
            border: none;
        }
        .icon {
            margin-left: 12px;
            &.not-allowed {
                cursor: not-allowed;
            }
        }
    }

    .add {
        padding: 0 15px;
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        color: $blue-color-1;
        @include common_border();

        .acc-add {
            display: inline-block;
            margin: 10px 10px 0 0;
            width: 16px;
            height: 16px;
            background: url('~assets/imgs/add_icon.svg') no-repeat center;
            background-size: 16px 16px;
        }

        .describe {
            display: inline;
            position: relative;
            bottom: 3px;
            color: $blue-color-1;
        }
    }

    .describe {
        display: block;
        width: 93%;
        @include font_color_2();
        .name-input {
            display: block;
            width: 100%;
            input {
                display: block;
                width: 100%;
            }
        }
    }

    .select {
        margin: 2px 10px 0 0;
        display: block;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        background: #fff;
        @include common_border();
        border-radius: 16px;

        &.active {
            background: url('~assets/imgs/presnet.svg') no-repeat center;
            background-size: 16px 16px;
        }
    }
}
</style>
