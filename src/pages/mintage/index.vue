<template>
    <page-layout>
        <div class="mintage-wrapper">
            <div class="order-row-title">decimals</div>
            <vite-input v-model="decimals"></vite-input>

            <div class="order-row-title">isReIssuable</div>
            <div class="select-icon-wrapper __pointer" @click="toogleIsReIssuable(true)">
                <span class="select-icon" :class="{
                    active: isReIssuable
                }"></span>true
            </div>
            <div class="select-icon-wrapper __pointer" @click="toogleIsReIssuable(false)">
                <span class="select-icon" :class="{
                    active: !isReIssuable
                }"></span>false
            </div>

            <div class="order-row-title">maxSupply</div>
            <vite-input v-model="maxSupply"></vite-input>

            <div class="order-row-title">ownerBurnOnly</div>
            <div class="select-icon-wrapper __pointer" @click="toogleOwnerBurnOnly(true)">
                <span class="select-icon" :class="{
                    active: ownerBurnOnly
                }"></span>true
            </div>
            <div class="select-icon-wrapper __pointer" @click="toogleOwnerBurnOnly(false)">
                <span class="select-icon" :class="{
                    active: !ownerBurnOnly
                }"></span>false
            </div>

            <div class="order-row-title">totalSupply</div>
            <vite-input v-model="totalSupply"></vite-input>

            <div class="order-row-title">tokenName</div>
            <vite-input v-model="tokenName"></vite-input>

            <div class="order-row-title">tokenSymbol</div>
            <vite-input v-model="tokenSymbol"></vite-input>

            <div class="__btn_all_in btn" :class="{
                'unuse': !canMintage
            }" @click="mintage">mintage</div>

            <div class="__btn_all_in btn" @click="getOwnerToken">Get owner token list</div>

            <div class="list-wrapper">
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
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'components/pageLayout/index';
import viteInput from 'components/viteInput';
import walletTable from 'components/table/index.vue';
import sendTx from 'utils/sendTx';
// import { abi, utils } from '@vite/vitejs';

// abi.decodeParameters({ 'type': 'function', 'name': 'Mint', 'inputs': [ { 'name': 'isReIssuable', 'type': 'bool' }, { 'name': 'tokenName', 'type': 'string' }, { 'name': 'tokenSymbol', 'type': 'string' }, { 'name': 'totalSupply', 'type': 'uint256' }, { 'name': 'decimals', 'type': 'uint8' }, { 'name': 'maxSupply', 'type': 'uint256' }, { 'name': 'ownerBurnOnly', 'type': 'bool' } ] },
//     utils._Buffer.from('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjhvJvwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI4byb8EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtjc3Rlc3R0b2tlbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQ1NUVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=', 'base64').toString('hex'));

export default {
    components: { viteInput, walletTable, pageLayout },
    created() {
        this.getOwnerToken();
    },
    data() {
        return {
            decimals: '0',
            isReIssuable: false,
            maxSupply: '0',
            ownerBurnOnly: true,
            totalSupply: '',
            tokenName: '',
            tokenSymbol: '',
            tokenList: []
        };
    },
    computed: {
        canMintage() {
            return this.decimals && this.maxSupply && this.totalSupply && this.tokenName && this.tokenSymbol;
        }
    },
    methods: {
        toogleIsReIssuable(isReIssuable) {
            this.isReIssuable = isReIssuable;
        },
        toogleOwnerBurnOnly(ownerBurnOnly) {
            this.ownerBurnOnly = ownerBurnOnly;
        },
        mintage() {
            sendTx({methodName:'mintage', data:{
                decimals: this.decimals,
                isReIssuable: this.isReIssuable,
                maxSupply: this.maxSupply,
                ownerBurnOnly: this.ownerBurnOnly,
                totalSupply: this.totalSupply,
                tokenName: this.tokenName,
                tokenSymbol: this.tokenSymbol
            }}).then(() => {
                this.$toast('Mintage success');
            }).catch(err => {
                this.$toast(`Mintage fail. ${ err.error.message || err.error.msg }`, err);
            });
        },
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
@import "~assets/scss/vars.scss";

.mintage-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: auto;

    .list-wrapper {
        margin-top: 20px;
    }

    .order-row-title {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        @include font-family-normal();
        font-weight: 400;
        color: #333;
        margin-top: 5px;
    }

    .btn {
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 20px;
        text-align: center;

        &.unuse {
            background: #efefef;
            color: #666;
        }
    }

    .select-icon-wrapper {
        font-size: 11px;
        @include font-family-normal();
        font-weight: 400;
        color: rgba(94, 104, 117, 1);
        margin-left: 12px;

        .select-icon {
            position: relative;
            display: inline-block;
            box-sizing: border-box;
            width: 12px;
            height: 12px;
            border-radius: 10px;
            border: 1px solid rgba(188, 196, 201, 1);
            margin-right: 4px;
            margin-bottom: -2px;

            &.active {
                &::after {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -2px;
                    margin-left: -2px;
                    content: ' ';
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    background: #007aff;
                    border-radius: 5px;
                }
            }
        }
    }
}
</style>
