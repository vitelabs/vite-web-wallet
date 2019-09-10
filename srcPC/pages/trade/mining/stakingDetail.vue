<template>
    <div class="staking-detail">
        <div class="item">
            <div>{{ $t("stakingAmount") }}</div>
            <div class="bold">{{ stakingDetail.amount }}</div>
            <div>{{ `${$t('tradeMining.dividends')}: ${expectedDividends} VX` }}</div>
        </div>
        <div class="item">
            <div>{{ $t("withdrawHeight") }}</div>
            <div class="bold">{{ stakingDetail.withdrawHeight }}</div>
        </div>
        <div class="item no-border">
            <div>{{ $t("walletQuota.list.withdrawTime") }}</div>
            <div class="bold">{{ stakingDetail.withdrawTime }}</div>
        </div>

        <div class="operations">
            <div class="btn add __pointer" @click="showVxConfirm(1)">
                {{ $t("tradeMining.add") }}
            </div>
            <div v-show="!canCancel" class="btn unuse">
                {{ $t("tradeMining.withdraw") }}
            </div>
            <div
                v-show="canCancel"
                class="btn cancel __pointer"
                @click="showVxConfirm(2)"
            >
                {{ $t("tradeMining.withdraw") }}
            </div>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { constant } from '@vite/vitejs';
import { getCurrentPledgeForVxSum } from 'services/viteServer';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    mounted() {
        this.getCurrentPledgeForVxSum();
        this.$store.dispatch('startLoopHeight');
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    props: {
        stakingObj: {
            type: Object,
            default: null
        },
        showVxConfirm: {
            type: Function,
            default: () => {}
        },
        totalDividend: {
            type: String,
            default: '0'
        }
    },
    data() {
        return { currTotalPledge: 0 };
    },
    computed: {
        height() {
            return this.$store.state.ledger.currentHeight;
        },
        canCancel() {
            return this.stakingObj.withdrawHeight <= this.height;
        },
        stakingDetail() {
            if (!this.stakingObj) {
                return {
                    amount: '',
                    withdrawTime: '',
                    withdrawHeight: ''
                };
            }
            return {
                withdrawTime: date(this.stakingObj.withdrawTime * 1000,
                    this.$i18n.locale),
                amount: bigNumber.toBasic(this.stakingObj.amount || 0,
                    Vite_Token_Info.decimals),
                withdrawHeight: this.stakingObj.withdrawHeight
            };
        },
        expectedDividends() {
            if (!this.stakingObj || !+this.stakingObj.amount) {
                return '0';
            }
            const percent = +this.currTotalPledge ? bigNumber.dividedToNumber(this.stakingObj.amount, this.currTotalPledge, 8) : 0;
            const dividends = bigNumber.multi(this.totalDividend, percent, 8);
            return bigNumber.toBasic(dividends, Vite_Token_Info.decimals, 8);
        }
    },
    methods: {
        getCurrentPledgeForVxSum() {
            return getCurrentPledgeForVxSum().then(data => {
                this.currTotalPledge = data || '0';
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.staking-detail {
    background: url("~assets/imgs/mint_pledge_bg.png") rgba(234, 248, 255, 0.2);
    background-size: 100% 100%;
    display: flex;
    .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        width: 25%;
        padding: 16px 30px;
        border-right: 1px solid rgba(227, 235, 245, 0.6);
        font-size: 12px;
        @include font-family-normal();
        color: #5e6875;
        > div {
            height: 16px;
        }
        &.no-border {
            border-right: none;
        }
        .bold {
            @include font-family-bold();
            color: #1d2024;
        }
    }
    .operations {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
        align-items: center;
    }
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 100px;
        height: 30px;
        box-sizing: border-box;
        border-radius: 2px;
        font-size: 12px;
        @include font-family-bold();
        font-weight: 600;
        line-height: 16px;
        &.add {
            color: #fff;
            background: rgba(0, 122, 255, 1);
            margin-right: 13px;
            margin-bottom: -1px;
        }
        &.cancel {
            color: rgba(94, 104, 117, 1);
            border: 1px solid rgba(198, 203, 212, 1);
            margin-right: 30px;
        }
        &.unuse {
            margin-right: 30px;
            background: #efefef;
            color: #666;
            border: none;
            cursor: not-allowed;
        }
    }
}
</style>
