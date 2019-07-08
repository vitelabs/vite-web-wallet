<template>
    <div class="list-wrapper">
        <div class="__second-title">{{ $t('walletMintage.tokenList') }}</div>

        <wallet-table class="mintage-table" :headList="[{
            class: '__ellipsis',
            text: 'Token ID',
            cell: 'tokenId'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.tokenName'),
            cell: 'tokenName'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.tokenSymbol'),
            cell: 'tokenSymbol'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.totalSupply'),
            cell: 'totalSupply'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.decimals'),
            cell: 'decimals'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.isReIssuable'),
            cell: 'isReIssuable'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.maxSupply'),
            cell: 'maxSupply'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.isOwnerBurnOnly'),
            cell: 'ownerBurnOnly'
        },{
            class: '__ellipsis',
            text: $t('tradeAssets.operate'),
            cell: 'operate'
        }]" :contentList="showTokenList">

            <span v-for="(item, i) in showTokenList" :key="i"
                  :slot="`${i}operateBefore`">

                <span v-show="!item.isReIssuable" class="unuse btn">
                    {{ $t('walletMintage.changeOwnerConfirm.title') }}</span>
                <span v-show="!item.isReIssuable" class="unuse btn">
                    {{ $t('walletMintage.reIssuableConfirm.title') }}</span>
                <span v-show="item.isReIssuable" class="btn __pointer"
                      v-unlock-account @unlocked="changeOwner(item)">
                    {{ $t('walletMintage.changeOwnerConfirm.title') }}</span>
                <span v-show="item.isReIssuable" class="btn __pointer"
                      v-unlock-account @unlocked="changeReIssuable(item)">
                    {{ $t('walletMintage.reIssuableConfirm.title') }}</span>
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
                <div class="__row-t">{{ $t('walletMintage.tokenSymbol') }}</div>
                <div class="__unuse-row __light">{{ changeOwnerToken.tokenSymbol }}</div>
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
import showConfirm from 'components/confirm';
import walletTable from 'components/table/index.vue';
import { initPwd } from 'components/password/index.js';
import viteInput from 'components/viteInput';
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';

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
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        showTokenList() {
            const list = [];
            this.tokenList.forEach(item => {
                item.totalSupply = BigNumber.toBasic(item.totalSupply, item.decimals);
                item.maxSupply = item.isReIssuable ? BigNumber.toBasic(item.maxSupply, item.decimals) : '--';
                item.ownerBurnOnly = item.isReIssuable ? item.ownerBurnOnly : '--';
                list.push(item);
            });
            return list;
        }
    },
    watch: {
        address() {
            this.getOwnerToken();
        }
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
            if (!item.isReIssuable) {
                return;
            }

            initPwd({
                title: this.$t('walletMintage.reIssuableConfirm.title'),
                content: this.$t('walletMintage.reIssuableConfirm.text', { tokenName: item.tokenName }),
                submit: () => {
                    this.toChangeReIssuale(item);
                }
            }, true);
        },
        changeOwner(item) {
            if (!item.isReIssuable) {
                return;
            }
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

            initPwd({
                submit: () => {
                    sendTx('changeTransferOwner', {
                        tokenId: this.changeOwnerToken.tokenId,
                        newOwner: this.newOwner
                    }).then(() => {
                        this.$toast(this.$t('walletMintage.success'));
                        this.cancelChangeOwner();
                        this.getOwnerToken();
                    }).catch(err => {
                        console.warn(err);
                        this.$toast(this.$t('walletMintage.fail'), err);
                    });
                }
            });
        },
        toChangeReIssuale(item) {
            sendTx('changeTokenType', { tokenId: item.tokenId }).then(() => {
                this.$toast(this.$t('walletMintage.success'));
                this.getOwnerToken();
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('walletMintage.fail'), err);
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
.btn {
    color: #007AFF;
    &.unuse {
        color: #ced1d5;
    }
}
</style>
