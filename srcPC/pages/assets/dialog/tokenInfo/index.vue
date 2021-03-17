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
        .tab__item(@click="tabClick('tokenInfo')" :class="{active:tabName==='tokenInfo'}") {{$t("tokenCard.tokenInfo.tabName")}}
        .tab__item(v-if="token.type!=='NATIVE'" @click="tabClick('gate')" :class="{active:tabName==='gate'}") {{$t("tokenCard.gateInfo.tabName")}}
        .tab__item(v-if="token.type!=='NATIVE'" @click="tabClick('deposit')" :class="{active:tabName==='deposit'}") {{$t("tokenCard.depositRecord.tabName")}}
        .tab__item(v-if="token.type!=='NATIVE'" @click="tabClick('withdraw')" :class="{active:tabName==='withdraw'}") {{$t("tokenCard.withdrawRecord.tabName")}}

block originContent
    .tab-content(v-if="tabName==='tokenInfo'")
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
            div(v-if="!tokenDetail.websiteLink || !tokenDetail.websiteLink.length") {{'--'}}
            div(v-else)
                span.click-able(v-for="(link, i) in tokenDetail.websiteLink" :key="i" @click="openUrl(link)") {{ link || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.whitePaper")}}:
            div(v-if="!tokenDetail.whitepaperLink || !tokenDetail.whitepaperLink.length") {{'--'}}
            div(v-else)
                span.click-able(v-for="(link, i) in tokenDetail.whitepaperLink" :key="i" @click="openUrl(link)") {{ link || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.explorer")}}:
            div(v-if="!tokenDetail.explorerLink || !tokenDetail.explorerLink.length") {{'--'}}
            div(v-else)
                span.click-able(v-for="(link, i) in tokenDetail.explorerLink" :key="i" @click="openUrl(link)") {{link || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.github")}}:
            div(v-if="!tokenDetail.githubLink || !tokenDetail.githubLink.length") {{'--'}}
            div(v-else)
                span.click-able(v-for="(link, i) in tokenDetail.githubLink" :key="i" @click="openUrl(link)") {{ link || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.media")}}:
            div
                img.media-icon(src="~assets/imgs/facebook.svg" v-show="tokenDetail.facebookLink" @click="openUrl(tokenDetail.facebookLink)")
                img.media-icon(src="~assets/imgs/twitter.svg" v-show="tokenDetail.twitterLink" @click="openUrl(tokenDetail.twitterLink)")
                img.media-icon(src="~assets/imgs/telegram.svg" v-show="tokenDetail.telegramLink" @click="openUrl(tokenDetail.telegramLink)")
    .tab-content(v-if="tabName==='gate'")
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.name")}}:
            div {{ gateInfo.name }}
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.officalNet")}}:
            div.click-able(@click="openUrl(gateInfo.websiteLink)") {{ gateInfo.websiteLink }}
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.introduction")}}:
            div {{ gateIntroduction }}
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.customer")}}:
            div.click-able(v-if="gateInfo.serviceSupport")(@click="openUrl(gateInfo.serviceSupport)") {{ gateSupport }}
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.privacy")}}:
            div.click-able(v-if="gatePolicy")(@click="openUrl(gatePolicy)") {{$t("tokenCard.gateInfo.clickPrivacy", {gate: gateInfo.name})}}
        .content__item(v-if="!token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.nodeDesc")}}:
            div {{ $t("tokenCard.gateInfo.nodeDescStr") }}
        .content__item.center(v-if="token.type==='OFFICAL_GATE'")
            .label {{$t("tokenCard.gateInfo.setting")}}:
            viteInput.gate-url(:placeholder="$t('tokenCard.gateInfo.settingPlaceholder')" :disabled="true" v-model="url")
        .content__item.center(v-if="token.type!=='OFFICAL_GATE' && (url || canEditGateURL)")
            .label {{$t("tokenCard.gateInfo.setting")}}:
            viteInput.gate-url(:placeholder="$t('tokenCard.gateInfo.settingPlaceholder')" :disabled="!canEditGateURL" v-model="url")
            .btn( @click="save" v-if="canEditGateURL") {{$t('tokenCard.tokenInfo.saveGate')}}
    .tab-content.no-padding(v-if="tabName==='deposit'")
        select-network(v-model="selectedNetwork" :list="multiNetwork" v-if="multiNetwork && multiNetwork.length" class="select-network")
        Tb(:type="'deposit'" :token="token" :key="`deposit_${token.tokenId}_${selectedNetwork}`" :gateInfo="gateInfoNew")
    .tab-content.no-padding(v-if="tabName==='withdraw'")
        select-network(v-model="selectedNetwork" :list="multiNetwork" v-if="multiNetwork && multiNetwork.length" class="select-network")
        Tb(:type="'withdraw'" :token="token" :key="`withdraw_${token.tokenId}_${selectedNetwork}`" :gateInfo="gateInfoNew")
</template>

<script>
import { tokenDetail } from 'services/trade';
import { gateStorage, getChargeAddr } from 'pcServices/gate';
import { getTokenIcon } from 'utils/tokenParser';
import { getExplorerLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import BigNumber from 'utils/bigNumber';
import Tb from './tb';
import viteInput from 'components/viteInput';
import throttle from 'lodash/throttle';
import selectNetwork from '../selectNetwork';


export default {
    components: { Tb, viteInput, selectNetwork },
    props: {
        token: {
            type: Object,
            required: true
        },
        initTabName: { type: String, default: 'tokenInfo' }
    },
    beforeMount() {
        this.fetchTokenDetail();
    },
    data() {
        return {
            tokenDetail: {},
            tabName: this.initTabName || 'tokenInfo',
            urlCache: this.token.gateInfo.url,
            dTitle: this.$t('tokenCard.tokenInfo.title', { tokenSymbol: this.token.tokenSymbol }),
            dWidth: 'wide',
            saveLoading: false,
            selectedNetwork: 0
        };
    },
    computed: {
        canEditGateURL() {
            return !!this.$store.state.env.gate;
        },
        gateName() {
            if (this.token.type === 'NATIVE') return '';
            if (this.token.gateInfo.gateway) return this.token.gateInfo.gateway;
            if (this.token.gateInfo.url) return this.$t('tokenCard.gateInfo.selfdefined');
            return '';
        },
        gateInfo() {
            if (!this.tokenDetail || !this.tokenDetail.gateway) {
                return {};
            }
            const gateway = this.tokenDetail.gateway;
            if (gateway.links) {
                for (const key in gateway.links) {
                    gateway[`${ key }Link`] = gateway.links[key] && gateway.links[key].length
                        ? gateway.links[key][0] : '';
                }
            }
            return gateway;
        },
        /*
            Get gateInfo from props token.gateInfo, change gateInfo by this.selectedNetwork.
            The gateInfoNew is from parent component, the origin data is from account state.
            To make litte change for code, I decided to get gateInfo from prarent data. All multiNetwork logic is on state.account.
            We have only used one data of gateInfoNew, that is gatewayUrl. Other Info can got from gateInfo above.

            gateInfoExample:
            {
                decimal: 18
                icon: ""
                name: "Ether"
                platform: "ETH"
                symbol: "ETH"
                tokenAddress: null
                tokenCode: "1"
                tokenIndex: null,
                url: ''
            }
         */
        gateInfoNew() {
            if (this.multiNetwork && this.multiNetwork.length) {
                return this.multiNetwork[this.selectedNetwork];
            }
            return this.token.gateInfo && this.token.gateInfo.mappedToken || {};
        },
        gateIntroduction() {
            if (!this.gateInfo.overview) {
                return '';
            }
            if (this.$i18n.locale === 'zh') {
                return this.gateInfo.overview.zh || this.gateInfo.overview.en;
            }
            return this.gateInfo.overview.en;
        },
        gatePolicy() {
            if (!this.gateInfo.policy) {
                return;
            }
            if (this.$i18n.locale === 'zh') {
                return this.gateInfo.policy.zh || this.gateInfo.policy.en;
            }
            return this.gateInfo.policy.en;
        },
        gateSupport() {
            if (!this.gateInfo.serviceSupport) {
                return '';
            }

            const support = this.gateInfo.serviceSupport;
            if (this.isEmail(support)) {
                return support;
            }
            return this.$t('tokenCard.gateInfo.clickCustomer');
        },

        url: {
            get: function () {
                if (this.token.type === 'OFFICAL_GATE') {
                    return this.token.gateInfo.url;
                }
                return this.urlCache;
            },
            set: function (val) {
                this.urlCache = val.trim();
            }
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        multiNetwork() {
            return this.token.gateInfo.multiNetwork;
        }
    },
    methods: {
        goToTokenDetail() {
            const l = `${ getExplorerLink(this.$i18n.locale) }token/${ this.token.tokenId }`;
            openUrl(l);
        },
        isEmail(url) {
            return /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(url);
        },
        openUrl(url) {
            url && openUrl(url);
        },

        getIcon(id) {
            return getTokenIcon(id);
        },
        save: throttle(function () {
            const ok = /(https:\/\/)?([A-Za-z0-9_\-]\.[A-Za-z0-9_\-])+(\/[A-Za-z0-9_\-]+)*/.test(this.urlCache);
            if (!ok) {
                this.$toast(this.$t('tokenCard.nodeErr'));
                return;
            }
            if (this.saveLoading) {
                return;
            }
            this.saveLoading = true;
            getChargeAddr({ addr: this.defaultAddr, tokenId: this.token.tokenId },
                this.url)
                .then(() => {
                    gateStorage.bindToken(this.token.tokenId, { gateInfo: { url: this.url } });
                    this.$toast(this.$t('tokenCard.saveSuccess'));
                })
                .catch(e => {
                    this.$toast(this.$t('tokenCard.nodeErr'));
                    console.error(e);
                })
                .finally(() => (this.saveLoading = false));
        }, 1000),
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
                this.tokenDetail.ttype = (this.tokenDetail.gateway || this.gateName)
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
                this.tokenDetail.explorerLink = this.tokenDetail.explorerLink
                    || (this.tokenDetail.gateway ? [] : [getExplorerLink(this.$i18n.locale)]);
                this.tokenDetail.showTotalSupply = BigNumber.toBasic(this.tokenDetail.totalSupply, this.tokenDetail.tokenDecimals);
            }).catch(err => {
                console.warn(err);
            });
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
@import "~pcComponents/confirm/moreTabConfirm.scss";

.click-able {
    margin-right: 10px;
}

.select-network {
    padding: 0 20px 20px 20px;
}
</style>
