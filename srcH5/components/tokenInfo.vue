<template lang="pug">
extends /components/dialog/base.pug
block head
    .head
        img.icon(:src="icon")
        .head_info
            .head__name {{ tokenDetail.name }}
            .head__symbol {{ token.tokenSymbol }}
        .gate_info(v-if="tokenDetail.gateway") {{ tokenDetail.gateway.name }}
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
                span.click-able.view-more(v-if="tokenDetail.overview && tokenDetail.overviewLink && tokenDetail.overviewLink.length" @click="openUrl(tokenDetail.overviewLink[0])") {{ $t("tokenCard.tokenInfo.labels.viewmore") }}
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
            div(v-if="!tokenDetail.websiteLink || !tokenDetail.websiteLink.length") {{ '--' }}
            div(v-else)
                span.click-able(v-for="(link, i) in tokenDetail.websiteLink" :key="i" @click="openUrl(link)") {{ link || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.whitePaper")}}:
            div(v-if="!tokenDetail.whitepaperLink || !tokenDetail.whitepaperLink.length") {{ '--' }}
            div(v-else)
                span.click-able(v-for="(link, i) in tokenDetail.whitepaperLink" :key="i" @click="openUrl(link)") {{ link || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.explorer")}}:
            div(v-if="tokenDetail.gateway")
                span.click-able(v-for="(link, i) in tokenDetail.explorerLink || []" :key="i" @click="openUrl(link)") {{link || '--' }}
            div(v-else)
                span.click-able(@click="goToTokenDetail") {{ tokenDetail.explorerLink && tokenDetail.explorerLink.length ? tokenDetail.explorerLink[0] : '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.github")}}:
            div(v-if="!tokenDetail.githubLink || !tokenDetail.githubLink.length") {{ '--' }}
            div(v-else)
                span.click-able(v-for="(link, i) in tokenDetail.githubLink" :key="i" @click="openUrl(link)") {{ link || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.media")}}:
            div
                img.media-icon(src="~assets/imgs/facebook.svg" v-show="tokenDetail.facebookLink" @click="openUrl(tokenDetail.facebookLink)")
                img.media-icon(src="~assets/imgs/twitter.svg" v-show="tokenDetail.twitterLink" @click="openUrl(tokenDetail.twitterLink)")
                img.media-icon(src="~assets/imgs/telegram.svg" v-show="tokenDetail.telegramLink" @click="openUrl(tokenDetail.telegramLink)")
</template>

<script>
import { tokenDetail } from 'services/trade';
import { getExplorerLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import BigNumber from 'utils/bigNumber';
import defaultTokenIcon from 'assets/imgs/default_token_icon.png';

export default {
    props: {
        token: {
            type: Object,
            required: true
        },
        _tokenDetail: {
            type: Object,
            required: false
        },
        isNeedFetch: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    beforeMount() {
        if (this.isNeedFetch) {
            this.fetchTokenDetail();
        } else {
            this.tokenDetail = this._tokenDetail;
        }
    },
    data() {
        return {
            tokenDetail: {},
            dTitle: this.$t('mobileAssets.tokenInfoTitle')
        };
    },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        icon() {
            return this.tokenDetail.urlIcon || this.token.icon || defaultTokenIcon;
        }
    },
    watch: {
        _tokenDetail() {
            if (this.isNeedFetch) {
                return;
            }
            this.tokenDetail = this._tokenDetail;
        }
    },
    methods: {
        goToTokenDetail() {
            const l = `${ getExplorerLink(this.$i18n.locale) }token/${ this.token.tokenId }`;
            openUrl(l);
        },
        tabClick(name) {
            this.tabName = name;
        },
        fetchTokenDetail() {
            tokenDetail({ tokenId: this.token.tokenId }).then(data => {
                this.tokenDetail = data;
                if (data.links) {
                    for (const key in data.links) {
                        this.tokenDetail[`${ key }Link`] = data.links[key] || [];
                    }
                }
                this.tokenDetail.ttype = this.tokenDetail.gateway
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
                this.tokenDetail.explorerLink = this.tokenDetail.explorerLink
                    || (this.tokenDetail.gateway ? null : [getExplorerLink(this.$i18n.locale)]);
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
@import "~h5Components/confirm/moreTabConfirm.scss";

.click-able {
    margin-right: 10px;
}
.tab-content {
    height: 270px;
}
</style>
