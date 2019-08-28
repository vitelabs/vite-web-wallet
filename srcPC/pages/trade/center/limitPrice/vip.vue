<template>
    <div class="vip-container">
        <span class="vip svip" v-if="isSVip"></span>
        <span class="vip" :class="{ active: isVip }" v-else></span>
        <span
            class="vip-operate __pointer"
            @click="showSVipConfirm"
            v-if="isSVip && !isVip"
        >
            {{ $t("trade.limitPrice.cancelVip") }}
        </span>
        <VSwitch
            v-else
            class="vip-operate drop_menu"
            @input="action"
            :optList="optList"
            :title="isVip && isSVip ? $t('trade.svipConfirm.cancel') : $t('trade.svipConfirm.open')"
        />
    </div>
</template>
<script>
import vipConfirm from './vipConfirm.vue';
import { insertTo } from 'pcUtils/insertTo';
import statistics from 'utils/statistics';
import { execWithValid } from 'pcUtils/execWithValid';
import VSwitch from 'uiKit/switch';
import component2function from 'pcComponents/dialog/utils';
import svipComp from './svipConfirm';
import { doUntill } from 'utils/asyncFlow';

export default {
    components: { VSwitch },
    computed: {
        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        },
        optList() {
            return [
                {
                    name: this.isVip && this.isSVip ? this.$t('trade.vipConfirm.cancelVip') : this.$t('trade.svipConfirm.openVip'),
                    value: this.isVip && this.isSVip ? 'vip' : 'svip'
                },
                {
                    name:
                        !this.isVip && !this.isSVip
                            ? this.$t('trade.vipConfirm.openVip')
                            : this.isVip && !this.isSVip
                                ? this.$t('trade.vipConfirm.cancelVip')
                                : this.$t('trade.svipConfirm.cancelVip'),
                    value: this.isVip && this.isSVip ? 'svip' : 'vip'
                }
            ];
        }
    },
    methods: {
        action(item) {
            if (item === 'vip') {
                this._showVipConfirm();
            } else {
                this.showSVipConfirm();
            }
        },
        _showVipConfirm() {
            statistics.event(this.$route.name,
                `switchVIP-${ this.isVip ? 'cancel' : 'open' }`,
                this.address || '');
            this.showVipConfirm();
        },
        hideVipConfirm() {
            this.vipConfirm
                && this.vipConfirm.destroyInstance()
                && (this.vipConfirm = null);
        },
        showVipConfirm: execWithValid(function () {
            this.vipConfirm = insertTo(vipConfirm, {
                close: () => {
                    this.hideVipConfirm();
                }
            });
        }),
        showSVipConfirm: execWithValid(function () {
            component2function(svipComp)().then(() =>
                doUntill({ createPromise: () => this.$store.dispatch('exFetchSVip'), interval: 1000, times: 3 }));
        })
    }
};
</script>
<style lang="scss" scoped>
.vip-container {
    display: flex;
    .vip-operate {
        padding-right: 6px;
        border-right: 1px solid rgba(205, 204, 204, 1);
        /deep/ .list{
            width: 94px!important;
        }
        &.drop_menu {
            border: none;
        }
        &.active {
            color: #007aff;
        }
    }
    .vip {
        display: inline-block;
        margin-bottom: -3px;
        margin-right: 6px;
        color: rgba(255, 255, 255, 1);
        width: 36px;
        height: 16px;
        background-image: url("~assets/imgs/not_vip.svg");
        background-size: 100% 100%;
        &.svip {
            background-image: url("~assets/imgs/svip.png");
        }
        &.active {
            background: url("~assets/imgs/vip.svg");
            background-size: 100% 100%;
        }
    }
}
</style>
