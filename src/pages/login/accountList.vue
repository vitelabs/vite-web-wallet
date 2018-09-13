<template>
    <div class="account-list-wrapper">
        <div class="list-wrapper">
            <div class="__btn_input_active" 
                 v-for="(account, i) in accountList" :key="i" 
                 @click="clickAccount(account)">
                <div class="name">{{account.name}}</div>
                <div class="address __ellipsis">{{account.showAddr}}</div>
            </div>
        </div>

        <router-link class="__btn add-acc" 
                     :to="{ name: 'createAccount', params: { from: 'login' } }"> 
            <img class="icon" src="../../assets/imgs/add_icon.svg"/>{{ $t('accList.addAcc') }}
        </router-link>
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
        let list = viteWallet.Wallet.getList() || [];
        list.forEach(acc => {
            acc.showAddr = ellipsisAddr(acc.addr);
        });
        return {
            accountList: list
        };
    }
};
</script>

<style lang="scss" scoped>
.account-list-wrapper {
    position: absolute;
    z-index: 100;
    width: 100%;
    .list-wrapper {
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
        border-top: none;
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
}
.__btn_input_active:hover {
    background: #efefef;
}
</style>
