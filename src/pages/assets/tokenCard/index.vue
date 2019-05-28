<template>
    <div class="token-card">
        <div class="col title click-able" >
            <div>
                <img :src="token.icon" class="icon" @click="()=>showDetail()" />
                <span class="token-name underline" @click="()=>showDetail()">{{
                    `${token.tokenSymbol}-${token.index}`
                }}</span>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col click-able">
            <div>
                {{ `${token.balance || 0} ${token.tokenSymbol}` }}
            </div>
            <div class="op_group">
                <div class="op" @click="send">转账</div>
                <div class="op" @click="exCharge">{{$t("tradeAssets.table.rowMap.recharge")}}</div>
            </div>
        </div>
        <div class="col">
            {{ `${token.fundFloat || "--"} ${token.tokenSymbol}` }}
        </div>
        <div class="col">
            <div class="underline click-able" @click="()=>(token.type!=='NATIVE'&&showDetail('gate'))" >
                {{ token.gateInfo.gateway || token.type==='NATIVE'?"--":$t('tokenCard.gateInfo.selfdefined') }}
            </div>
            <div class="op_group" v-if="token.gateInfo.url">
                <div class="op" @click="charge">跨链充值</div>
                <div class="op" @click="withdraw">跨链提现</div>
                <div class="op readonly"  @click="()=>showDetail('withdraw')">跨链充提记录</div>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col">
            {{ `${exBanlance || "--"} ${token.tokenSymbol}` }}
        </div>
        <div class="col">
            <div>
                {{ `${avaliableExBalance || "--"} ${token.tokenSymbol}` }}
            </div>
            <div class="op_group">
                <div class="op" @click="exWithdraw">{{$t("tradeAssets.table.rowMap.withdraw")}}</div>
                <div class="op readonly" @click="exRecord">{{$t("tradeAssets.table.rowMap.detail")}}</div>
            </div>
            <div class="separate"></div>
        </div>
        <div class="col">
            <div class="assets">
                <div class="est_btc">{{ assetView.btc }}</div>
                <div class="est_cash">
                    ≈{{ currencySymbol }} {{ assetView.cash }}
                </div>
            </div>
            <div class="unbind click-able" @click="unbind" v-if="showUnbind"></div>
        </div>
        <Alert ref="alert" :token="token" />
        <transaction :closeTrans="closeTrans" :token="token" v-if="isShowTrans" />
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
import bigNumber from 'utils/bigNumber';
import { gateStorage } from 'services/gate';
import transaction from '../transaction';
import { execWithValid } from 'utils/execWithValid';
import Alert from '../alert';

export default {
    components: { transaction, Alert },
    props: {
        token: {
            type: Object,
            default: () => {
                return {
                    tokenSymbol: '--',
                    balance: '--',
                    asset: '--',
                    onroadNum: '--',
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
            );
        },
        gateName() {
            if (this.$store.getters.mapToken2Gate[this.token.tokenId]) {
                return this.$store.getters.mapToken2Gate[this.token.tokenId]
                    .gateway;
            }
            return this.$t('tokenCard.gateInfo.selfdefined');
        },
        exBanlance() {
            return this.token.totalExAmount && bigNumber.toBasic(this.token.totalExAmount,
                this.token.decimals);
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
                    btc: this.token.totalAsset,
                    cash: this.token.totalAsset
                };
            }
            if (this.assetType === 'EX') {
                return {
                    btc: this.token.totalExAsset,
                    cash: this.token.totalExAsset
                };
            }
            if (this.assetType === 'WALLET') {
                return {
                    btc: this.token.walletAsset,
                    cash: this.token.walletAsset
                };
            }
        }
    },
    methods: {
        exRecord() {
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
            chargeDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        },
        withdraw: execWithValid(function () {
            withdrawDialog({ token: this.token }).catch(e => {
                console.error(e);
            });
        }),
        showDetail(initTabName = 'tokenInfo') {
            tokenInfoDialog({ token: this.token, initTabName }).catch(e => {
                console.error(e);
            });
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
    border-bottom: 1px solid #c6cbd4;
    height: 71px;
    &:last-child {
        border: none;
    }
    .click-able {
        cursor: pointer;
    }
    .col {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        padding: 7px 0;
        color: #5e6875;
        font-size: 12px;
        align-self: stretch;
        position: relative;
        @include colWidth;
        .unbind{
            height: 10px;
            width: 12px;
            position: absolute;
            bottom: 6px;
            right: 6px;
            background-image: url(~assets/imgs/add_token.png);
            background-size: cover;
        }
        .underline {
            border-bottom: 1px dotted #5e6875;
        }
        .separate {
            border-right: 1px solid #d3dfef;
            height: 52px;
            position: absolute;
            right: 0;
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
                padding: 2px;
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
            font-family: $font-bold;
            color: #5e6875;
            .icon {
                height: 16px;
                width: 16px;
            }
        }
    }
}
</style>
