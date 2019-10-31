<template>
    <confirm v-show="tab" class="no-padding-confirm" :title="$t('tradeCenter.operatorTxPair.operatorTab')"
             :closeIcon="true" :close="close">
        <div class="tab-content">
            <div class="content__item">
                <span class="label">{{ $t('tradeCenter.operator.name') }}:</span>
                {{ operatorInfo ? operatorInfo.name : $t('tradeCenter.operator.noName') }}
                <img class="operator-img" :src="operatorIcon"/>
            </div>
            <div class="content__item">
                <span class="label">{{ $t('tradeCenter.operator.address') }}:</span>
                {{ operatorInfo ? operatorInfo.address : '--' }}
            </div>
            <div class="content__item">
                <span class="label">{{ $t('tradeCenter.operator.overview') }}:</span>
                {{ operatorOverview }}
            </div>
            <div class="content__item _b">
                <span class="label">{{ $t('tradeCenter.operator.txPair') }}:</span>
                <div class="tx-pair-list">
                    <template v-for="(pairs) in operatorTradePairs">
                        <span class="symbol" v-for="(symbol) in pairs" :key="symbol">
                            {{symbol.replace('_', '/') }}
                        </span>
                    </template>
                </div>
            </div>
        </div>
    </confirm>
</template>

<script>
import confirm from 'h5Components/confirm/confirm.vue';
import { getExplorerLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import BigNumber from 'utils/bigNumber';
import operatorIcon from 'assets/imgs/operator_icon.svg';

export default {
    components: { confirm },
    data() {
        return { tab: '' };
    },
    computed: {
        ftokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        },
        tokenDetail() {
            if (!this.ftokenDetail) {
                return {};
            }

            const tokenDetail = this.ftokenDetail;
            if (this.ftokenDetail.links) {
                for (const key in this.ftokenDetail.links) {
                    tokenDetail[`${ key }Link`] = this.ftokenDetail.links[key] && this.ftokenDetail.links[key].length
                        ? this.ftokenDetail.links[key][0] : '';
                }
            }
            tokenDetail.ttype = typeof tokenDetail.gateway === 'undefined'
                ? '--' : tokenDetail.gateway
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
            tokenDetail.explorerLink = tokenDetail.explorerLink
                || (tokenDetail.gateway ? null : getExplorerLink(this.$i18n.locale));
            tokenDetail.showTotalSupply = BigNumber.toBasic(tokenDetail.totalSupply, tokenDetail.tokenDecimals);

            return tokenDetail;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        operatorInfo() {
            return this.$store.state.exchangeTokens.operator;
        },
        operatorIcon() {
            if (this.operatorInfo) {
                return this.operatorInfo.icon || '';
            }
            return operatorIcon;
        },
        operatorOverview() {
            if (!this.operatorInfo) {
                return '--';
            }
            return this.operatorInfo.overview && this.operatorInfo.overview[this.$i18n.locale]
                ? this.operatorInfo.overview[this.$i18n.locale] : '--';
        },
        operatorTradePairs() {
            return this.operatorInfo ? this.operatorInfo.tradePairs : [];
        }
    },
    methods: {
        switchTab(tab) {
            this.tab = tab;
        },
        close() {
            this.tab = '';
        },
        goToTokenDetail() {
            const l = `${ getExplorerLink(this.$i18n.locale) }token/${ this.tokenDetail.tokenId }`;
            this.openUrl(l);
        },
        openUrl(url) {
            url && openUrl(url);
        },
        getOverview(overview) {
            if (!overview) {
                return '--';
            }

            if (overview[this.$i18n.locale]) {
                return overview[this.$i18n.locale];
            } else if (overview.en) {
                return overview.en;
            }

            return '--';
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Components/confirm/moreTabConfirm.scss";

.tab-content {
    border-top: 1px solid #d4dee7;
    height: 350px;
}

.content__item {
    word-break: break-word;
    white-space: normal;
    &._b {
        margin-bottom: 10px;
    }
    .operator-img {
        width: 20px;
        height: 20px;
        margin-left: 10px;
        margin-top: -3px;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid rgba(212,222,231,1);
    }
    .tx-pair-list {
        display: flex;
        flex-wrap: wrap;
        color: rgba(0,122,255,1);
        .symbol {
            white-space: nowrap;
            margin-bottom: 6px;
            margin-right: 8px;
        }
    }
}
</style>
