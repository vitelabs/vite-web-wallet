<template>
    <div class="account-list-wrapper">
        <div class="list-wrapper">
            <div class="__btn_input_active" 
                 v-for="(account, i) in accountList" :key="i" 
                 @click="clickAccount(account)">
                <div class="name">{{ account.name }}</div>
                <div class="address __ellipsis">{{ account.showAddr }}</div>
            </div>
        </div>

        <span class="__btn add-acc" @click="addAcc"> 
            <img class="icon" src="../../assets/imgs/add_icon.svg"/>{{ $t('addAccount') }}
        </span>
    </div>
</template>

<script>
import ellipsisAddr from 'utils/ellipsisAddr.js';

export default {
    props: {
        clickAccount: {
            type: Function,
            default: ()=>{}
        }
    },
    data() {
        let list = this.$wallet.getList() || [];
        list.forEach(acc => {
            acc.showAddr = ellipsisAddr(acc.addr);
        });
        return {
            accountList: list
        };
    },
    methods: {
        addAcc() {
            this.$wallet.clearActiveAccount();
            this.$router.push({
                name: 'startCreate'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.account-list-wrapper {
    position: absolute;
    z-index: 100;
    width: 100%;
    background: #fff;
    .list-wrapper {
        border-top: 1px solid #D4DEE7;
        max-height: 180px;
        overflow: auto;
    }
    .add-acc {
        display: block;
        box-sizing: border-box;
        padding: 0 20px;
        width: 100%;
        height: 60px;
        line-height: 60px;
        text-align: left;
        background: #fff;
        border: 1px solid #D4DEE7;
        font-size: 16px;
        color: #007AFF;
        .icon {
            width: 20px;
            height: 20px;
            margin-bottom: -4px;
            margin-right: 12px;
        }
    }
}

.__btn_input_active {
    padding: 7px 15px;
    border-top: none;
    &:last-child {
        border-bottom: none;
    }
}
.__btn_input_active:hover {
    background: rgba(88,145,255,.13);
}
</style>
