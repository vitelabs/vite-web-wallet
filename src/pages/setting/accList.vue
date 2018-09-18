<template>
    <div class="acc-list-wrapper">
        <div class="row">
            <span class="title">{{$t('accList.addr')}}</span>
            <span class="describe">{{$t('accList.default')}}</span>
        </div>
        <div class="acc-list __pointer">
            <div ref="listWrapper" class="list-wrapper">
                <div ref="list">
                    <div class="acc-item" v-for="(item, index) in addrList" :key="index">
                        <span class="describe">{{(index+1) + '. ' + item.addr}}</span>
                        <span class="select" :class="{
                            'active': defaultAddr === item.addr
                        }" @click="setDefault(item)"></span>
                    </div>
                </div>
            </div>

            <div v-show="isWalletAcc" class="add" @click="addAddr">
                <span class="acc-add"></span><span class="describe">{{$t('accList.addAcc')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    data() {
        let acc = viteWallet.Wallet.getAccInstance(this.$route.params);

        return {
            acc,
            isWalletAcc: acc.isWalletAcc,
            addrList: acc.getAddrList(),
            defaultAddr: acc.getDefaultAddr()
        };
    },
    methods: {
        addAddr() {
            let addrList = this.acc.getAddrList();
            if (addrList && addrList.length >= 10) {
                return;
            }

            this.acc.addAddr();
            this.addrList = this.acc.getAddrList();

            Vue.nextTick(()=>{
                if (!this.$refs.list || !this.$refs.listWrapper) {
                    return;
                }

                let height = this.$refs.list.offsetHeight;
                let wrapperHeight = this.$refs.listWrapper.offsetHeight;
                this.$refs.listWrapper.scrollTop = height - wrapperHeight;
            });
        },
        setDefault({
            path
        }) {
            this.acc.setDefault(path);
            this.defaultAddr = this.acc.getDefaultAddr();
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
        font-family: $font-bold;
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
        padding: 10px 15px;
        border-bottom: 1px solid #D4DEE7;
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
            position: relative;
            bottom: 3px;
            font-size: 12px;
            color: #007AFF;
        }
    }

    .describe {
        font-size: 12px;
        color: #5E6875;
    }
    .select {
        display: block;
        box-sizing: border-box;
        float: right;
        margin-top: 4px; 
        width: 16px;
        height: 16px;
        background: #FFFFFF;
        background: #FFFFFF;
        border: 1px solid #D4DEE7;
        border-radius: 16px;
        &.active {
            background: url('../../assets/imgs/presnet.svg') no-repeat center;
            background-size: 16px 16px;
        }
    }
}
</style>
