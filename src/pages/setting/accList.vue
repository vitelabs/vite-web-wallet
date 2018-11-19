<template>
    <div class="acc-list-wrapper">
        <div class="row">
            <span class="title">{{ $t('accList.addr') }}</span>
            <span class="title meta">{{ $t('accList.addrList') }}</span>
            <span class="describe">{{ $t('accList.default') }}</span>
        </div>
        <div class="acc-list __pointer">
            <div ref="listWrapper" class="list-wrapper">
                <div ref="list">
                    <div class="acc-item" v-for="(addr, index) in addrList" :key="index">
                        <span @click="setDefault(addr)" class="select" :class="{
                            'active': defaultAddr === addr
                        }"></span>
                        <span @click="setDefault(addr)" class="describe __ellipsis">{{(index + 1) + '. ' + addr}}</span>
                        <img @click="copy(addr)" class="copy __pointer" src="../../assets/imgs/copy_default.svg"/>
                    </div>
                </div>
            </div>

            <div v-show="isWalletAcc && addrList.length < 10" class="add" @click="addAddr">
                <span class="acc-add"></span><span class="describe">{{ $t('accList.addAcc') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import copy from 'utils/copy';

export default {
    data() {
        let activeAccount = this.$wallet.getActiveAccount();

        return {
            activeAccount,
            isWalletAcc: activeAccount.isWalletAcc,
            addrList: activeAccount.getAddrList(),
            defaultAddr: activeAccount.getDefaultAddr(),
            copyAddr: ''
        };
    },
    methods: {
        copy(addr) {
            copy(addr);
            this.$toast(this.$t('accDetail.hint.copy'));
        },
        addAddr() {
            let addrList = this.activeAccount.getAddrList();
            if (addrList && addrList.length >= 10) {
                return;
            }

            this.activeAccount.addAddr();
            this.addrList = this.activeAccount.getAddrList();

            Vue.nextTick(()=>{
                if (!this.$refs.list || !this.$refs.listWrapper) {
                    return;
                }

                let height = this.$refs.list.offsetHeight;
                let wrapperHeight = this.$refs.listWrapper.offsetHeight;
                this.$refs.listWrapper.scrollTop = height - wrapperHeight;
            });
        },
        setDefault(addr) {
            let res = this.activeAccount.setDefaultAddr(addr);
            if (!res) {
                this.$toast(this.$t('hint.err'));
                return;
            }
            this.defaultAddr = this.activeAccount.getDefaultAddr();

            // clear all
            let activeAccount = this.$wallet.getActiveAccount();
            activeAccount && activeAccount.releasePWD();
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearTransList');
            this.$store.commit('commitClearPledge');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.row {
    width: 100%;
    margin-bottom: 16px;
    line-height: 22px;

    .title {
        font-size: 14px;
        color: #1D2024;
        letter-spacing: 0.35px;
        font-family: $font-bold, arial, sans-serif;
        &.meta {
            display: none;
        }
    }
    .describe {
        float: right;
        font-size: 12px;
        color: #5E6875;
        letter-spacing: 0.3px;
    }
}
.acc-list {
    background: #FFFFFF;
    border: 1px solid #D4DEE7;
    border-radius: 2px;
    .list-wrapper {
        max-height: 190px;
        overflow: auto;
    }
    .acc-item {
        line-height: 20px;
        position: relative;
        padding: 10px 15px;
        border-bottom: 1px solid #D4DEE7;
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
        color: #007AFF;
        border-top: 1px solid #D4DEE7;
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
            color: #007AFF;
        }
    }

    .describe {
        display: block;
        width: 93%;
        font-size: 12px;
        color: #5E6875;
    }
    .select {
        margin: 2px 10px 0 0;
        display: block;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        background: #FFFFFF;
        border: 1px solid #D4DEE7;
        border-radius: 16px;
        &.active {
            background: url('../../assets/imgs/presnet.svg') no-repeat center;
            background-size: 16px 16px;
        }
    }
}

@media only screen and (max-width: 500px) {
    .row .title {
        display: none;
        &.meta {
            display: inline;
        }
    }
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
