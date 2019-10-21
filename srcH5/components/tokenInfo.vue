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
                        this.tokenDetail[`${ key }Link`] = data.links[key] && data.links[key].length
                            ? data.links[key][0] : '';
                    }
                }
                this.tokenDetail.ttype = this.tokenDetail.gateway
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
                this.tokenDetail.explorerLink = this.tokenDetail.explorerLink
                    || (this.tokenDetail.gateway ? null : getExplorerLink(this.$i18n.locale));
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

.tab-content {
    height: 270px;
}
</style>
