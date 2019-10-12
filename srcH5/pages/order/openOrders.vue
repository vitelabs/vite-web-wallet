<template>
    <list-view class="list-wrapper-view" :reachEnd="reachEnd">
        <no-data slot="content" v-if="!isLoading && (!list || !list.length)"></no-data>
        <open-table slot="content" v-if="list && list.length" :list="list"></open-table>
        <div v-show="isLoading" class="loading-wrapper"  slot="footer">
            <loading loadingType="dot" class="ex-center-loading"></loading>
        </div>
    </list-view>
</template>

<script>
import { order } from 'services/trade';
import noData from 'h5Components/noData';
import openTable from 'h5Components/openTable';
import listView from 'h5Components/listView.vue';
import loading from 'components/loading';

const Page_Size = 20;

export default {
    components: { noData, openTable, listView, loading },
    mounted() {
        this.getOrders();
    },
    data() {
        return {
            list: [],
            currentPage: -1,
            isLoading: false,
            isAll: false
        };
    },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        reachEnd() {
            if (this.currentPage < 0) {
                return;
            }
            this.getOrders(this.currentPage + 1);
        },
        getOrders(pageIndex = 0) {
            if (!this.defaultAddr || this.isLoading || this.isAll) {
                return;
            }

            this.isLoading = true;
            order({
                address: this.defaultAddr,
                status: 1,
                offset: pageIndex * Page_Size,
                limit: Page_Size
            }).then(data => {
                if (!this.isLoading || this.currentPage >= pageIndex) {
                    return;
                }

                this.isLoading = false;
                const orderList = data.order || [];
                if (orderList.length < Page_Size) {
                    this.isAll = true;
                }
                this.list = (this.list || []).concat(orderList);
                this.currentPage = pageIndex;
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
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
</style>
