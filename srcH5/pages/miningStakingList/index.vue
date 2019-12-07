<template>
    <div class="mining-list-wrapper">
        <list-view class="list-wrapper-view" :reachEnd="reachEnd">
            <no-data slot="content" v-if="!isLoading && (!contentList || !contentList.length)"></no-data>
            <div slot="content" v-if="contentList && contentList.length">
                <div class="list-item" v-show="contentList && contentList.length"
                     v-for="(item, i) in contentList" :key="i">
                    <div class="row">
                        <span>{{ $t('withdrawHeight') }}: {{ item.height }}</span>
                        <span><b class="amount">{{ item.amount }}</b> VITE</span>
                    </div>
                    <div class="row">
                        <span>{{ $t('walletQuota.list.withdrawTime') }}: {{ item.time }}</span>
                        <span class="btn" :class="{ 'unuse': !item.canCancel }"
                              @click="clickCell(item)">
                            {{ $t("tradeMining.withdraw") }}</span>
                    </div>
                </div>
            </div>
            <div v-show="isLoading" class="loading-wrapper" slot="footer">
                <loading loadingType="dot" class="ex-center-loading"></loading>
            </div>
        </list-view>

        <cancel-staking ref="cancelStaking"></cancel-staking>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { getAgentMiningPledgeInfo } from 'services/viteServer';
import noData from 'h5Components/noData';
import listView from 'h5Components/listView.vue';
import loading from 'components/loading';
import cancelStaking from './cancelStaking';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { listView, noData, loading, cancelStaking },
    beforeMount() {
        this.$store.dispatch('startLoopHeight');
        this.init();
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    data() {
        return {
            isLoading: false,
            isInit: false,
            list: [],
            totalNum: 0,
            pageIndex: 0
        };
    },
    computed: {
        height() {
            return this.$store.state.env.currentHeight;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        contentList() {
            const list = [];
            this.list.forEach(item => {
                list.push({
                    time: date(item.expirationTime * 1000, 'zh'),
                    amount: bigNumber.toBasic(item.stakeAmount, Vite_Token_Info.decimals, 4),
                    height: item.expirationHeight,
                    canCancel: bigNumber.compared(item.expirationHeight, this.height) <= 0,
                    rawData: item
                });
            });
            return list;
        }
    },
    methods: {
        clickCell(item) {
            if (!item.canCancel) {
                return;
            }

            this.$refs.cancelStaking.show(item, () => {
                this.init();
            });
        },
        init() {
            this.list = [];
            this.pageIndex = -1;
            this.totalNum = 0;
            this.isInit = false;
            this.getStakingList();
        },

        reachEnd() {
            if (this.pageIndex < 0) {
                return;
            }
            this.getStakingList(this.pageIndex + 1);
        },
        getStakingList(pageIndex = 0) {
            const isAll = this.list.length === this.totalNum;
            if (this.isLoading
                || !this.address
                || (this.isInit && isAll)) {
                return;
            }

            this.isLoading = true;

            getAgentMiningPledgeInfo(this.address, pageIndex, 10).then(({ totalStakeCount, stakeList }) => {
                if (!this.isLoading || (this.isInit && this.pageIndex >= pageIndex)) {
                    console.log(this.isLoading, this.pageIndex, pageIndex);
                    return;
                }

                this.pageIndex = pageIndex;
                this.totalNum = totalStakeCount;
                this.list = [].concat(this.list, stakeList);
                this.isLoading = false;
                this.isInit = true;
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";
@import "~h5Assets/scss/listItem.scss";

.mining-list-wrapper {
    height: 100%;
    width: 100%;
    padding: 17px 0;
    box-sizing: border-box;
    .list-wrapper-view {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .loading-wrapper {
            position: relative;
            text-align: center;
        }
    }
}
</style>
