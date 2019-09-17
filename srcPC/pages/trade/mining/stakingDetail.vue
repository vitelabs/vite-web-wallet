<template>
    <div class="staking-detail">
        <div class="item">
            <div>{{ $t("stakingAmount") }}</div>
            <div class="bold">{{ stakingDetail.amount }}</div>
        </div>
        <div class="item">
            <div>{{ $t('tradeMining.dividends') }}</div>
            <div class="bold">{{ `${expectedDividends} VX` }}</div>
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

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    mounted() {
        this.$store.dispatch('getCurrentPledgeForVxSum');
        this.$store.dispatch('startLoopHeight');
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    props: {
        showVxConfirm: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        stakingObj() {
            return this.$store.state.exchangeMine.userPledgeInfo;
        },
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
            return this.$store.getters.stakingDividends;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../components/stakingDetail.scss";
</style>
