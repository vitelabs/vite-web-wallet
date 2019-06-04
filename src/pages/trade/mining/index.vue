<template>
    <div class="trade-mining-wrapper">
        <div class="trade-mining-section">
            <div class="title">
                {{ $t('tradeMining.tx.title') }}
                <span class="amount">20000 VX</span>
            </div>
            <wallet-table :headList="headList" class="content tb">
                <pagination></pagination>
            </wallet-table>
        </div>
        <div class="trade-mining-section">
            <div class="title">
                {{ $t('tradeMining.quota.title') }}
                <span class="amount">20000 VX</span>
            </div>
            <div class="content">
                <div class="quota-detail">
                    <div class="no-detail __pointer">{{ $t('tradeMining.addQuota') }}</div>
                </div>
                <wallet-table :headList="headList" class="tb">
                    <pagination></pagination>
                </wallet-table>
            </div>
        </div>
    </div>
</template>

<script>
import pagination from 'components/pagination.vue';
import walletTable from 'components/table/index.vue';

export default {
    components: { walletTable, pagination },
    computed: {
        headList() {
            return [ { text: this.$t('tradeMining.tbHead.date') }, { text: this.$t('tradeMining.tbHead.fee') }, { text: this.$t('tradeMining.tbHead.mining') }, { text: this.$t('tradeMining.tbHead.status') } ];
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.trade-mining-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}
.trade-mining-section {
    height: 50%;
    display: flex;
    flex-direction: column;
    .title {
        height: 50px;
        line-height: 50px;
        font-size: 13px;
        @include font-family-bold();
        font-weight: 600;
        color: rgba(94,104,117,0.8);
        .amount {
            font-size: 20px;
            color: rgba(29,32,36,1);
            &:before {
                content: ' ';
                margin: 0 10px 3px;
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 8px;
                background: rgba(0,122,255,1);
            }
        }
    }
    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
        .quota-detail {
            height: 80px;
            border-bottom: 1px solid #d4dee7;
            box-sizing: border-box;
            .no-detail {
                width: 100%;
                height: 100%;
                text-align: center;
                line-height: 80px;
                font-size: 16px;
                @include font-family-bold();
                color: rgba(0,122,255,1);
                font-weight: 600;
                &:before {
                    content: ' ';
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border: 1px solid rgba(0,122,255,0.3);
                    margin-right: 6px;
                }
            }
        }
        .tb {
            flex: 1;
            box-shadow: none;
        }
    }
}
</style>
