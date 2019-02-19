<template>
    <div v-click-outside="hideToken" class="token">
        <div class="t-item __pointer" @click="showToken('ftoken')">
            <div class="t-icon">
                <img :src="ftokenIcon"/>
                {{ activeTxPair && activeTxPair.ftokenShow ? activeTxPair.ftokenShow : '' }}
            </div>
            <div class="id __ellipsis">
                {{ activeTxPair && activeTxPair.ftoken ? activeTxPair.ftoken : '' }}
            </div>
        </div>
        <div class="t-item">
            <div class="line">/</div>
            <div class="id">/</div>
        </div>
        <div class="t-item __pointer" @click="showToken('ttoken')">
            <div class="t-icon"><img :src="ttokenIcon"/>
                {{ activeTxPair && activeTxPair.ttokenShow ? activeTxPair.ttokenShow : '' }}
            </div>
            <div class="id __ellipsis">
                {{ activeTxPair && activeTxPair.ttoken ? activeTxPair.ttoken : '' }}
            </div>
        </div>
        <div v-show="showTokenType" class="detail">
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.tokenName') }} :</span>{{ tokenDetail.tokenName || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.tokenShow') }} :</span>{{ tokenDetail.tokenShow || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.tokenId') }} :</span>{{ tokenDetail.tokenId || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.publisher') }} :</span>{{ tokenDetail.publisher || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.total') }} :</span>{{ tokenDetail.total || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.tokenDigit') }} :</span>{{ tokenDetail.tokenDigit || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.publisherDate') }} :</span>{{ tokenDetail.publisherDate || '--' }}
            </div>
            <div class="token-row">
                <span class="token-title">{{ $t('exchange.head.type') }} :</span>{{ tokenDetail.tokenType || '--' }}
            </div>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';
import ellipsisAddr from 'utils/ellipsisAddr';
import { tokenDetail } from 'services/exchange';
import getTokenIcon from "utils/getTokenIcon"

export default {
    data() {
        return {
            showTokenType: '',
            ttokenDetail: null,
            ftokenDetail: null
        };
    },
    computed: {
        ftokenIcon() {
            if (!this.activeTxPair || !this.activeTxPair.ftoken) {
                return '';
            }
            return getTokenIcon(this.activeTxPair.ftoken);
        },
        ttokenIcon() {
            if (!this.activeTxPair || !this.activeTxPair.ttoken) {
                return '';
            }
            return getTokenIcon(this.activeTxPair.ttoken);
        },
        activeTxPair() {
            return this.$store.getters.exActiveTxPair;
        },
        tokenDetail() {
            if (!this.showTokenType) {
                return {};
            }

            let detail = this.ftokenDetail;
            if (this.showTokenType === 'ttoken') {
                detail = this.ttokenDetail;
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
    watch: {
        activeTxPair: function() {
            this.fetchToken('ttoken');
            this.fetchToken('ftoken');
        }
    },
    methods: {
        showToken(type) {
            this.showTokenType = type;
        },
        hideToken() {
            this.showTokenType = '';
        },
        fetchToken(type = 'ttoken') {
            if (!this.activeTxPair || !this.activeTxPair[type]) {
                return;
            }

            let tokenId = this.activeTxPair[type];
            tokenDetail({ tokenId }).then((data) => {
                if (tokenId !== this.activeTxPair[type]) {
                    return;
                }
                this[`${type}Detail`] = data;
            }).catch((err) => {
                console.warn(err);
            });
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
                width: 12px;
                height: 12px;
                border-radius: 12px;
                margin-bottom: 1px;
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
        &:after {
            position: absolute;
            top: -12px;
            left: 60px;
            content: ' ';
            display: inline-block;
            border: 6px solid transparent;
            border-bottom: 6px solid #fff;
        }
        .token-row {
            line-height: 20px;
            color: rgba(36,39,43,1);
            .token-title {
                min-width: 75px;
                color: #5e6875;
                display: inline-block;
            }
        }
    }
}
</style>
