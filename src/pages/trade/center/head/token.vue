<template>
    <div ref="tContainer" v-click-outside="hideToken" class="token">
        <div class="token-img">
            <img v-show="ftokenIcon" :src="ftokenIcon"/>
            <div v-show="activeTxPairIsClose" class="close"></div>
        </div>

        <div class="t-item __pointer">
            <span class="symbol" @click="showToken('ftoken')">
                {{ ftokenDetail ? ftokenDetail.symbol : '' }}
            </span> /
            <span class="symbol ttoken" @click="showToken('ttoken')">
                {{ ttokenDetail ? ttokenDetail.symbol : '' }}
            </span>
            <operator></operator>
        </div>

        <div v-show="showTokenType" class="detail" :class="{'right': showTokenType === 'ttoken'}">
            <div @click="goNetToken(tokenDetail.tokenId)" class="token-row __pointer">
                <span class="token-title">{{ $t('trade.head.tokenName') }} :</span>
                <span class="active">{{ tokenDetail.name || '--' }}</span>
            </div>
            <div class="token-row __pointer">
                <span class="token-title">{{ $t('trade.head.originalSymbol') }} :</span>
                <span>{{ tokenDetail.originalSymbol || '--' }}</span>
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.tokenId') }} :</span>
                {{ tokenDetail.tokenId || '--' }}
            </div>
            <div @click="goNetAddr(tokenDetail.publisher)" class="token-row __pointer">
                <span class="token-title">{{ $t('trade.head.publisher') }} :</span>
                <span class="active">{{ tokenDetail.publisher || '--' }}</span>
            </div>
            <div class="token-row __pointer">
                <span class="token-title">{{ $t('trade.head.gateway') }} :</span>
                <span>{{ tokenDetail.gateway ? tokenDetail.gateway.name || '--' : '--' }}</span>
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.tokenDigit') }} :</span>
                {{ tokenDetail.tokenDecimals || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.publisherDate') }} :</span>
                {{ tokenDetail.publisherDate || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.total') }} :</span>
                {{ tokenDetail.totalSupply || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.website') }} :</span>
                {{ tokenDetail.website || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.explorer') }} :</span>
                {{ tokenDetail.links && tokenDetail.links.explorer ? tokenDetail.links.explorer : '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.type') }} :</span>
                {{ tokenDetail.tokenType || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.overview') }} :</span>
                <!-- {{ tokenDetail.overview && tokenDetail.overview[$i18n.locale] ? tokenDetail.overview[$i18n.locale] : '--' }} -->
                {{ tokenDetail.overview ? tokenDetail.overview.en || '--' : '--'}}
            </div>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';
import ellipsisAddr from 'utils/ellipsisAddr';
import operator from './operator.vue';
import BigNumber from 'utils/bigNumber';
import openUrl from 'utils/openUrl';

export default {
    components: { operator },
    data() {
        return { showTokenType: '' };
    },
    computed: {
        closeMarket() {
            return this.$store.state.exchangeMarket.marketClosed;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        activeTxPairIsClose() {
            if (!this.activeTxPair) {
                return false;
            }
            return this.closeMarket.find(v => v.symbol === this.activeTxPair.symbol);
        },
        defaultTokens() {
            return this.$store.state.ledger.tokenInfoMaps;
        },
        ttokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        ftokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        },
        ftokenIcon() {
            if (!this.ftokenDetail) {
                return '';
            }

            if (this.ftokenDetail.urlIcon) {
                return this.ftokenDetail.urlIcon;
            }

            const tokenId = this.ftokenDetail.tokenId;
            const defaultToken = this.defaultTokens[tokenId];

            if (defaultToken && defaultToken.icon) {
                return defaultToken.icon;
            }
            return '';
        },
        tokenDetail() {
            if (!this.showTokenType) {
                return {};
            }

            let detail = this.$store.state.exchangeTokens.ftoken;
            if (this.showTokenType === 'ttoken') {
                detail = this.$store.state.exchangeTokens.ttoken;
            }

            if (!detail) {
                return {};
            }

            detail = Object.assign({}, detail);
            detail.publisher = ellipsisAddr(detail.publisher);
            detail.tokenType = detail.reissue === 1 ? this.$t('trade.head.tokenType0')
                : detail.reissue === 2 ? this.$t('trade.head.tokenType1') : '';
            detail.publisherDate = detail.publisherDate ? date(detail.publisherDate * 1000, 'zh') : '';
            detail.totalSupply = detail.totalSupply ? BigNumber.toBasic(detail.totalSupply, detail.tokenDecimals || 0) : '';

            return detail;
        }
    },
    methods: {
        showToken(type) {
            this.showTokenType = type;
        },
        hideToken(e) {
            const tContainer = this.$refs.tContainer;
            if (!tContainer
                || e.target === tContainer
                || tContainer.contains(e.target)) {
                return;
            }
            this.showTokenType = '';
        },
        goNetToken(tokenId) {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            openUrl(`${ process.env.viteNet }${ locale }token/${ tokenId }`);
        },
        goNetAddr(addr) {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            openUrl(`${ process.env.viteNet }${ locale }account/${ addr }`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.token {
    position: relative;
    white-space: nowrap;
    max-width: 250px;

    .token-img {
        position: absolute;
        top: 15px;
        display: inline-block;
        img {
            display: inline-block;
            width: 28px;
            height: 28px;
            border-radius: 28px;
            border: 1px solid rgba(212,222,231,1);
        }
        .close {
            position: absolute;
            display: inline-block;
            width: 28px;
            height: 28px;
            border-radius: 28px;
            background: rgba(0,0,0,0.5);
            z-index: 100;
            left: 0;
            &:after {
                position: absolute;
                top: 13px;
                right: -6px;
                content: ' ';
                display: inline-block;
                width: 14px;
                height: 14px;
                border-radius: 12px;
                background: url('~assets/imgs/tx-pair-close.svg');
                background-size: 100% 100%;
            }
        }
    }

    .t-item {
        display: inline-block;
        font-size: 12px;
        @include font-family-bold();
        font-weight: 600;
        color: rgba(29, 32, 36, 1);
        line-height: 14px;
        margin-left: 36px;

        .symbol {
            position: relative;
            white-space: nowrap;
            line-height: 20px;
            &:first-child {
                font-size: 16px;
            }
            &.ttoken {
                color: #5E6875;
            }
        }
    }

    .detail {
        position: absolute;
        left: 35px;
        top: 35px;
        z-index: 1;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 5px 20px 0 rgba(176, 192, 237, 0.69);
        padding: 10px;
        @include font-family-normal();
        font-weight: 400;
        font-size: 11px;
        width: 270px;

        &.right {
            left: 105px;
        }

        &::after {
            position: absolute;
            top: -12px;
            left: 20px;
            content: ' ';
            display: inline-block;
            border: 6px solid transparent;
            border-bottom: 6px solid #fff;
        }

        .token-row {
            line-height: 23px;
            color: rgba(29, 32, 36, 0.7);
            word-break: break-word;
            white-space: normal;

            .active {
                color: rgba(0, 122, 255, 1);
            }

            .token-title {
                color: rgba(94, 104, 117, 0.7);
                display: inline-block;
            }
        }
    }
}
</style>
