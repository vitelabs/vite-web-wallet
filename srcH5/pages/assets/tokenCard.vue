<template>
    <div class="token-card">
        <div class="token-meta" @click="showDetail">
            <img :src="tokenDetail.urlIcon || token.icon" class="icon"/>{{ getTokenSymbolString(token.tokenSymbol, token.index) }}
        </div>
        <div class="col">
            <span>{{ $t('tokenCard.heads.balance') }}</span>
            <span>{{ token.balance || 0 }}</span>
        </div>
        <div class="col">
            <span>{{ $t('tokenCard.heads.totalExAmount') }}</span>
            <span>{{ exBanlance || 0 }}</span>
        </div>
        <div class="col">
            <span>{{ $t('tokenCard.heads.availableExAmount') }}</span>
            <span>{{ avaliableExBalance || 0 }}</span>
        </div>
        <div class="op_group">
            <div class="op __pointer" @click="transfer">{{ $t('mobileAssets.transfer') }}</div>
            <div class="op __pointer" @click="trade">{{ $t('mobileAssets.trade') }}</div>
        </div>

        <trade-view ref="tradeView" :symbol="tokenDetail ? tokenDetail.symbol : ''"></trade-view>
    </div>
</template>

<script>
// , exWithdrawDialog, exChargeDialog
import { tokenInfoDialog } from './dialog';
import tradeView from './trade';
import { tokenDetail } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { getExplorerLink } from 'utils/getLink';
import { getTokenSymbolString } from 'utils/tokenParser';
import { bridge } from 'h5Utils/bridge';

export default {
    components: { tradeView },
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
        }
    },
    beforeMount() {
        this.fetchTokenDetail();
    },
    data() {
        return { tokenDetail: {} };
    },
    computed: {
        currencySymbol() {
            return this.$store.getters.currencySymbol;
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
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        getTokenSymbolString(...args) {
            return getTokenSymbolString(...args);
        },
        showDetail() {
            tokenInfoDialog({
                token: this.token,
                _tokenDetail: this.tokenDetail,
                isNeedFetch: false
            }).catch(e => {
                console.error(e);
            });
        },
        transfer() {
            statistics.event(`H5${ this.$route.name }`, 'transfer', this.address || '');
            bridge['pri.transferAsset']({ tokenId: this.token.tokenId }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('hint.operateFail'));
            });
        },
        trade() {
            this.$refs.tradeView.isShow = true;
        },

        fetchTokenDetail() {
            tokenDetail({ tokenId: this.token.tokenId }).then(data => {
                this.tokenDetail = data;
                if (data.links) {
                    for (const key in data.links) {
                        this.tokenDetail[`${ key }Link`] = data.links[key] && data.links[key].length
                            ? data.links[key][0] : '';
                    }
                }
                this.tokenDetail.ttype = this.tokenDetail.gateway
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
                this.tokenDetail.explorerLink = this.tokenDetail.explorerLink
                    || (this.tokenDetail.gateway ? null : getExplorerLink(this.$i18n.locale));
                this.tokenDetail.showTotalSupply = bigNumber.toBasic(this.tokenDetail.totalSupply, this.tokenDetail.tokenDecimals);
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang='scss' scoped>
@import "~h5Assets/scss/vars.scss";

.token-card {
    padding: 12px 0 9px;
    box-sizing: border-box;
    position: relative;
    background: #fff;
    border-top: 1px solid rgba(211,223,239,1);
    @include font-normal();
    font-family: $font;

    .token-meta {
        margin-bottom: 12px;
        line-height: 20px;
        font-size: 16px;
        @include font-bold();
        color: rgba(36,39,43,1);
        .icon {
            height: 20px;
            width: 20px;
            margin-right: 10px;
            border-radius: 50%;
            box-sizing: border-box;
            border: 1px solid rgba(212,222,231,1);
            margin-bottom: -4px;
        }
    }

    .col {
        margin-bottom: 12px;
        display: flex;
        span {
            line-height: 16px;
            flex: 1;
            font-size: 12px;
            @include font-bold();
            color: rgba(36,39,43,1);
            text-align: right;
            &:first-child {
                text-align: left;
                font-weight: 400;
                color: rgba(62,74,89,0.6);
            }
        }
    }
    .op_group {
        display: flex;
        .op {
            box-sizing: border-box;
            background: rgba(0,122,255,0.05);
            border-radius: 2px;
            border: 1px solid rgba(0,122,255,0.3);
            word-break: keep-all;
            line-height: 26px;
            color: $blue;
            flex: 1;
            text-align: center;
            font-size: 14px;
            @include font-bold();
            &:first-child {
                margin-right: 25px;
            }
        }
    }
}
</style>
