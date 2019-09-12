<template>
    <div class="staking-detail">
        <div class="operation">
            <div class="item">
                <div class="item-tilte">
                    <img src="~h5Assets/imgs/staking_amount.svg" />{{ $t("stakingAmount") }}
                </div>
                <div class="bold">{{ stakingDetail.amount }}</div>
            </div>
            <div class="item">
                <div class="item-tilte">
                    <img src="~h5Assets/imgs/small_mine.svg" />{{ $t("tradeMining.dividends") }}
                </div>
                <div class="bold">{{ expectedDividends }}</div>
            </div>
        </div>

        <div class="operation">
            <div class="item">
                <div class="item-tilte">
                    <img src="~h5Assets/imgs/snapshot.svg" />{{ $t("withdrawHeight") }}
                </div>
                <div class="bold">{{ stakingDetail.withdrawHeight }}</div>
            </div>
            <div class="item">
                <div class="item-tilte">
                    <img src="~h5Assets/imgs/staking_time.svg" />{{ $t("walletQuota.list.withdrawTime") }}
                </div>
                <div class="bold">{{ stakingDetail.withdrawTime }}</div>
            </div>
        </div>

        <div class="operation">
            <span class="item btn add" @click="showVxConfirm(1)">
                {{ $t("tradeMining.add") }}
            </span>
            <span v-show="!canCancel" class="item btn unuse">
                {{ $t("tradeMining.withdraw") }}
            </span>
            <span v-show="canCancel" class="item btn cancel" @click="showVxConfirm(2)">
                {{ $t("tradeMining.withdraw") }}
            </span>
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
            return this.$store.state.env.currentHeight;
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
@import "~h5Assets/scss/vars.scss";

.staking-detail {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    font-size: 12px;
    @include font-normal();
    color: rgba(62,74,89,0.6);
    line-height: 16px;
    .item {
        flex: 1;
        &:first-child {
            margin-right: 23px;
        }
        .item-tilte {
            margin-bottom: 5px;
            img {
                width: 16px;
                height: 16px;
                margin-bottom: -4px;
                margin-right: 2px;
            }
        }
        .bold {
            @include font-bold();
        }
    }
    .operation {
        display: flex;
        align-items: center;
        flex-direction: row;
        width: 100%;
        margin-top: 14px;
    }
    .btn {
        display: inline-block;
        border-radius: 2px;
        padding: 0 13px;
        height: 26px;
        line-height: 26px;
        box-sizing: border-box;
        font-size: 14px;
        @include font-bold();
        text-align: center;
        &.add {
            color: #fff;
            background: $blue;
        }
        &.cancel {
            color: $blue;
            border: 1px solid $blue;
        }
        &.unuse {
            border: 1px solid rgba(201,217,239,1);
            color: rgba(201,217,239,1);
        }
    }
}
</style>
