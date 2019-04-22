<template>
    <div ref="tContainer" v-click-outside="hideToken" class="token">
        <div class="t-item __pointer" @click="showToken('ftoken')">
            <div class="t-icon">
                <img v-show="ftokenIcon" :src="ftokenIcon"/>
                {{ ftokenDetail ? ftokenDetail.tokenShow : '' }}
            </div>
            <div class="id __ellipsis">
                {{ ftokenDetail ? ftokenDetail.tokenId : '' }}
            </div>
        </div>
        <div class="t-item">
            <div class="line">/</div>
            <div class="id line">/</div>
        </div>
        <div class="t-item __pointer" @click="showToken('ttoken')">
            <div class="t-icon">
                <img v-show="ttokenIcon" :src="ttokenIcon"/>
                {{ ttokenDetail ? ttokenDetail.tokenShow : '' }}
            </div>
            <div class="id __ellipsis">
                {{ ttokenDetail ? ttokenDetail.tokenId : '' }}
            </div>
        </div>
        <div v-show="showTokenType" class="detail" :class="{'right': showTokenType === 'ttoken'}">
            <div @click="goNetToken(tokenDetail.tokenId)" class="token-row __pointer">
                <span class="token-title">{{ $t('trade.head.tokenName') }} :</span>
                <span class="active">{{ tokenDetail.tokenName || '--' }}</span>
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
                <span>{{ tokenDetail.gateway || '--' }}</span>
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.tokenDigit') }} :</span>
                {{ tokenDetail.tokenDigit || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.publisherDate') }} :</span>
                {{ tokenDetail.publisherDate || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('trade.head.total') }} :</span>
                {{ tokenDetail.total || '--' }}
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
                {{ tokenDetail.overview && tokenDetail.overview[$i18n.locale] ? tokenDetail.overview[$i18n.locale] : '--' }}
            </div>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';
import ellipsisAddr from 'utils/ellipsisAddr';
import getTokenIcon from 'utils/getTokenIcon';

export default {
    data() {
        return { showTokenType: '' };
    },
    computed: {
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
            return getTokenIcon(tokenId);
        },
        ttokenIcon() {
            if (!this.ttokenDetail) {
                return '';
            }

            if (this.ttokenDetail.urlIcon) {
                return this.ttokenDetail.urlIcon;
            }

            const tokenId = this.ttokenDetail.tokenId;
            const defaultToken = this.defaultTokens[tokenId];

            if (defaultToken && defaultToken.icon) {
                return defaultToken.icon;
            }
            return getTokenIcon(tokenId);
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
            detail.tokenType = detail.tokenType === 0 ? this.$t('trade.head.tokenType0')
                : detail.tokenType === 1 ? this.$t('trade.head.tokenType1') : '';
            detail.publisherDate = detail.publisherDate ? date(detail.publisherDate, 'zh') : '';

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
            window.open(`${ process.env.viteNet }${ locale }token/${ tokenId }`);
        },
        goNetAddr(addr) {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${ process.env.viteNet }${ locale }account/${ addr }`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.token {
    position: relative;
    white-space: nowrap;

    .t-item {
        max-width: 95px;
        overflow: hidden;
        display: inline-block;
        font-size: 14px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: rgba(29, 32, 36, 1);

        .t-icon {
            white-space: nowrap;
            font-size: 18px;
            img {
                width: 28px;
                height: 28px;
                border-radius: 18px;
                margin-bottom: -7px;
            }
        }

        .line {
            margin-bottom: 4px;
        }

        .id {
            font-family: $font-normal, arial, sans-serif;
            font-size: 12px;
            font-weight: 400;
            color: $blue;
            line-height: 14px;
            margin-top: 10px;
            &.line {
                color: rgba(189,193,209,1);
                margin-bottom: 0;
            }
        }
    }

    .detail {
        position: absolute;
        left: 0;
        top: 50px;
        z-index: 1;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 5px 20px 0 rgba(176, 192, 237, 0.69);
        padding: 10px;
        font-family: $font-normal, arial, sans-serif;
        font-weight: 400;
        font-size: 11px;

        &.right {
            left: 100px;
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

@media only screen and (max-width: 1400px) {
    .token {
        .detail.right {
            left: 200px;
        }
        .t-item {
            max-width: 100%;
        }
    }
}
</style>
