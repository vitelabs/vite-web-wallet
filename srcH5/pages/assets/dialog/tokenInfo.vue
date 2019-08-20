<template lang="pug">
extends /components/dialog/base.pug
block head
    .head
        img.icon(:src="tokenDetail.urlIcon || token.icon || getIcon(token.tokenId)")
        .head_info
            .head__name {{token.tokenName}}
                .head__name__gate(v-if="token.gateInfo.name")
            .head__symbol {{token.tokenSymbol}}
        .gate_info(v-if="gateName") {{gateName}}
    .tab
        .tab__item.active {{$t("tokenCard.tokenInfo.tabName")}}

block originContent
    .tab-content
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.tokenName")}}:
            div.click-able(@click="goToTokenDetail") {{tokenDetail.name}} ({{tokenDetail.symbol}})
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.tokenId")}}:
            div.click-able(@click="goToTokenDetail") {{token.tokenId}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.overview")}}:
            div {{ getOverview(tokenDetail.overview) }}
                span.click-able.view-more(v-if="tokenDetail.overview && tokenDetail.overviewLink" @click="openUrl(tokenDetail.overviewLink)") {{ $t("tokenCard.tokenInfo.labels.viewmore") }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.total")}}:
            div {{tokenDetail.showTotalSupply || '--'}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.type")}}:
            .div {{ tokenDetail.ttype || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.gate")}}:
            div.click-able(@click="openUrl(tokenDetail.gateway ? tokenDetail.gateway.website : null)") {{tokenDetail.gateway ? tokenDetail.gateway.name || '--' : '--'}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.website")}}:
            div.click-able(@click="openUrl(tokenDetail.websiteLink)") {{ tokenDetail.websiteLink || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.whitePaper")}}:
            div.click-able(@click="openUrl(tokenDetail.whitepaperLink)") {{ tokenDetail.whitepaperLink || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.explorer")}}:
            div.click-able(v-if="tokenDetail.gateway" @click="openUrl(tokenDetail.explorerLink)") {{ tokenDetail.explorerLink || '--' }}
            div.click-able(v-if="!tokenDetail.gateway" @click="goToTokenDetail") {{ tokenDetail.explorerLink || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.github")}}:
            div.click-able(@click="openUrl(tokenDetail.githubLink)") {{ tokenDetail.githubLink || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.media")}}:
            div
                img.media-icon(src="~assets/imgs/facebook.svg" v-show="tokenDetail.facebookLink" @click="openUrl(tokenDetail.facebookLink)")
                img.media-icon(src="~assets/imgs/twitter.svg" v-show="tokenDetail.twitterLink" @click="openUrl(tokenDetail.twitterLink)")
                img.media-icon(src="~assets/imgs/telegram.svg" v-show="tokenDetail.telegramLink" @click="openUrl(tokenDetail.telegramLink)")
</template>

<script>
import { tokenDetail } from 'services/trade';
import { getTokenIcon } from 'utils/tokenParser';
import { getExplorerLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import BigNumber from 'utils/bigNumber';

export default {
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    beforeMount() {
        this.fetchTokenDetail();
    },
    data() {
        return { tokenDetail: {} };
    },
    computed: {
        gateName() {
            if (this.token.type === 'NATIVE') return '';
            if (this.token.gateInfo.gateway) return this.token.gateInfo.gateway;
            if (this.token.gateInfo.url) return this.$t('tokenCard.gateInfo.selfdefined');
            return '';
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        goToTokenDetail() {
            const l = `${ getExplorerLink() }token/${ this.token.tokenId }`;
            openUrl(l);
        },
        getIcon(id) {
            return getTokenIcon(id);
        },
        tabClick(name) {
            this.tabName = name;
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
                this.tokenDetail.ttype = (this.tokenDetail.gateway || this.gateName)
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
                this.tokenDetail.explorerLink = this.tokenDetail.explorerLink
                    || (this.tokenDetail.gateway ? null : getExplorerLink());
                this.tokenDetail.showTotalSupply = BigNumber.toBasic(this.tokenDetail.totalSupply, this.tokenDetail.tokenDecimals);
            }).catch(err => {
                console.warn(err);
            });
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
@import "~components/confirm/moreTabConfirm.scss";
</style>
