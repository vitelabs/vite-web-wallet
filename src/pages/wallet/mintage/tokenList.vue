<template>
    <div class="list-wrapper">
        <div class="__second-title">{{ $t('walletMintage.tokenList') }}</div>

        <wallet-table class="mintage-table" :headList="[{
            class: 'big-item __ellipsis',
            text: 'Token ID',
            cell: 'tokenId'
        },{
            class: 'big-item __ellipsis',
            text: $t('walletMintage.tokenName'),
            cell: 'tokenName'
        },{
            class: 'big-item __ellipsis',
            text: $t('walletMintage.tokenSymbol'),
            cell: 'tokenSymbol'
        },{
            class: 'big-item __ellipsis',
            text: $t('walletMintage.totalSupply'),
            cell: 'totalSupply'
        },{
            class: 'small-item __ellipsis',
            text: $t('walletMintage.decimals'),
            cell: 'decimals'
        },{
            class: 'small-item __ellipsis',
            text: $t('walletMintage.isReIssuable'),
            cell: 'isReIssuable'
        },{
            class: 'big-item __ellipsis',
            text: $t('walletMintage.maxSupply'),
            cell: 'maxSupply'
        },{
            class: 'small-item __ellipsis',
            text: $t('walletMintage.ownerBurnOnly'),
            cell: 'ownerBurnOnly'
        },{
            class: 'small-item __ellipsis',
            text: $t('tradeAssets.operate'),
            cell: 'operate'
        }]" :contentList="tokenList">

            <span v-for="(item, i) in tokenList" :key="i"
                  :slot="`${i}operateBefore`">
                <span class="btn __pointer" v-unlock-account @unlocked="changeOwner(item)">转让所有权</span>
                <span v-if="item.isReIssuable" class="btn __pointer"
                      v-unlock-account @unlocked="changeReIssuable(item)">改为不可增发</span>
            </span>

        </wallet-table>

        <show-confirm v-if="changeOwnerToken"
                      :title="$t('walletMintage.changeOwnerConfirm.title')" :showMask="true"
                      :leftBtnTxt="$t('walletMintage.cancel')" :leftBtnClick="cancelChangeOwner"
                      :rightBtnTxt="$t('walletMintage.submit')" :rightBtnClick="toChangeOwner">
            <div class="__row">
                <div class="__row-t">{{ $t('walletMintage.tokenName') }}</div>
                <div class="__unuse-row __light">{{ changeOwnerToken.tokenName }}</div>
            </div>
            <div class="__row">
                <div class="__row-t">{{ $t('walletMintage.address') }}</div>
                <div class="__unuse-row __light">{{ changeOwnerToken.owner }}</div>
            </div>
            <div class="__row">
                <div class="__row-t">
                    {{ $t('walletMintage.changeOwnerConfirm.address') }}
                    <span v-show="!isValidAddress" class="__err __hint">{{ $t('hint.addrFormat') }}</span>
                </div>
                <vite-input v-model="newOwner" :valid="validAddr"
                            :placeholder="$t('wallet.placeholder.addr')"></vite-input>
            </div>

        </show-confirm>
    </div>
</template>

<script>
import { hdAddr } from '@vite/vitejs';
import confirm from 'components/confirm/index.js';
import showConfirm from 'components/confirm';
import walletTable from 'components/table/index.vue';
import viteInput from 'components/viteInput';
import sendTx from 'utils/sendTx';

export default {
    components: { walletTable, showConfirm, viteInput },
    created() {
        this.getOwnerToken();
    },
    data() {
        return {
            tokenList: [],
            changeOwnerToken: null,
            newOwner: '',
            isValidAddress: true
        };
    },
    methods: {
        validAddr() {
            this.isValidAddress = this.newOwner && hdAddr.isValidHexAddr(this.newOwner);
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
        },
        changeReIssuable(item) {
            confirm({
                title: this.$t('walletMintage.reIssuableConfirm.title'),
                closeBtn: { show: true },
                leftBtn: { text: this.$t('walletMintage.cancel') },
                rightBtn: {
                    text: this.$t('walletMintage.submit'),
                    click: () => {
                        this.toChangeReIssuale(item);
                    }
                },
                content: this.$t('walletMintage.reIssuableConfirm.text', { tokenName: item.tokenName })
            });
        },
        changeOwner(item) {
            this.changeOwnerToken = item;
        },
        cancelChangeOwner() {
            this.changeOwnerToken = null;
            this.newOwner = '';
        },

        toChangeOwner() {
            if (!this.changeOwnerToken) {
                return;
            }

            sendTx('changeTransferOwner', {
                tokenId: this.changeOwnerToken.tokenId,
                newOwner: this.newOwner
            }).then(() => {
                this.$toast('changeOwner success');
                this.cancelChangeOwner();
            }).catch(err => {
                console.warn(err);
                this.$toast('changeOwner fail.', err);
            });
        },
        toChangeReIssuale(item) {
            sendTx('changeTokenType', { tokenId: item.tokenId }).then(() => {
                this.$toast('ChangeTokenType success');
            }).catch(err => {
                console.warn(err);
                this.$toast('ChangeTokenType fail.', err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/confirmInput.scss";

.mintage-table {
    margin-top: 14px;
}
</style>
