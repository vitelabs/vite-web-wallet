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
            div {{tokenDetail.name}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.tokenId")}}:
            div.click-able(@click="goToTokenDetail") {{token.tokenId}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.overview")}}:
            div {{ tokenDetail.overview && tokenDetail.overview[$i18n.locale] ? tokenDetail.overview[$i18n.locale] : '--' }}
                span.click-able.view-more(v-if="tokenDetail.overview && tokenDetail.overviewLink" @click="openUrl(tokenDetail.overviewLink)") {{ $t("tokenCard.tokenInfo.labels.viewmore") }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.totalSupply")}}:
            div {{toBasic(token.totalSupply)}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.type")}}:
            .div {{ tokenDetail.ttype || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.gate")}}:
            div.click-able(@click="openUrl(tokenDetail.gateway ? tokenDetail.gateway.website : null)") {{tokenDetail.gateway ? tokenDetail.gateway.name || '--' : '--'}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.website")}}:
            div.click-able(@click="openUrl(tokenDetail.website)") {{ tokenDetail.website || '--' }}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.whitePaper")}}:
            div.click-able(@click="openUrl(tokenDetail.whitepaperLink)") {{ tokenDetail.whitepaper || '--' }}
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
                span.twitter(v-show="tokenDetail.twitterLink")
                span.facebook(v-show="tokenDetail.facebookLink")
    .tab-content(v-if="tabName==='gate'")
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.name")}}:
            div {{ token.gateInfo.gateway }}
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.officalNet")}}:
            div.click-able(@click="goToGateOffical") {{ token.gateInfo.offical }}
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.introduction")}}:
            div {{ gateIntroduction }}
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.customer")}}:
            div.click-able(v-if="token.gateInfo.customer")(@click="goToGateCustomer") {{ getCustomer() }}
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.privacy")}}:
            div.click-able(v-if="token.gateInfo.privacy")(@click="goToGatePrivacy") {{$t("tokenCard.gateInfo.clickPrivacy", {gate: token.gateInfo.gateway})}}
        .content__item(v-if="!token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.nodeDesc")}}:
            div {{ $t("tokenCard.gateInfo.nodeDescStr") }}
        .content__item.center
            .label {{$t("tokenCard.gateInfo.setting")}}:
            viteInput.gate-url(:placeholder="$t('tokenCard.gateInfo.settingPlaceholder')" :disabled="token.type==='OFFICAL_GATE'" v-model="url")
            .btn( @click="save" v-if="token.type!=='OFFICAL_GATE'") {{$t('tokenCard.tokenInfo.saveGate')}}
    .tab-content.no-padding(v-if="tabName==='deposit'")
        Tb(:type="'deposit'" :token="token" :key="`deposit_${token.tokenId}`")
    .tab-content.no-padding(v-if="tabName==='withdraw'")
        Tb(:type="'withdraw'" :token="token" :key="`withdraw_${token.tokenId}`")
</template>

<script>
import { tokenDetail } from 'services/trade';
import { gateStorage, getChargeAddr } from 'services/gate';
import { getTokenIcon } from 'utils/tokenParser';
import { getExplorerLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import Tb from './tb';
import viteInput from 'components/viteInput';
import { throttle } from 'lodash';
import bn from 'utils/bigNumber';

export default {
    components: { Tb, viteInput },
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
            saveLoading: false
        };
    },
    computed: {
        gateName() {
            if (this.token.type === 'NATIVE') return '';
            if (this.token.gateInfo.gateway) return this.token.gateInfo.gateway;
            if (this.token.gateInfo.url) return this.$t('tokenCard.gateInfo.selfdefined');
            return '';
        },
        gateIntroduction() {
            if (this.$i18n.locale === 'zh') {
                return this.token.gateInfo.introduction;
            }
            return this.token.gateInfo.introductionEn;
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
        }
    },
    methods: {
        toBasic(v) {
            return bn.toBasic(v, this.token.decimals, 0);
        },
        goToTokenDetail() {
            const l = `${ getExplorerLink() }token/${ this.token.tokenId }`;
            openUrl(l);
        },
        goToGateOffical() {
            openUrl(this.token.gateInfo.offical);
        },
        goToGatePrivacy() {
            openUrl(this.token.gateInfo.privacy);
        },
        isEmail(url) {
            return /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(url);
        },
        goToGateCustomer() {
            const customer = this.$i18n.locale === 'zh' ? this.token.gateInfo.customer : this.token.gateInfo.customerEn;
            if (this.isEmail(customer)) {
                openUrl(`mailto:${ customer }`);
                return;
            }
            openUrl(customer);
        },
        getCustomer() {
            const customer = this.$i18n.locale === 'zh' ? this.token.gateInfo.customer : this.token.gateInfo.customerEn;
            if (this.isEmail(customer)) {
                return customer;
            }
            return this.$t('tokenCard.gateInfo.clickCustomer');
        },
        getIcon(id) {
            return getTokenIcon(id);
        },
        save: throttle(function () {
            const formatRight = /(https:\/\/)?([A-Za-z0-9_\-]\.[A-Za-z0-9_\-])+(\/[A-Za-z0-9_\-]+)*/.test(this.urlCache);
            if (!formatRight) {
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
                        this.tokenDetail[`${ key }Link`] = data.links[key];
                    }
                }
                this.tokenDetail.ttype = tokenDetail.gateway
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
                this.tokenDetail.explorerLink = this.tokenDetail.explorerLink
                    || (this.tokenDetail.gateway ? null : getExplorerLink());
            }).catch(err => {
                console.warn(err);
            });
        },
        openUrl(url) {
            url && openUrl(url);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.head {
    border-bottom: 1px solid rgba(212, 222, 231, 1);
    box-sizing: border-box;
    padding: 20px 30px;
    display: flex;
    background: rgba(0, 122, 255, 0.05);
    .head_info {
        display: flex;
        flex-direction: column;
    }
    .gate_info {
        font-size: 12px;
        color: #007aff;
        background: rgba(0, 122, 255, 0.06);
        padding: 0 4px;
        align-self: flex-start;
        border-radius: 2px;
        margin-left: 6px;
    }
    .icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border: 1px solid rgba(212,222,231,1);
        border-radius: 40px;
    }
    &__name {
        @include font-family-bold();
        color: rgba(29, 32, 36, 1);
        font-size: 14px;
        line-height: 18px;
        &__gate {
            color: #007aff;
            background-color: rgba(0, 122, 255, 0.06);
            @include font-family-normal();
            font-size: 12px;
            height: 20px;
            padding: 0 4px;
            margin-left: 6px;
            line-height: 20px;
            display: flex;
        }
    }
    &__symbol {
        @include font-family-normal();
        font-size: 12px;
        color: rgba(94, 104, 117, 1);
        margin-top: 8px;
        line-height: 16px;
    }
}
.tab {
    padding: 0 30px;
    height: 40px;
    display: flex;
    border-bottom: 1px solid #d4dee7;
    flex-shrink: 0;
    &__item {
        @include font-family-bold();
        font-size: 12px;
        color: rgba(189, 193, 209, 1);
        height: 100%;
        box-sizing: border-box;
        margin-right: 40px;
        color: #5e6875;
        display: flex;
        align-items: center;
        cursor: pointer;
        &.active {
            border-bottom: 2px solid #007aff;
        }
    }
}
.tab-content {
    box-sizing: border-box;
    height: 470px;
    padding: 30px;
    position: relative;
    overflow: scroll;
    &.no-padding {
        padding: 0;
    }
    .content__item {
        font-size: 12px;
        @include font-family-normal();
        line-height: 16px;
        margin-bottom: 20px;
        display: flex;
        text-align: left;
        color: rgba(94,104,117,1);
        .view-more {
            margin-left: 6px;
        }
        &.center {
            align-items: center;
            div {
                display: flex;
                align-items: center;
            }
        }
        :last-child {
            word-break: break-word;
        }
        .label {
            color: rgba(94,104,117,0.58);
            margin-right: 10px;
            word-break: keep-all;
            white-space: nowrap;
        }
        .click-able {
            color: #007aff;
            cursor: pointer;
        }
        .btn {
            cursor: pointer;
            user-select: none;
            height: 34px;
            line-height: 34px;
            border-radius: 2px;
            font-size: 14px;
            @include font-family-bold();
            padding: 0 20px;
            white-space: nowrap;
            margin-left: 23px;
            background: rgba(0, 122, 255, 1);
            color: rgba(255, 255, 255, 1);
            &.unuse {
                background: rgba(191, 191, 191, 1);
            }
        }
    }
}
</style>

