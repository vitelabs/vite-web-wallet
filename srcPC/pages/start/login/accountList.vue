<template>
    <div class="account-list-wrapper">
        <div class="list-wrapper">
            <account-item v-for="(account, i) in accountList" :key="i"
                          :clickAccount="clickAccount" :account="account">
            </account-item>
        </div>
    </div>
</template>

<script>
import ellipsisAddr from 'utils/ellipsisAddr.js';
import { getList } from 'wallet';
import accountItem from './accountItem.vue';

export default {
    components: { accountItem },
    props: {
        clickAccount: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.initAccountList();
    },
    data() {
        return { accountList: [] };
    },
    methods: {
        initAccountList() {
            const list = getList() || [];
            list.forEach(acc => {
                acc.showAddr = ellipsisAddr(acc.activeAddr);
            });
            this.accountList = list;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../start.scss";

.account-list-wrapper {
    position: absolute;
    z-index: 100;
    width: 100%;
    background: #fff;

    .list-wrapper {
        border-top: 1px solid #d4dee7;
        max-height: 180px;
        overflow: auto;
    }
}

.__btn_input_active {
    padding: 7px 15px;
    &:hover {
        background: rgba(88, 145, 255, 0.13);
    }
}
</style>
