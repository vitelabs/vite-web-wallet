<template>
    <div class="open-order-ct">
        <open-table :list="list"></open-table>

        <pagination class="__tb_pagination"
                    :currentPage="currentPage" :toPage="getOrder"
                    :totalPage="totalPage"></pagination>
    </div>
</template>

<script>
import { order } from 'services/trade';
import pagination from 'components/pagination';
import openTable from '../components/openTable';

const Page_Size = 50;

export default {
    components: { openTable, pagination },
    mounted() {
        this.init();
    },
    data() {
        return {
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
        init() {
            if (!this.defaultAddr) {
                return;
            }

            this.currentPage = 1;
            this.getOrder();
        },
        getOrder(pageIndex = 1) {
            order({
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
    background: #fff;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    .__tb_pagination {
        height: 75px;
        line-height: 75px;
        text-align: center;
    }
}
</style>
