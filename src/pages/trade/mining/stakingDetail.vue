<template>
    <div class="staking-detail">
        <div class="item">
            <img src="~assets/imgs/smallAssets.svg" />
            <div class="item-detail">
                <div>{{ $t('stakingAmount') }}</div>
                <div class="bold">{{ stakingDetail.amount }}</div>
            </div>
        </div>
        <div class="item">
            <img src="~assets/imgs/snapshot.svg" />
            <div class="item-detail">
                <div>{{ $t('withdrawHeight') }}</div>
                <div class="bold">{{ stakingDetail.withdrawHeight }}</div>
            </div>
        </div>
        <div class="item no-border">
            <img src="~assets/imgs/time.svg" />
            <div class="item-detail">
                <div>{{ $t('walletQuota.list.withdrawTime') }}</div>
                <div class="bold">{{ stakingDetail.withdrawTime }}</div>
            </div>
        </div>
        <div v-show="!canCancel" class="btn unuse">{{ $t('tradeMining.withdraw') }}</div>
        <div v-show="canCancel" class="btn cancel __pointer" @click="showVxConfirm(2)">{{ $t('tradeMining.withdraw') }}</div>
        <div class="btn add __pointer" @click="showVxConfirm(1)">{{ $t('tradeMining.add') }}</div>
    </div>
</template>

<script>
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { constant } from '@vite/vitejs';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    created() {
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
                withdrawTime: date(this.stakingObj.withdrawTime * 1000, this.$i18n.locale),
                amount: bigNumber.toBasic(this.stakingObj.amount || 0, Vite_Token_Info.decimals),
                withdrawHeight: this.stakingObj.withdrawHeight
            };
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.staking-detail {
    background: url('~assets/imgs/mint_pledge_bg.png') rgba(234,248,255,0.2);
    background-size: 100% 100%;
    >div {
        display: inline-block;
    }
    .item {
        box-sizing: border-box;
        width: 25%;
        padding: 16px 30px;
        border-right: 1px solid rgba(227,235,245,0.6);
        &.no-border {
            border-right: none;
        }

        img {
            margin-right: 10px;
        }
        .item-detail {
            display: inline-block;
            line-height: 18px;
            font-size: 12px;
            font-family: $font-normal;
            font-weight: 400;
            color: rgba(94,104,117,1);
            .bold {
                font-family: $font-bold;
                font-weight: 600;
                color: rgba(29,32,36,1);
            }
        }
    }
    .btn {
        margin-top: 19px;
        float: right;
        min-width: 100px;
        box-sizing: border-box;
        padding: 7px;
        text-align: center;
        border-radius: 2px;
        font-size: 12px;
        @include font-family-bold();
        font-weight: 600;
        line-height: 16px;
        &.add {
            color: #fff;
            background: rgba(0,122,255,1);
            margin-right: 13px;
            margin-bottom: -1px;
        }
        &.cancel {
            color: rgba(94,104,117,1);
            border: 1px solid rgba(198,203,212,1);
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
