<template>
    <div class="staking-detail">
        <div class="item">
            <div class="item-tilte">
                <img src="~h5Assets/imgs/staking_amount.svg" />{{ $t("stakingAmount") }}
            </div>
            <div class="bold">{{ stakingDetail.amount }}</div>
        </div>
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

        <div class="item operation">
            <span class="btn add __pointer" @click="showVxConfirm(1)">
                {{ $t("tradeMining.add") }}
            </span>
            <span v-show="!canCancel" class="btn unuse">
                {{ $t("tradeMining.withdraw") }}
            </span>
            <span v-show="canCancel" class="btn cancel __pointer" @click="showVxConfirm(2)">
                {{ $t("tradeMining.withdraw") }}
            </span>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { constant } from '@vite/vitejs';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    mounted() {
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
        }
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
        width: 50%;
        margin-bottom: 14px;
        &.operation {
            display: flex;
            align-items: center;
            flex-direction: row;
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

    .btn {
        display: inline-block;
        border-radius: 2px;
        padding: 0 13px;
        height: 24px;
        line-height: 24px;
        box-sizing: border-box;
        font-size: 14px;
        @include font-bold();
        &.add {
            color: #fff;
            background: $blue;
            margin-right: 5px;
        }
        &.cancel {
            color: $blue;
            border: 1px solid $blue;
        }
        &.unuse {
            background: #efefef;
            color: #666;
            border: none;
        }
    }
}
</style>
