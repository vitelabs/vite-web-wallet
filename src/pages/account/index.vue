<template>
    <div class="account-wrapper">
        <sync-block class="sync-block item"></sync-block>
        <account-head class="item"></account-head>
        <div class="token-list item">  <tokenCard></tokenCard> <tokenCard class="mg-left"></tokenCard></div>
    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import accountHead from './head.vue';
import tokenCard from './tokenCard';
// import bigNumber from 'utils/bigNumber.js';

let fetchAccountTimeout = null;
let lastFetchTime = null;
// const acc=viteWallet.Wallet.account
export default {
    data(){
        return {
            tokenInfo: Object.create(null)
        };
    },
    components: {
        accountHead, syncBlock,tokenCard
    },
    // beforeMount(){
    // acc.getAccountByAccAddr()
    // acc.getUnconfirmedInfo()
    // },
    // methods:{
    //     updateBalance({balanceInfo,unconfirmedInfo}){
    //         if(balanceInfo){
    //             balanceInfo.forEach(v=>{
    //                if(this.tokenInfo[v.mintage.id]){
    //                    this.tokenInfo[v.mintage.id].accBalance=v.balance
    //                }else{
    //                    this.tokenInfo[v.mintage.id]={
    //                     tokenName: "--",
    //                     accBalance: v.balance,
    //                     unConfirmedBalance:"--",
    //                     unConfirmedNums: "--",
    //                    }
    //                }
    //             })
    //         }
    //         if(unconfirmedInfo){
    //              balanceInfo.forEach(v=>{
    //                if(this.tokenInfo[v.mintage.id]){

    //                }else{

    //                }
    //             })
    //         }
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
    overflow: auto;
    padding:0 40px;
    .sync-block {
        width: 100%;
        text-align: center;
    }
}

.item{
    margin-top:40px;
    &.token-list{
        display: flex;
        >.mg-left{
            margin-left: 40px;
        }
    }
}
</style>
