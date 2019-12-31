<template>
    <div class="open-order-ct">
        <Filters :isShowStatus="false" @submit="submit($event)"></Filters>
        <div class="tb">
            <open-table class="tb_content" :list="list"></open-table>
            <pagination class="__tb_pagination"
                        :currentPage="currentPage" :toPage="getOrder"
                        :totalPage="totalPage"></pagination>
        </div>
    </div>
</template>

<script>
import { order } from 'services/trade';
import pagination from 'pcComponents/pagination';
import openTable from '../components/openTable';
import Filters from '../components/filters';

const Page_Size = 50;

export default {
    components: { openTable, pagination, Filters },
    data() {
        return {
            filters: {},
            list: [],
            currentPage: 1,
            totalPage: 0
        };
    },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        defaultAddr() {
            this.init();
        }
    },
    methods: {
        submit(v) {
            this.filters = v;
            this.init();
        },
        init() {
            if (!this.defaultAddr) {
                return;
            }

            this.currentPage = 1;
            this.getOrder();
        },
        getOrder(pageIndex = 1) {
            order({
                ...this.filters,
                address: this.defaultAddr,
                status: 1,
                total: 1,
                offset: (pageIndex - 1) * Page_Size,
                limit: Page_Size
            }).then(data => {
                this.totalPage = Math.ceil(data.total / Page_Size);
                this.list = data.order || [];
                this.currentPage = pageIndex;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.open-order-ct {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    margin-top: 10px;
    .tb {
        width: 100%;
        flex: 1;
        overflow: auto;
        @include box_shadow();
        .tb_content {
            height: 100%;
        }
        .__tb_pagination {
            height: 75px;
            line-height: 75px;
            text-align: center;
        }
    }
}
</style>
