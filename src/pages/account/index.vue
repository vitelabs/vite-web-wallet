<template>
    <div class="account-wrapper">
        <sync-block class="sync-block"></sync-block>
        <account-head></account-head>
        <div class="token-list"></div>
    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import accountHead from './head.vue';
// import bigNumber from 'utils/bigNumber.js';

// let inputTimeout = null;
// let fetchAccountTimeout = null;
// let lastFetchTime = null;

export default {
    components: {
        accountHead, syncBlock
    },
    // mounted() {
    //     this.fetchAccount(true);
    // },
    // data() {
    //     return {
    //         address: this.$route.params.address,
    //         accountName: '',
    //         balanceInfos: [],
    //         fundFloat: {},
    //         blockHeight: '0'
    //     };
    // },
    // destroyed() {
    //     window.clearTimeout(inputTimeout);
    //     inputTimeout = null;
    //     this.clearAccountTimeout();
    // },
    // methods: {
    //     formatAmountList(balanceList) {
    //         balanceList = balanceList || [];
    //         let list = [];
    //         balanceList.forEach(({ Balance, TokenSymbol })=>{
    //             list.push({
    //                 balance: bigNumber.amountToBasicString(Balance),
    //                 tokenSymbol: TokenSymbol
    //             });
    //         });
    //         return list;
    //     },
    //     clearAccountTimeout() {
    //         window.clearTimeout(fetchAccountTimeout);
    //         fetchAccountTimeout = null;
    //     },
    //     fetchAccount(isFirst) {
    //         // let reFetch = () => {
    //         //     fetchAccountTimeout = window.setTimeout(()=>{
    //         //         this.clearAccountTimeout();
    //         //         this.fetchAccount();
    //         //     }, viteWallet.Block.getLoopBlockTime());
    //         // };

    //         // let nowFetchTime = new Date().getTime();
    //         // lastFetchTime = nowFetchTime;

    //         // viteWallet.Account.get(this.address).then(({
    //         //     name, balanceInfos, fundFloat, blockHeight
    //         // }) => {
    //         //     if (lastFetchTime !== nowFetchTime) {
    //         //         return;
    //         //     }

    //         //     this.accountName = name;
    //         //     this.fundFloat = fundFloat || {};
    //         //     this.blockHeight = blockHeight;
    //         //     this.balanceInfos = balanceInfos ? this.formatAmountList(balanceInfos) : [];    // deal with balanceinfo
    //         //     this.fundFloat.balanceInfos = fundFloat.balanceInfos ? this.formatAmountList(fundFloat.balanceInfos) : [];    // deal with fundinfo
    //         //     reFetch();
    //         // }).catch((err) => {
    //         //     console.warn(err);
    //         //     isFirst && window.alert(this.$t('transList.valid.err'));
    //         //     reFetch();
    //         // });
    //     }
    // }
};
</script>

<style lang="scss" rel="stylesheet/scss">

.account-wrapper{
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .sync-block {
        width: 100%;
        padding: 40px 0;
        text-align: center;
    }
}
</style>
