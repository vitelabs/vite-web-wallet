<template>
    <div class="order-history-ct">
        <Filters @submit="submit($event)"></Filters>
        <list-view class="list-wrapper-view" :reachEnd="reachEnd">
            <no-data slot="content" v-if="!isLoading && (!data || !data.length)"></no-data>
            <history-table slot="content" v-if="data && data.length" :list="data"></history-table>
            <div v-show="isLoading" class="loading-wrapper"  slot="footer">
                <loading loadingType="dot" class="ex-center-loading"></loading>
            </div>
        </list-view>
    </div>
</template>

<script>
import { order } from 'services/trade';
import loading from 'components/loading';
import noData from 'h5Components/noData';
import listView from 'h5Components/listView.vue';
import historyTable from 'h5Components/historyTable.vue';
import Filters from './filters';

const Page_Size = 20;

export default {
    components: { Filters, historyTable, loading, listView, noData },
    data() {
        return {
            data: [],
            currentPage: -1,
            filters: {},
            isLoading: false,
            isAll: false
        };
    },
    mounted() {
        this.update();
    },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        }
    },
    methods: {
        clear() {
            this.isLoading = false;
            this.isAll = false;
            this.data = [];
            this.currentPage = -1;
        },
        submit(v) {
            this.filters = v;
            this.clear();
            this.update();
        },
        reachEnd() {
            if (this.currentPage < 0) {
                return;
            }
            this.update(this.currentPage + 1);
        },
        update(pageNo = 0) {
            if (!this.defaultAddr || this.isLoading || this.isAll) {
                return;
            }

            this.isLoading = true;
            const filters = this.filters;

            order({
                address: this.defaultAddr,
                limit: Page_Size,
                offset: pageNo * Page_Size,
                ...filters
            }).then(data => {
                if (!this.isLoading || (this.filters === filters && this.currentPage >= pageNo)) {
                    return;
                }

                const orderList = data.order || [];
                if (orderList.length < Page_Size) {
                    this.isAll = true;
                }

                this.isLoading = false;
                this.data = this.data.concat(orderList);
                this.currentPage = pageNo;
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.order-history-ct {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    .list-wrapper-view {
        flex: 1;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .loading-wrapper {
            position: relative;
            text-align: center;
        }
    }
}
</style>
