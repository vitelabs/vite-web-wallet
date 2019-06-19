<template>
    <div class="trade-dividend-wrapper">
        <div class="pool">
            <section-title :title="$t('tradeDividend.poolTitle')"></section-title>
            <div class="pool-detail"></div>
        </div>

        <div class="list-wrapper">
            <section-title :title="$t('tradeDividend.listTitle')"></section-title>
            <div class="content">
                <div class="my-divident">
                </div>
                <wallet-table class="tb">
                    <pagination slot="tableBottom" class="__tb_pagination"
                                :currentPage="currentPage + 1" :toPage="fetchList"
                                :totalPage="totalPage"></pagination>
                </wallet-table>
            </div>
        </div>
    </div>
</template>

<script>
import sectionTitle from '../components/sectionTitle';
import walletTable from 'components/table/index.vue';

export default {
    components: { sectionTitle, walletTable },
    data() {
        return {
            currentPage: 0,
            totalNum: 0
        };
    },
    computed: {
        totalPage() {
            return parseInt(this.totalNum / 30);
        }
    },
    methods: {
        fetchList(pageNum) {
            const offset = pageNum ? pageNum + 1 : 0;
            console.log(offset);
        }
    }
};
</script>

<style lang="scss" scoped>
.trade-dividend-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}
.list-wrapper {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        .my-divident {

        }
        .tb {
            flex: 1;
        }
    }
}
</style>
