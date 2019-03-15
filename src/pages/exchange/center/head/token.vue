<template>
    <div ref="tContainer" v-click-outside="hideToken" class="token">
        <div class="t-item __pointer" @click="showToken('ftoken')">
            <div class="t-icon">
                <img :src="ftokenIcon"/>
                {{ ftokenDetail ? ftokenDetail.tokenShow : '' }}
            </div>
            <div class="id __ellipsis">
                {{ ftokenDetail ? ftokenDetail.tokenId : '' }}
            </div>
        </div>
        <div class="t-item">
            <div class="line">/</div>
            <div class="id">/</div>
        </div>
        <div class="t-item __pointer" @click="showToken('ttoken')">
            <div class="t-icon"><img :src="ttokenIcon"/>
                {{ ttokenDetail ? ttokenDetail.tokenShow : '' }}
            </div>
            <div class="id __ellipsis">
                {{ ttokenDetail ? ttokenDetail.tokenId : '' }}
            </div>
        </div>
        <div v-show="showTokenType" class="detail" :class="{'right': showTokenType === 'ttoken'}">
            <div @click="goNetToken(tokenDetail.tokenId)" class="token-row __pointer">
                <span class="token-title">{{ $t('exchange.head.tokenName') }} :</span>
                <span class="active">{{ tokenDetail.tokenName || '--' }}</span>
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.tokenShow') }} :</span>
                {{ tokenDetail.tokenShow || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.tokenId') }} :</span>
                {{ tokenDetail.tokenId || '--' }}
            </div>
            <div @click="goNetAddr(tokenDetail.publisher)" class="token-row __pointer">
                <span class="token-title">{{ $t('exchange.head.publisher') }} :</span>
                <span class="active">{{ tokenDetail.publisher || '--' }}</span>
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.total') }} :</span>
                {{ tokenDetail.total || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.tokenDigit') }} :</span>
                {{ tokenDetail.tokenDigit || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.publisherDate') }} :</span>
                {{ tokenDetail.publisherDate || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.type') }} :</span>
                {{ tokenDetail.tokenType || '--' }}
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
        return {
            showTokenType: ''
        };
    },
    computed: {
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
            return getTokenIcon(this.ftokenDetail.tokenId);
        },
        ttokenIcon() {
            if (!this.ttokenDetail) {
                return '';
            }
            return getTokenIcon(this.ttokenDetail.tokenId);
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
            detail.tokenType = detail.tokenType === 0 ? this.$t('exchange.head.tokenType0') :
                detail.tokenType === 1 ? this.$t('exchange.head.tokenType1') : '';
            detail.publisherDate = detail.publisherDate ? date(detail.publisherDate, 'zh') : '';
            return detail;
        }
    },
    methods: {
        showToken(type) {
            this.showTokenType = type;
        },
        hideToken(e) {
            let tContainer = this.$refs.tContainer;
            if (!tContainer || 
                e.target === tContainer ||
                tContainer.contains( e.target )) {
                return;
            }

            this.showTokenType = '';
        },
        goNetToken(tokenId) {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${process.env.viteNet}${locale}token/${tokenId}`);
        },
        goNetAddr(addr) {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${process.env.viteNet}${locale}account/${addr}`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.token {
    position: relative;
    flex-basis: 180px;
    white-space: nowrap;
    .t-item {
        max-width: 85px;
        overflow: hidden;
        display: inline-block;
        font-size: 14px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: rgba(29,32,36,1);
        .t-icon {
            white-space: nowrap;
            font-size: 20px;
            img {
                width: 20px;
                height: 20px;
                border-radius: 20px;
                margin-bottom: -3px;
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
        }
    }

    .detail {
        position: absolute;
        left: 0;    
        top: 50px;
        z-index: 1;
        background: rgba(255,255,255,1);
        box-shadow: 0px 5px 20px 0px rgba(176,192,237,0.69);
        padding: 10px;
        font-family: $font-normal, arial, sans-serif;
        font-weight: 400;
        font-size: 11px;
        &.right {
            &:after {
                left: 130px;
            }
        }
        &:after {
            position: absolute;
            top: -12px;
            left: 40px;
            content: ' ';
            display: inline-block;
            border: 6px solid transparent;
            border-bottom: 6px solid #fff;
        }
        .token-row {
            line-height: 23px;
            color: rgba(29,32,36,0.7);
            .active {
                color: rgba(0,122,255,1);
            }
            .token-title {
                color: rgba(94,104,117,0.7);;
                display: inline-block;
            }
        }
    }
}
</style>
