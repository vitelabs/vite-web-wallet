<template>
    <confirm v-show="tab" class="big no-padding-confirm" :title="$t('tradeCenter.operatorTxPair.title')"
             :closeIcon="true" :close="close">
        <div class="head">
            <tx-pair-info></tx-pair-info>
        </div>
        <div class="tab">
            <div class="tab__item" :class="{'active': tab === 'token'}" @click="switchTab('token')">
                {{$t("tradeCenter.operatorTxPair.tokenTab")}}
            </div>
            <div class="tab__item" :class="{'active': tab === 'operator'}" @click="switchTab('operator')">
                {{$t("tradeCenter.operatorTxPair.operatorTab")}}
            </div>
        </div>
        <div v-show="tab === 'token'" class="tab-content">
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.tokenName")}}:</div>
                <div class="click-able" @click="goToTokenDetail">{{tokenDetail.name}} ({{tokenDetail.symbol}})</div>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.tokenId")}}:</div>
                <div class="click-able" @click="goToTokenDetail">{{tokenDetail.tokenId}}</div>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.overview")}}:</div>
                {{ tokenDetail.overview && tokenDetail.overview[$i18n.locale] ? tokenDetail.overview[$i18n.locale] : '--' }}
                <span class="click-able view-more"
                      v-if="tokenDetail.overview && tokenDetail.overviewLink"
                      @click="openUrl(tokenDetail.overviewLink)">
                    {{ $t("tokenCard.tokenInfo.labels.viewmore") }}</span>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.total")}}:</div> {{ tokenDetail.total || '--' }}
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.type")}}:</div> {{ tokenDetail.ttype }}
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.gate")}}:</div>
                <div @click="openUrl(tokenDetail.gateway ? tokenDetail.gateway.website : null)"
                     class="click-able">{{tokenDetail.gateway ? tokenDetail.gateway.name || '--' : '--'}}</div>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.website")}}:</div>
                <div class="click-able" @click="openUrl(tokenDetail.website)">{{ tokenDetail.website || '--' }}</div>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.whitePaper")}}:</div>
                <div class="click-able" @click="openUrl(tokenDetail.whitepaperLink)">
                    {{ tokenDetail.whitepaperLink || '--' }}</div>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.explorer")}}:</div>
                <div class="click-able" @click="openUrl(tokenDetail.explorerLink)">
                    {{ tokenDetail.explorerLink || '--' }}</div>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.github")}}:</div>
                <div class="click-able" @click="openUrl(tokenDetail.githubLink)">
                    {{ tokenDetail.githubLink || '--' }}</div>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.media")}}:</div>
                <span class="twitter" v-show="tokenDetail.twitterLink">twitter</span>
                <span class="facebook" v-show="tokenDetail.facebookLink">facebook</span>
            </div>
        </div>
        <div v-show="tab === 'operator'" class="tab-content">
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
                    <template v-for="(pairs, category) in operatorTradePairs">
                        <span class="symbol" v-for="(symbol) in pairs" :key="symbol"
                              @click="switchTxPair({ category, symbol })">
                            {{symbol.replace('_', '/') }}
                        </span>
                    </template>
                </div>
            </div>
        </div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import { getExplorerLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import statistics from 'utils/statistics';
import txPairInfo from './txPairInfo.vue';
import operatorIcon from 'assets/imgs/operator_icon.svg';

export default {
    components: { confirm, txPairInfo },
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
                    tokenDetail[`${ key }Link`] = this.ftokenDetail.links[key];
                }
            }
            tokenDetail.ttype = typeof tokenDetail.gateway === 'undefined'
                ? '--' : tokenDetail.gateway
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
            tokenDetail.explorerLink = tokenDetail.explorerLink
                || (tokenDetail.gateway ? null : getExplorerLink());

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
            const l = `${ getExplorerLink() }token/${ this.tokenDetail.tokenId }`;
            this.openUrl(l);
        },
        openUrl(url) {
            url && openUrl(url);
        },
        switchTxPair({ category, symbol }) {
            statistics.event(this.$route.name, `operator_switchTxPair_${ category }_${ symbol }`, this.address || '');
            this.$store.commit('switchTradePair', { category, symbol });
            this.close();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~components/confirm/moreTabConfirm.scss";

.content__item {
    word-break: break-word;
    white-space: normal;
    &._b {
        margin-bottom: 10px;
    }
    .operator-img {
        width: 30px;
        height: 30px;
        margin-left: 10px;
        margin-top: -8px;
    }
    .tx-pair-list {
        display: flex;
        flex-wrap: wrap;
        color: rgba(0,122,255,1);
        .symbol {
            white-space: nowrap;
            margin-bottom: 6px;
            margin-right: 30px;
        }
    }
}
</style>
