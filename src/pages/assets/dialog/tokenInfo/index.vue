<template lang="pug">
extends /components/dialog/base.pug
block head
    .head
        img.icon(:src="token.icon||getIcon(token.tokenId)")
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
            .label {{$t("tokenCard.tokenInfo.labels.tokenId")}}:
            div.click-able(@click="goToTokenDetail") {{token.tokenId}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.address")}}:
            div {{token.owner}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.tokenName")}}:
            div {{token.tokenName}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.totalSupply")}}:
            div {{token.totalSupply}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.decimals")}}:
            div {{token.decimals}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.isReIssuable")}}:
            div {{$t("tokenCard.tokenInfo.reIssuable")[token.isReIssuable]}}
        .content__item
            .label {{$t("tokenCard.tokenInfo.labels.time")}}:
            div
    .tab-content(v-if="tabName==='gate'")
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.officalNet")}}:
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.introduction")}}:
        .content__item(v-if="token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.token")}}:
        .content__item(v-if="!token.gateInfo.url")
            .label {{$t("tokenCard.gateInfo.nodeDesc")}}:
        .content__item
            .label {{$t("tokenCard.gateInfo.setting")}}:
            viteInput.gate-url(:placeholder="$t('tokenCard.gateInfo.settingPlaceholder')" :disabled="token.type==='OFFICAL_GATE'" v-model="url")
            .btn( @click="save" v-if="token.type!=='OFFICAL_GATE'") {{$t('tokenCard.tokenInfo.saveGate')}}
    .tab-content.no-padding(v-if="tabName==='deposit'")
        Tb(:type="'deposit'" :token="token" :key="`deposit_${token.tokenId}`")
    .tab-content.no-padding(v-if="tabName==='withdraw'")
        Tb(:type="'withdraw'" :token="token" :key="`withdraw_${token.tokenId}`")
</template>

<script>
import { gateStorage, getChargeAddr } from 'services/gate';
import { getTokenIcon } from 'utils/tokenParser';
import { getExplorerLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import Tb from './tb';
import viteInput from 'components/viteInput';
import { throttle } from 'lodash';


export default {
    components: { Tb, viteInput },
    props: {
        token: {
            type: Object,
            required: true
        },
        initTabName: { type: String, default: 'tokenInfo' }
    },
    data() {
        return {
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
        goToTokenDetail() {
            const l = `${ getExplorerLink() }/token/${ this.token.tokenId }`;
            openUrl(l);
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
    height: 350px;
    padding: 30px;
    position: relative;
    overflow: scroll;
    &.no-padding {
        padding: 0;
    }
    .content__item {
        font-size: 12px;
        @include font-family-normal();
        min-height: 40px;
        display: flex;
        text-align: left;
        align-items: center;
        color: rgba(29, 32, 36, 1);
        div {
            display: flex;
            align-items: center;
        }
        :last-child {
            word-break: break-word;
        }
        .label {
            color: rgba(94, 104, 117, 0.58);
            margin-right: 10px;
            word-break: keep-all;
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

