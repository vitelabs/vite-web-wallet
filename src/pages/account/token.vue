<template>
    <div class="account-detail">
        <div class="row">
            <div class="row-title">{{ $t('accDetail.balance') }}</div>

            <span class="__balance" v-show="!balanceInfos.length">0</span>
            <div v-show="balanceInfos.length" v-for="(balanceInfo, i) in balanceInfos" :key="i">
                <span class="__balance">{{ balanceInfo.balance || 0 }}</span>
                <span class="__symbol">{{ balanceInfo.tokenSymbol }}</span>
            </div>
        </div>
        <div class="row">
            <div class="row-title">
                {{ $t('accDetail.fundFloat') }}
                <span class="row-content">（{{ fundFloat.len || 0 }} {{$t('accDetail.pend')}})</span>
            </div>

            <span v-show="!fundFloat.balanceInfos || !fundFloat.balanceInfos.length"
                  class="__balance" >0</span>
            <div v-for="(balanceInfo, i) in fundFloat.balanceInfos" :key="i">
                <span class="__balance">{{ balanceInfo.balance || 0 }}</span>
                <span class="__symbol">{{ balanceInfo.tokenSymbol }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import bigNumber from 'utils/bigNumber.js';

let inputTimeout = null;
let fetchAccountTimeout = null;
let lastFetchTime = null;

export default {
    data() {
        return {
            address: this.$route.params.address,
            accountName: '',
            balanceInfos: [],
            fundFloat: {},
            blockHeight: '0'
        };
    },
    created(){
        console.log('pppppppp')
        window.w=viteWallet
    },
    destroyed() {
        window.clearTimeout(inputTimeout);
        inputTimeout = null;
        this.clearAccountTimeout();
    },
    methods: {
        formatAmountList(balanceList) {
            balanceList = balanceList || [];
            let list = [];
            balanceList.forEach(({ Balance, TokenSymbol })=>{
                list.push({
                    balance: bigNumber.amountToBasicString(Balance),
                    tokenSymbol: TokenSymbol
                });
            });
            return list;
        },
        clearAccountTimeout() {
            window.clearTimeout(fetchAccountTimeout);
            fetchAccountTimeout = null;
        },
        fetchAccount(isFirst) {
            let reFetch = () => {
                fetchAccountTimeout = window.setTimeout(()=>{
                    this.clearAccountTimeout();
                    this.fetchAccount();
                }, viteWallet.Block.getLoopBlockTime());
            };

            let nowFetchTime = new Date().getTime();
            lastFetchTime = nowFetchTime;

            viteWallet.Account.get(this.address).then(({
                name, balanceInfos, fundFloat, blockHeight
            }) => {
                if (lastFetchTime !== nowFetchTime) {
                    return;
                }

                this.accountName = name;
                this.fundFloat = fundFloat || {};
                this.blockHeight = blockHeight;
                this.balanceInfos = balanceInfos ? this.formatAmountList(balanceInfos) : [];    // deal with balanceinfo
                this.fundFloat.balanceInfos = fundFloat.balanceInfos ? this.formatAmountList(fundFloat.balanceInfos) : [];    // deal with fundinfo
                reFetch();
            }).catch((err) => {
                console.warn(err);
                isFirst && window.alert(this.$t('transList.valid.err'));
                reFetch();
            });
        }
    }
};
</script>
<style lang='scss'>

</style>
