<template>
    <div class="mining-list-wrapper">
        <list-view class="list-wrapper-view" :reachEnd="reachEnd">
            <no-data slot="content" v-if="!isLoading && (!contentList || !contentList.length)"></no-data>
            <div slot="content" v-if="contentList && contentList.length">
                <div class="list-item" v-show="contentList && contentList.length"
                     v-for="(item, i) in contentList" :key="i">
                    <div class="row">
                        <span>{{ $t('tradeDividend.unlockList.amount') }}</span>
                        <span class="amount">{{ item.amount }}</span>
                    </div>
                    <div class="row">
                        <span>{{ $t('tradeDividend.unlockList.time')}}</span>
                        <span>{{ item.time }}</span>
                    </div>
                </div>
            </div>
            <div v-show="isLoading" class="loading-wrapper" slot="footer">
                <loading loadingType="dot" class="ex-center-loading"></loading>
            </div>
        </list-view>
    </div>
</template>

<script>
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { VX_TOKENID } from 'utils/constant';
import { getVxUnlockList } from 'services/viteServer';
import noData from 'h5Components/noData';
import listView from 'h5Components/listView.vue';
import loading from 'components/loading';

export default {
    components: { listView, noData, loading },
    beforeMount() {
        this.init();
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
        vxTokenInfo() {
            return this.$store.state.env.tokenMap[VX_TOKENID];
        },
        vxTokenDecimals() {
            return this.vxTokenInfo.decimals;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        contentList() {
            const list = [];
            this.list.forEach(item => {
                list.push({
                    amount: `${ bigNumber.toBasic(item.amount, this.vxTokenDecimals) } VX`,
                    time: date(item.expirationTime * 1000, 'zh')
                });
            });
            return list;
        }
    },
    methods: {
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

            getVxUnlockList(this.address, pageIndex, 10).then(({ count, unlocks }) => {
                if (!this.isLoading || (this.isInit && this.pageIndex >= pageIndex)) {
                    console.log(this.isLoading, this.pageIndex, pageIndex);
                    return;
                }

                this.pageIndex = pageIndex;
                this.totalNum = count;
                this.list = [].concat(this.list, unlocks);
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
