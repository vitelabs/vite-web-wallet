<template>
    <div class="acc-list-wrapper">
        <div class="row">
            <span class="title">{{ $t('setting.addrList') }}</span>
            <div class="describe">{{ $t('setting.setDefault') }}</div>
        </div>
        <div class="acc-list __pointer">
            <div ref="listWrapper" class="list-wrapper">
                <div ref="list">
                    <div class="acc-item" v-for="(addr, index) in addrList" :key="index">
                        <span @click="setDefault(addr, index)" class="select" :class="{
                            'active': defaultAddr === addr
                        }"></span>
                        <span @click="setDefault(addr, index)" class="describe __ellipsis">{{(index + 1) + '. ' + addr}}</span>
                        <img @click="copy(addr)" class="copy __pointer" src="../../assets/imgs/copy_default.svg"/>
                    </div>
                </div>
            </div>

            <div v-show="isWalletAcc && addrList.length < 10" class="add" @click="addAddr">
                <span class="acc-add"></span><span class="describe">{{ $t('setting.addAddr') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import copy from 'utils/copy';

export default {
    data() {
        const activeAccount = this.$wallet.getActiveAccount();

        return {
            activeAccount,
            isWalletAcc: activeAccount.type === 'wallet',
            addrList: activeAccount.getAddrList(),
            defaultAddr: activeAccount.getDefaultAddr(),
            copyAddr: ''
        };
    },
    methods: {
        copy(addr) {
            copy(addr);
            this.$toast(this.$t('hint.copy'));
        },
        addAddr() {
            const addrList = this.activeAccount.getAddrList();
            if (addrList && addrList.length >= 10) {
                return;
            }

            this.activeAccount.addAddr();
            this.addrList = this.activeAccount.getAddrList();

            Vue.nextTick(() => {
                if (!this.$refs.list || !this.$refs.listWrapper) {
                    return;
                }

                const height = this.$refs.list.offsetHeight;
                const wrapperHeight = this.$refs.listWrapper.offsetHeight;
                this.$refs.listWrapper.scrollTop = height - wrapperHeight;
            });
        },
        setDefault(addr, index) {
            const res = this.activeAccount.setDefaultAddr(addr, index);
            if (!res) {
                this.$toast(this.$t('hint.err'));
                return;
            }
            this.defaultAddr = this.activeAccount.getDefaultAddr();

            // Clear all
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearTransList');
            this.$store.commit('commitClearPledge');
            this.$store.commit('clearDexBalance');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.row {
    width: 100%;
    margin-bottom: 10px;
    line-height: 20px;

    .title {
        font-size: 14px;
        color: #1d2024;
        letter-spacing: 0.35px;
        font-family: $font-bold, arial, sans-serif;
    }

    .describe {
        font-size: 12px;
        color: #5e6875;
        letter-spacing: 0.3px;
        line-height: 16px;
        margin-top: 8px;
    }
}

.acc-list {
    background: #fff;
    border: 1px solid #d4dee7;
    border-radius: 2px;

    .list-wrapper {
        max-height: 190px;
        overflow: auto;
    }

    .acc-item {
        line-height: 20px;
        position: relative;
        padding: 10px 15px;
        border-bottom: 1px solid #d4dee7;
        display: flex;

        &:last-child {
            border: none;
        }
    }

    .add {
        padding: 0 15px;
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        color: #007aff;
        border-top: 1px solid #d4dee7;

        .acc-add {
            display: inline-block;
            margin: 10px 10px 0 0;
            width: 16px;
            height: 16px;
            background: url('../../assets/imgs/add_icon.svg') no-repeat center;
            background-size: 16px 16px;
        }

        .describe {
            display: inline;
            position: relative;
            bottom: 3px;
            font-size: 12px;
            color: #007aff;
        }
    }

    .describe {
        display: block;
        width: 93%;
        font-size: 12px;
        color: #5e6875;
    }

    .select {
        margin: 2px 10px 0 0;
        display: block;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        background: #fff;
        border: 1px solid #d4dee7;
        border-radius: 16px;

        &.active {
            background: url('../../assets/imgs/presnet.svg') no-repeat center;
            background-size: 16px 16px;
        }
    }
}

@media only screen and (max-width: 500px) {
    .acc-list .list-wrapper {
        max-height: unset;
    }

    .acc-list .acc-item {
        padding: 10px;
    }

    .acc-list .add {
        padding: 0 10px;
    }
}
</style>
