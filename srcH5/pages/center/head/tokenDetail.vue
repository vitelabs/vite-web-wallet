<template>
    <confirm v-show="tab" class="big no-padding-confirm" :title="$t('tradeCenter.operatorTxPair.title')"
             :closeIcon="true" :close="close">
        <div class="head">
            <tx-pair-info></tx-pair-info>
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
                {{ getOverview(tokenDetail.overview) }}
                <span class="click-able view-more"
                      v-if="tokenDetail.overview && tokenDetail.overviewLink"
                      @click="openUrl(tokenDetail.overviewLink)">
                    {{ $t("tokenCard.tokenInfo.labels.viewmore") }}</span>
            </div>
            <div class="content__item">
                <div class="label">{{$t("tokenCard.tokenInfo.labels.total")}}:</div> {{ tokenDetail.showTotalSupply || '--' }}
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
                <div class="click-able" @click="openUrl(tokenDetail.websiteLink)">{{ tokenDetail.websiteLink || '--' }}</div>
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
                <img src="~assets/imgs/facebook.svg" class="media-icon"
                     v-show="tokenDetail.facebookLink"  @click="openUrl(tokenDetail.facebookLink)"/>
                <img src="~assets/imgs/twitter.svg" class="media-icon"
                     v-show="tokenDetail.twitterLink"  @click="openUrl(tokenDetail.twitterLink)"/>
                <img src="~assets/imgs/telegram.svg" class="media-icon"
                     v-show="tokenDetail.telegramLink"  @click="openUrl(tokenDetail.telegramLink)"/>
            </div>
        </div>
    </confirm>
</template>

<script>
import confirm from 'h5Components/confirm/confirm.vue';
import { getExplorerLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import statistics from 'utils/statistics';
import BigNumber from 'utils/bigNumber';
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
                    tokenDetail[`${ key }Link`] = this.ftokenDetail.links[key] && this.ftokenDetail.links[key].length
                        ? this.ftokenDetail.links[key][0] : '';
                }
            }
            tokenDetail.ttype = typeof tokenDetail.gateway === 'undefined'
                ? '--' : tokenDetail.gateway
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
            tokenDetail.explorerLink = tokenDetail.explorerLink
                || (tokenDetail.gateway ? null : getExplorerLink());
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
@import "./detail.scss";
</style>
