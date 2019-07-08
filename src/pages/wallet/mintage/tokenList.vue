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
            text: $t('walletMintage.totalSupply'),
            cell: 'showTotalSupply'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.decimals'),
            cell: 'decimals'
        },{
            class: '__ellipsis',
            text: $t('walletMintage.isReIssuable'),
            cell: 'isReIssuable'
        },{
            text: $t('walletMintage.maxSupply'),
            cell: 'showMaxSupply'
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
                  :slot="`${i}showTotalSupplyAfter`">
                <i v-if="item.isTotalOver" @click.self.stop="showTotal(i)" class="tipsicon __pointer">
                    <tooltips v-show="showTotalTips === i" v-click-outside="hideTotal"
                              :content="item.totalSupply"></tooltips>
                </i>
            </span>

            <span v-for="(item, i) in showTokenList" :key="i"
                  :slot="`${i}showMaxSupplyAfter`">
                <i v-if="item.isMaxOver" @click.self.stop="showMax(i)" class="tipsicon __pointer">
                    <tooltips v-show="showMaxTips === i" v-click-outside="hideMax"
                              :content="item.maxSupply"></tooltips>
                </i>
            </span>

            <span v-for="(item, i) in showTokenList" :key="i"
                  :slot="`${i}operateBefore`">
                <span v-show="!item.isReIssuable">--</span>
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
import tooltips from 'components/tooltips';
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';

export default {
    components: { walletTable, showConfirm, viteInput, tooltips },
    created() {
        this.getOwnerToken();
    },
    data() {
        return {
            tokenList: [],
            changeOwnerToken: null,
            newOwner: '',
            isValidAddress: true,
            showMaxTips: null,
            showTotalTips: null
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
                item.isTotalOver = item.totalSupply.length > 10;
                item.showTotalSupply = item.isTotalOver ? `${ item.totalSupply.slice(0, 10) }...` : item.totalSupply;

                item.maxSupply = item.isReIssuable ? BigNumber.toBasic(item.maxSupply, item.decimals) : '--';
                item.isMaxOver = item.maxSupply.length > 10;
                item.showMaxSupply = item.isMaxOver ? `${ item.maxSupply.slice(0, 10) }...` : item.maxSupply;

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
        showMax(i) {
            this.showMaxTips = i;
        },
        hideMax() {
            this.showMaxTips = null;
        },
        showTotal(i) {
            this.showTotalTips = i;
        },
        hideTotal() {
            this.showTotalTips = null;
        },
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

.tipsicon {
    position: relative;
    display: inline-block;
    background: url(~assets/imgs/hover_help.svg);
    overflow: visible;
    width: 16px;
    height: 16px;
    vertical-align: sub;
    margin-left: 4px;
}
</style>
