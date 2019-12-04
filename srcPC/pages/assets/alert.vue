<template>
    <div class="confirm-container big gray" v-if="isShow">
        <div class="confirm-wrapper">
            <div class="title">
                <span>{{ $t("tradeAssets.confirmTable.title") }}</span>
                <span @click="close" class="close-icon __pointer"></span>
            </div>

            <div class="__tb">
                <div class="__tb_row __tb_head __pointer">
                    <div class="__tb_cell" v-for="h in $t('tradeAssets.confirmTable.heads')" :key="h">{{ h }}</div>
                </div>
                <div class="__tb_content __tb_content_no_data" v-show="!detailList || !detailList.length">
                    <div class="__tb_no_data">
                        <div>{{ $t('hint.noData') }}</div>
                    </div>
                </div>
                <div class="__tb_content">
                    <div class="__tb_row __pointer __tb_content_row" v-for="(v, i) in detailList" :key="i">
                        <div class="__tb_cell" v-for="(item, j) in v" :key="j">{{ item }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// [TODO] Need components/confirm and pcComponents/table
import { chargeDetail } from 'services/trade';
import date from 'utils/date';

export default {
    props: {
        token: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            detailData: [],
            isShow: false
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        detailList() {
            return Object.keys(this.detailData).map(k => {
                const o = this.detailData[k];

                return [
                    date(o.time * 1000, this.$i18n.locale),
                    o.tokenSymbol,
                    this.$t('tradeAssets.table.rowMap.sideMap')[o.type],
                    o.amount
                ];
            });
        }
    },
    methods: {
        close() {
            this.isShow = false;
            this.detailData = [];
        },
        show() {
            this.isShow = true;
            this.detail(this.token.tokenId);
        },
        detail(tokenId) {
            this.detailConfirm = true;
            chargeDetail({
                address: this.address,
                tokenId
            }).then(data => {
                this.detailData = data.record;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~components/confirm/confirm.scss";
@import "~pcAssets/scss/table.scss";

.__tb {
    min-width: 0px;
    flex: 1;
    box-shadow: none;
}

@include rowWith {
    width: 15%;
    &:first-child {
        min-width: 150px;
    }
}

.confirm-wrapper {
    height: 300px;
}
</style>
