<template>
    <div class="token-card">
        <div class="col title click-able">
            <div class="token-meta">
                <img :src="token.icon" class="icon" @click="() => showDetail()"/>
                <div class="name-wrapper" @click="() => showDetail()">
                    <div class="token-symbol">
                        {{ getTokenNameString(token.tokenSymbol, token.index) }}
                    </div>
                    <div class="token-name">{{ token.tokenName }}</div>
                </div>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col click-able">
            <div>
                {{ `${token.balance || 0} ${token.tokenSymbol}` }}
            </div>
            <div class="op_group">
                <div class="op" @click="_send">
                    {{ $t("tokenCard.actionType.SEND") }}
                </div>
            </div>
        </div>
        <div class="col">
            {{ `${token.fundFloat || 0} ${token.tokenSymbol}` }}
        </div>
        <div class="col">
            <div
                :class="{underline:gateName!=='--','click-able':gateName!=='--'}"
                @click="() => token.type !== 'NATIVE' && showDetail('gate')"
            >
                {{ gateName }}
            </div>
            <div class="op_group" v-if="token.gateInfo.url">
                <div class="op" @click="charge">
                    {{ $t("tokenCard.actionType.CHARGE") }}
                </div>
                <div class="op" @click="_withdraw">
                    {{ $t("tokenCard.actionType.WITHDRAW") }}
                </div>
                <div class="op readonly" @click="() => showDetail('withdraw')">
                    {{ $t("tokenCard.actionType.RECRODS") }}
                </div>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col">
            {{ `${exBanlance || 0} ${token.tokenSymbol}` }}
        </div>
        <div class="col">
            <div>
                {{ `${avaliableExBalance || 0} ${token.tokenSymbol}` }}
            </div>
            <div class="op_group">
                <div class="op" @click="_exCharge">
                    {{ $t("tokenCard.actionType.EXCHARGE") }}
                </div>
                <div class="op" @click="_exWithdraw">
                    {{ $t("tokenCard.actionType.EXWITHDRAW") }}
                </div>
                <div class="op readonly" @click="exRecord">
                    {{ $t("tokenCard.actionType.EXRECRODS") }}
                </div>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col">
            <div class="assets">
                <div class="est_btc">{{ assetView.btc }} BTC</div>
                <div class="est_cash">
                    ≈{{ currencySymbol }} {{ assetView.cash }}
                </div>
            </div>
            <div
                class="unbind click-able"
                @click="unbind"
                v-if="showUnbind"
            ></div>
        </div>
        <Alert ref="alert" :token="token" />
        <transaction
            :closeTrans="closeTrans"
            :token="token"
            v-if="isShowTrans"
        />

        <important-hint ref="importantHintDom" :tokenInfo="token"></important-hint>
    </div>
</template>

<script>
import {
    receiveDialog,
    chargeDialog,
    withdrawDialog,
    tokenInfoDialog,
    exWithdrawDialog,
    exChargeDialog
} from '../dialog';
import importantHint from '../dialog/importantHint';
import statistics from 'utils/statistics';
import bigNumber from 'utils/bigNumber';
import { execWithValid } from 'utils/execWithValid';
import { getTokenNameString } from 'utils/tokenParser';
import { gateStorage } from 'services/gate';
import transaction from '../transaction';
import Alert from '../alert.vue';

export default {
    components: { transaction, Alert, importantHint },
    props: {
        token: {
            type: Object,
            default: () => {
                return {
                    tokenSymbol: '--',
                    balance: 0,
                    asset: 0,
                    onroadNum: 0,
                    type: 'OFFICAL_GATE'
                };
            }
        },
        assetType: {
            type: String,
            default: 'TOTAL'
        }
    },
    data() {
        return { isShowTrans: false };
    },
    computed: {
        currencySymbol() {
            return this.$store.getters.currencySymbol;
        },
        showUnbind() {
            return (
                this.token.type === 'THIRD_GATE'
                && (!this.token.totalAmount
                    || bigNumber.isEqual(this.token.totalAmount, '0'))
                && (!this.token.totalExAmount
                    || bigNumber.isEqual(this.token.totalExAmount, '0')) && !(this.token.tokenSymbol === 'VCP' && !this.token.index)// except vcp
            );
        },
        gateName() {
            if (this.token.type === 'NATIVE') return '--';
            if (this.token.gateInfo.gateway) return this.token.gateInfo.gateway;
            if (this.token.gateInfo.url) return this.$t('tokenCard.gateInfo.selfdefined');
            return this.$t('tokenCard.gateInfo.gateSetting');
        },
        exBanlance() {
            return (
                this.token.totalExAmount
                && bigNumber.toBasic(this.token.totalExAmount, this.token.decimals)
            );
        },
        avaliableExBalance() {
            return (
                this.token.availableExAmount
                && bigNumber.toBasic(this.token.availableExAmount,
                    this.token.decimals)
            );
        },
        assetView() {
            if (this.assetType === 'TOTAL') {
                return {
                    btc: this.token.totalAssetBtc,
                    cash: this.token.totalAsset
                };
            }
            if (this.assetType === 'EX') {
                return {
                    btc: this.token.totalExAssetBtc,
                    cash: this.token.totalExAsset
                };
            }
            if (this.assetType === 'WALLET') {
                return {
                    btc: this.token.walletAssetBtc,
                    cash: this.token.walletAsset
                };
            }
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        getTokenNameString(...args) {
            return getTokenNameString(...args);
        },
        exRecord() {
            statistics.event(this.$route.name, 'exchange-history', this.address || '');
            this.$refs.alert.show();
        },
        unbind() {
            gateStorage.unbindToken(this.token.tokenId);
        },
        receive() {
            receiveDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        },
        charge() {
            statistics.event(this.$route.name, 'Cross-Chain-receive', this.address || '');
            this.$refs.importantHintDom.showConfirm(() => {
                chargeDialog({ token: this.token }).catch(e => {
                    console.error(e);
                });
            });
        },
        _withdraw() {
            statistics.event(this.$route.name, 'Cross-Chain-transfer', this.address || '');
            this.withdraw();
        },
        withdraw: execWithValid(function () {
            this.$refs.importantHintDom.showConfirm(() => {
                withdrawDialog({ token: this.token }).catch(e => {
                    console.error(e);
                });
            });
        }),
        showDetail(initTabName = 'tokenInfo') {
            statistics.event(this.$route.name, `tokenDialog-${ initTabName }`, this.address || '');

            tokenInfoDialog({ token: this.token, initTabName }).catch(e => {
                console.error(e);
            });
        },
        _exCharge() {
            statistics.event(this.$route.name, 'exchange-deposit', this.address || '');
            this.exCharge();
        },
        _exWithdraw() {
            statistics.event(this.$route.name, 'exchange-withdraw', this.address || '');
            this.exWithdraw();
        },
        exCharge: execWithValid(function () {
            exChargeDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        }),
        exWithdraw: execWithValid(function () {
            exWithdrawDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        }),
        _send() {
            statistics.event(this.$route.name, 'wallet-transfer', this.address || '');
            this.send();
        },
        send: execWithValid(function () {
            if (!this.token.tokenId) {
                return;
            }
            this.isShowTrans = true;
        }),
        closeTrans() {
            this.isShowTrans = false;
        }
    }
};
</script>

<style lang='scss' scoped>
@import "~assets/scss/vars.scss";
@import "./colWidth.scss";

.token-card {
    box-sizing: border-box;
    position: relative;
    background: #fff;
    display: flex;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid rgba(227, 235, 245, 0.6);
    height: 71px;
    .click-able {
        cursor: pointer;
    }
    .col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding: 8px 0;
        color: #5e6875;
        font-size: 12px;
        align-self: stretch;
        position: relative;
        @include colWidth;
        overflow: auto;
        .unbind {
            height: 16px;
            width: 16px;
            position: absolute;
            bottom: 6px;
            right: 6px;
            background-image: url(~assets/imgs/bind.png);
            background-size: cover;
        }
        .underline {
            border-bottom: 1px dotted #5e6875;
        }
        .separate {
            border-right: 1px solid rgba(227, 235, 245, 0.6);
            height: 52px;
            position: absolute;
            right: 0;
            top: 7px;
        }
        .op_group {
            display: flex;
            .op {
                word-break: keep-all;
                background: rgba(0, 122, 255, 0.05);
                border-radius: 2px;
                border: 1px solid rgba(0, 122, 255, 0.3);
                line-height: 16px;
                cursor: pointer;
                color: #007aff;
                margin-right: 6px;
                padding-right: 2px;
                padding-left: 2px;
                &.readonly {
                    color: #5e6875;
                    background: rgba(94, 104, 117, 0.05);
                    border: 1px solid rgba(94, 104, 117, 0.3);
                }
            }
        }
        .assets {
            display: flex;
            flex-direction: column;
            .est_cash {
                color: #5e687594;
                margin-top: 4px;
            }
        }
        &.title {
            @include font-family-bold();
            color: #5e6875;
            .icon {
                height: 16px;
                width: 16px;
                margin-right: 4px;
                margin-bottom: 11px;
                border-radius: 50%;
                border: 1px solid rgba(212,222,231,1);
            }
            .token-meta {
                display: flex;
                .name-wrapper {
                    display: inline-block;
                    .token-name {
                        font-size: 11px;
                        @include font-family-normal();
                        color: rgba(94,104,117,0.58);
                        line-height: 15px;
                    }
                }
            }
        }
    }
}
</style>
