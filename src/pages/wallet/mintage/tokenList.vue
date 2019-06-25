<template>
    <div class="list-wrapper">
        <div class="__btn_all_in btn" @click="getOwnerToken">Get owner token list</div>

        <wallet-table class="mintage-table" :headList="[{
            class: 'big-item __ellipsis',
            text: 'tokenId',
            cell: 'tokenId'
        },{
            class: 'small-item __ellipsis',
            text: 'decimals',
            cell: 'decimals'
        },{
            class: 'small-item __ellipsis',
            text: 'isReIssuable',
            cell: 'isReIssuable'
        },{
            class: 'big-item __ellipsis',
            text: 'maxSupply',
            cell: 'maxSupply'
        },{
            class: 'small-item __ellipsis',
            text: 'ownerBurnOnly',
            cell: 'ownerBurnOnly'
        },{
            class: 'big-item __ellipsis',
            text: 'totalSupply',
            cell: 'totalSupply'
        },{
            class: 'big-item __ellipsis',
            text: 'tokenName',
            cell: 'tokenName'
        },{
            class: 'big-item __ellipsis',
            text: 'tokenSymbol',
            cell: 'tokenSymbol'
        }]" :contentList="tokenList"></wallet-table>
    </div>
</template>

<script>
import walletTable from 'components/table/index.vue';

export default {
    components: { walletTable },
    data() {
        return { tokenList: [] };
    },
    methods: {
        getOwnerToken() {
            const activeAccount = this.$store.state.wallet.activeAcc;
            if (!activeAccount) {
                return;
            }

            activeAccount.getTokenInfoListByOwner().then(data => {
                this.tokenList = data;
            }).catch(err => {
                console.warn(err);
                this.$toast('Get list failed');
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.btn {
    width: 600px;
    height: 40px;
    line-height: 40px;
    margin: 20px 0;
    text-align: center;
}
</style>
