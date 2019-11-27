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
                <i v-if="item.isTotalOver" class="tipsicon __pointer">
                    <tooltips class="icon-tooltips" :content="item.simpleTotalSupply"></tooltips>
                </i>
            </span>

            <span v-for="(item, i) in showTokenList" :key="i"
                  :slot="`${i}showMaxSupplyAfter`">
                <i v-if="item.isMaxOver" class="tipsicon __pointer">
                    <tooltips class="icon-tooltips" :content="item.simpleMaxSupply"></tooltips>
                </i>
            </span>

            <span v-for="(item, i) in showTokenList" :key="i"
                  :slot="`${i}operateBefore`">
                <span v-show="!item.isReIssuable">--</span>
                <span v-show="item.isReIssuable" class="btn __pointer"
                      @click="changeOwner(item)">
                    {{ $t('walletMintage.changeOwnerConfirm.title') }}</span>
                <span v-show="item.isReIssuable" class="btn __pointer"
                      @click="changeReIssuable(item)">
                    {{ $t('walletMintage.reIssuableConfirm.title') }}</span>
                <span v-show="item.isReIssuable" class="btn __pointer"
                      @click="issue(item)">
                    {{ $t('walletMintage.issueConfirm.title') }}</span>
            </span>

        </wallet-table>

        <show-confirm v-if="changeOwnerToken" class="middle" :btnUnuse="!!(!address || !isValidAddress)"
                      :title="$t('walletMintage.changeOwnerConfirm.title')" :showMask="true"
                      :leftBtnTxt="$t('walletMintage.cancel')" :leftBtnClick="cancelChangeOwner"
                      :rightBtnTxt="$t('walletMintage.submit')" :rightBtnClick="toChangeOwner">
            <div class="__row">
                <div class="__row_t">{{ $t('walletMintage.tokenName') }}</div>
                <div class="__input_row __unuse_input">{{ changeOwnerToken.tokenName }}</div>
            </div>
            <div class="__row">
                <div class="__row_t">{{ $t('walletMintage.tokenSymbol') }}</div>
                <div class="__input_row __unuse_input">{{ changeOwnerToken.tokenSymbol }}</div>
            </div>
            <div class="__row">
                <div class="__row_t">{{ $t('walletMintage.address') }}</div>
                <div class="__input_row __unuse_input">{{ changeOwnerToken.owner }}</div>
            </div>
            <div class="__row">
                <div class="__row_t">
                    {{ $t('walletMintage.changeOwnerConfirm.address') }}
                    <span v-show="!isValidAddress" class="__err">{{ $t('hint.addrFormat') }}</span>
                </div>
                <vite-input v-model="address" :valid="validAddr"
                            :placeholder="$t('wallet.placeholder.addr')"></vite-input>
            </div>
        </show-confirm>

        <show-confirm v-if="issueToken" class="middle" :btnUnuse="!!(!address || !isValidAddress || amountErr || !amount)"
                      :title="$t('walletMintage.issueConfirm.title')" :showMask="true"
                      :leftBtnTxt="$t('walletMintage.cancel')" :leftBtnClick="cancelIssue"
                      :rightBtnTxt="$t('walletMintage.submit')" :rightBtnClick="toIssue">
            <div class="__row">
                <div class="__row_t">{{ $t('walletMintage.tokenName') }}</div>
                <div class="__input_row __unuse_input">{{ issueToken.tokenName }}</div>
            </div>
            <div class="__row">
                <div class="__row_t">{{ $t('walletMintage.tokenSymbol') }}</div>
                <div class="__input_row __unuse_input">{{ issueToken.tokenSymbol }}</div>
            </div>
            <div class="__row">
                <div class="__row_t">
                    {{ $t('walletMintage.issueConfirm.amount') }}
                    <span v-show="amountErr" class="__err">{{ amountErr }}</span>
                </div>
                <vite-input v-model="amount" :valid="validAmount"></vite-input>
            </div>
            <div class="__row">
                <div class="__row_t">
                    {{ $t('walletMintage.issueConfirm.address') }}
                    <span v-show="!isValidAddress" class="__err">{{ $t('hint.addrFormat') }}</span>
                </div>
                <vite-input v-model="address" :valid="validAddr"
                            :placeholder="$t('wallet.placeholder.addr')"></vite-input>
            </div>
        </show-confirm>
    </div>
</template>

<script>
import { wallet } from '@vite/vitejs';
import showConfirm from 'components/confirm/confirm.vue';
import walletTable from 'components/table/index.vue';
import { initPwd } from 'pcComponents/password/index.js';
import viteInput from 'components/viteInput';
import tooltips from 'components/tooltips';
import BigNumber from 'utils/bigNumber';
import { getTokenListByOwner } from 'services/viteServer';
import sendTx from 'pcUtils/sendTx';
import { verifyAmount } from 'pcUtils/validations';
import { execWithValid } from 'pcUtils/execWithValid';

export default {
    components: { walletTable, showConfirm, viteInput, tooltips },
    created() {
        this.getOwnerToken();
    },
    data() {
        return {
            tokenList: [],
            changeOwnerToken: null,
            issueToken: null,
            address: '',
            isValidAddress: true,
            amount: '',
            amountErr: ''
        };
    },
    computed: {
        activeAddress() {
            return this.$store.getters.activeAddr;
        },
        showTokenList() {
            const list = [];
            this.tokenList.forEach(item => {
                item.simpleTotalSupply = BigNumber.toBasic(item.totalSupply, item.decimals);
                item.isTotalOver = item.simpleTotalSupply.length > 10;
                item.showTotalSupply = item.isTotalOver ? `${ item.simpleTotalSupply.slice(0, 10) }...` : item.simpleTotalSupply;

                item.simpleMaxSupply = item.isReIssuable ? BigNumber.toBasic(item.maxSupply, item.decimals) : '--';
                item.isMaxOver = item.simpleMaxSupply.length > 10;
                item.showMaxSupply = item.isMaxOver ? `${ item.simpleMaxSupply.slice(0, 10) }...` : item.simpleMaxSupply;

                item.ownerBurnOnly = item.isReIssuable ? item.ownerBurnOnly : '--';

                list.push(item);
            });
            return list;
        }
    },
    watch: {
        activeAddress() {
            this.getOwnerToken();
        }
    },
    methods: {
        validAddr() {
            this.isValidAddress = this.address && wallet.isValidAddress(this.address);
        },
        validAmount() {
            this.amountErr = verifyAmount({
                formatDecimals: 8,
                decimals: this.issueToken.decimals,
                maxAmount: BigNumber.minus(this.issueToken.maxSupply, this.issueToken.totalSupply),
                errorMap: { overMax: this.$t('walletMintage.issueConfirm.overAmount') }
            })(this.amount);
            return !this.amountErr;
        },

        getOwnerToken() {
            getTokenListByOwner(this.activeAddress).then(data => {
                this.tokenList = data;
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('walletMintage.getListFail'));
            });
        },
        changeReIssuable: execWithValid(function (item) {
            initPwd({
                title: this.$t('walletMintage.reIssuableConfirm.title'),
                content: this.$t('walletMintage.reIssuableConfirm.text', { tokenName: item.tokenName }),
                submit: () => {
                    this.toChangeReIssuale(item);
                }
            }, true);
        }),
        changeOwner: execWithValid(function (item) {
            this.changeOwnerToken = item;
        }),
        cancelChangeOwner() {
            this.changeOwnerToken = null;
            this.address = '';
            this.isValidAddress = true;
        },
        issue: execWithValid(function (item) {
            this.issueToken = item;
            this.address = this.issueToken.owner;
        }),
        cancelIssue() {
            this.issueToken = null;
            this.address = '';
            this.amount = '';
            this.amountErr = '';
            this.isValidAddress = true;
        },

        toChangeOwner() {
            if (!this.changeOwnerToken) {
                return;
            }

            initPwd({
                submit: () => {
                    sendTx({
                        methodName: 'changeTransferOwner',
                        data: {
                            tokenId: this.changeOwnerToken.tokenId,
                            newOwner: this.address
                        }
                    }).then(() => {
                        this.$toast(this.$t('hint.operateSuccess'));
                        this.cancelChangeOwner();
                        this.getOwnerToken();
                    }).catch(err => {
                        console.warn(err);
                        this.$toast(this.$t('hint.operateFail'), err);
                    });
                }
            });
        },
        toChangeReIssuale(item) {
            sendTx({
                methodName: 'changeTokenType',
                data: { tokenId: item.tokenId }
            }).then(() => {
                this.$toast(this.$t('hint.operateSuccess'));
                this.getOwnerToken();
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('hint.operateFail'), err);
            });
        },
        toIssue() {
            if (!this.issueToken) {
                return;
            }

            initPwd({
                submit: () => {
                    sendTx({
                        methodName: 'mintageIssue',
                        data: {
                            tokenId: this.issueToken.tokenId,
                            amount: BigNumber.toMin(this.amount, this.issueToken.decimals),
                            beneficial: this.address
                        }
                    }).then(() => {
                        this.$toast(this.$t('hint.operateSuccess'));
                        this.cancelIssue();
                        this.getOwnerToken();
                    }).catch(err => {
                        console.warn(err);
                        this.$toast(this.$t('hint.operateFail'), err);
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.list-wrapper {
    margin-top: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.mintage-table {
    margin-top: 14px;
    flex: 1;
}
.btn {
    margin-right: 8px;
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
    .icon-tooltips {
        display: none;
    }
    &:hover {
        .icon-tooltips {
            display: inline;
        }
    }
}
</style>
