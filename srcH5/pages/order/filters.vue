<template>
    <div class="filter-root" ref="filterRoot" @click="close">
        <div class="filter-head">
            <div class="item __ellipsis" :class="{'active': filterType === 'date'}"
                 @click="triggerFilter('date')">
                {{ filterTypeDate }}
                <span class="arrow"></span>
            </div>
            <div class="item __ellipsis" :class="{'active': filterType === 'token'}"
                 @click="triggerFilter('token')">
                {{ filterTypeToken }}
                <span class="arrow"></span>
            </div>
            <div class="item __ellipsis" :class="{'active': filterType === 'side'}"
                 @click="triggerFilter('side')">
                {{ filterTypeSide }}
                <span class="arrow"></span>
            </div>
            <div class="item __ellipsis" :class="{'active': filterType === 'status'}"
                 @click="triggerFilter('status')">
                {{ filterTypeStatus }}
                <span class="arrow"></span>
            </div>
        </div>

        <div ref="filterWrapper" v-show="filterType" class="filter-wrapper">
            <div class="filter-content" v-show="filterType === 'date'">
                <div v-for="_d in ['all', '3month', '1month', '1week', '1day']" :key="_d"
                     class="normal-item" @click="selectDate(_d)"
                     :class="{'active': date === _d || (_d === 'all' && !date)}">
                    {{ $t(`mobileOrder.${_d}`) }}
                </div>
            </div>
            <div class="filter-content token" v-show="filterType === 'token'">
                <div v-show="!isLoadingMarketMap" class="token-side">
                    <div class="token-item" :class="{'active': !ttoken}"
                         @click="selectTtoken('')">{{ $t('mobileOrder.all') }}</div>
                    <div class="token-item" :class="{'active': ttoken === t.symbol}"
                         @click="selectTtoken(t.symbol)"
                         v-for="t in marketMap" :key="t.symbol">{{ t.symbol }}</div>
                </div>
                <loading v-show="isLoadingMarketMap" loadingType="dot" class="ex-center-loading"></loading>
                <div class="token-side">
                    <loading v-show="isLoadingFtokenMap" loadingType="dot" class="ex-center-loading"></loading>
                    <div v-show="!isLoadingFtokenMap" class="token-item"
                         :class="{'active': ftoken === token.symbol}"
                         v-for="token in ftokenMap" :key="token.symbol"
                         @click="selectFtoken(token.symbol)">
                        <span class="bold">{{ token.symbol }}</span><span class="light">/{{ ttoken }}</span>
                    </div>
                </div>
            </div>
            <div class="filter-content" v-show="filterType === 'side'">
                <div class="normal-item" :class="{'active': !side}"
                     @click="selectSide('')">{{ $t("mobileOrder.all") }}</div>
                <div class="normal-item" :class="{'active': side === '0'}"
                     @click="selectSide('0')">{{ $t("tradeOrderHistory.filter.buy") }}</div>
                <div class="normal-item" :class="{'active': side === '1'}"
                     @click="selectSide('1')">{{ $t("tradeOrderHistory.filter.sell") }}</div>
            </div>
            <div class="filter-content" v-show="filterType === 'status'">
                <div class="normal-item" :class="{'active': !status}"
                     @click="selectStatus('')">{{ $t("mobileOrder.all") }}</div>
                <div v-for="s in ['1', '2', '3', '4']" :key="s"
                     class="normal-item" @click="selectStatus(s)"
                     :class="{'active': status === s}">
                    {{ $t(`tradeOrderHistory.status.${s}`) }}
                </div>
            </div>

            <div class="btn-wrapper">
                <div class="clear" @click="clear">{{ $t('mobileOrder.clear') }}</div>
                <div class="submit" @click="submit">{{ $t('mobileOrder.submit') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { tokenMap, baseToken } from 'services/trade';
import statistics from 'utils/statistics';
import loading from 'components/loading';

export default {
    components: { loading },
    data() {
        return {
            filterType: '',

            date: 'all',
            ttoken: '',
            side: '',
            status: '',

            marketMap: [],
            isLoadingMarketMap: false,

            ftoken: '',
            ftokenMap: [],
            isLoadingFtokenMap: false
        };
    },
    mounted() {
        this.isLoadingMarketMap = true;
        baseToken().then(data => {
            const marketMap = data || [];
            this.marketMap = marketMap;
            this.isLoadingMarketMap = false;
        }).catch(err => {
            console.warn(err);
            this.isLoadingMarketMap = false;
        });
    },
    computed: {
        filterTypeDate() {
            return this.date ? this.$t(`mobileOrder.${ this.date }`) : this.$t('mobileOrder.filterDate');
        },
        filterTypeToken() {
            return this.ttoken && this.ftoken ? `${ this.ttoken }/${ this.ftoken }` : this.$t('mobileOrder.filterToken');
        },
        filterTypeSide() {
            if (this.side === '') {
                return this.$t('tradeOrderHistory.filter.side');
            }
            return this.side === '0' ? this.$t('tradeOrderHistory.filter.buy') : this.$t('tradeOrderHistory.filter.sell');
        },
        filterTypeStatus() {
            if (this.status === '') {
                return this.$t('mobileOrder.all');
            }
            return this.$t(`tradeOrderHistory.status.${ this.status }`);
        },

        activeAddr() {
            return this.$store.getters.activeAddr;
        },
        fromDate() {
            if (!this.date || this.date === 'all') {
                return '';
            }

            const date = new Date();
            let month = date.getMonth();
            let day = date.getDate();

            switch (this.date) {
            case '3month':
                month -= 3;
                break;
            case '1month':
                month -= 1;
                break;
            case '1week':
                day -= 7;
                break;
            case '1day':
                day -= 1;
                break;
            default:
                break;
            }
            date.setMonth(month);
            date.setDate(day);
            return parseInt(date.getTime() / 1000);
        }
    },
    watch: {
        ttoken() {
            this.ftoken = '';
            this.ftokenMap = [];

            if (!this.ttoken) {
                return;
            }

            this.isLoadingFtokenMap = true;
            tokenMap({ symbol: this.ttoken }).then(data => {
                this.isLoadingFtokenMap = false;
                this.ftokenMap = data;
            }).catch(err => {
                console.warn(err);
                this.isLoadingFtokenMap = false;
            });
        }
    },
    methods: {
        triggerFilter(type) {
            if (this.filterType === type) {
                this.filterType = '';
            }
            this.filterType = type;
        },
        close(e) {
            if (this.$refs.filterRoot.contains(e.target) && e.target !== this.$refs.filterWrapper) {
                return;
            }
            this.filterType = '';
            this.clear();
        },
        clear() {
            this.date = '';
            this.side = '';
            this.status = '';
            this.ftoken = '';
            this.ttoken = '';
        },
        submit() {
            this.filterType = '';
            statistics.event(`H5${ this.$route.name }`, 'search', this.activeAddr || '');
            this.$emit('submit', {
                startTime: this.fromDate,
                side: this.side,
                status: this.status,
                tradeTokenSymbol: this.ftoken,
                quoteTokenSymbol: this.ttoken
            });
        },
        selectDate(date) {
            date = date === 'all' ? '' : date;
            this.date = date;
        },
        selectTtoken(ttoken) {
            this.ttoken = ttoken;
        },
        selectSide(side) {
            this.side = side;
        },
        selectStatus(status) {
            this.status = status;
        },
        selectFtoken(ftoken) {
            this.ftoken = ftoken;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "h5Assets/scss/vars.scss";

.filter-root {
    @include font-normal();
    z-index: 1;
    .filter-head {
        background: #fff;
        padding: 0px 24px 14px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .item {
            font-size: 12px;
            color: rgba(62,74,89,0.6);
            line-height: 16px;
            flex: 1;
            text-align: center;
            box-sizing: border-box;
            .arrow {
                display: inline-block;
                width: 10px;
                height: 12px;
                background: url('~h5Assets/imgs/ascend_down.svg');
                background-size: 100% 100%;
                margin-bottom: -2px;
            }
            &.active {
                color: rgba(0,122,255,1);
                .arrow {
                    background: url('~h5Assets/imgs/ascend_up.svg');
                }
            }
        }
    }
    .filter-wrapper {
        position: absolute;
        top: 30px;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.4);
        .filter-content {
            font-size: 14px;
            background: #fff;
            .normal-item {
                line-height: 30px;
                text-align: center;
                color: rgba(62,74,89,1);
                padding-bottom: 10px;
                &.active {
                    color: $blue;
                }
            }
            .token-item {
                text-align: center;
                line-height: 38px;
                color: rgba(62,74,89,0.7);
                &.active {
                    color: $blue;
                    .bold {
                        color: $blue;
                    }
                    .lignt {
                        color: $blue;
                        opacity: 0.4;
                    }
                }
                .bold {
                    @include font-bold();
                    color: rgba(36,39,43,1);
                }
                .lignt {
                    @include font-bold();
                    color: rgba(62,74,89,0.3);
                }
            }
            &.token {
                display: flex;
                flex-direction: row;
                .token-side {
                    position: relative;
                    flex: 1;
                    max-height: 300px;
                    overflow: auto;
                    -webkit-overflow-scrolling: touch;
                    &:first-child {
                        position: relative;
                        padding: 10px 0;
                        min-height: 150px;
                    }
                    &:last-child {
                        padding: 10px 0;
                        background: rgba(247,247,249,1);
                    }
                }
            }
        }
        .btn-wrapper {
            display: flex;
            background: #fff;
            flex-direction: row;
            font-size: 14px;
            @include font-bold();
            .clear, .submit {
                flex: 1;
                text-align: center;
            }
            .clear {
                padding: 10px 0;
                border: 1px solid $blue;
                box-sizing: border-box;
                color: $blue;
            }
            .submit {
                padding: 11px 0;
                background: $blue;
                color: #fff;
            }
        }
    }
}
</style>
