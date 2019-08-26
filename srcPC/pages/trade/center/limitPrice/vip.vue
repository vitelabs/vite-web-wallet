<template>
    <div class="vip-container">
        <span
            class="svip"
            v-if="isSVip"
        ></span>
        <span
            class="vip"
            :class="{ 'active': isVip }"
            v-else
        ></span>
        <span
            class="vip-operate __pointer"
            @click="_showVipConfirm"
            v-if="isSVip&&isVip"
        >
            {{$t('trade.limitPrice.cancelVip') }}
        </span>
        <div
            class="vip-operate __pointer"
            @click="drop=!drop"
            v-else
        >
            {{ isVip&&isSVip ? $t('trade.limitPrice.cancelVip') : $t('trade.limitPrice.openVip') }}
            <div
                class="drop-menu"
                v-show="drop"
            >
                <div @click="dropM1">{{isVip&&isSVip?'cancelvip':'openSvip'}}</div>
                <div @click="dropM2">{{!isVip&&!isSVip?'openvip':(isVip&&!isSVip?'cancelvip':'cancelSvip')}}</div>
            </div>
        </div>

    </div>
</template>
<script>

import vipConfirm from './vipConfirm.vue';
import insertTo from 'pcUtils/insertTo';
import statistics from 'utils/statistics';
import { execWithValid } from 'pcUtils/execWithValid';


export default {
    data() {
        return { drop: false };
    },
    computed: {
        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        }
    },
    methods: {
        dropM1() {

        },
        dropM2() {

        },
        _showVipConfirm() {
            statistics.event(this.$route.name, `switchVIP-${ this.isVip ? 'cancel' : 'open' }`, this.address || '');
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
            this.vipConfirm = insertTo(vipConfirm, {
                close: () => {
                    this.hideSVipConfirm();
                }
            });
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
        &.active {
            color: #007aff;
        }
        .drop-menu {
            display: flex;
            flex-direction: column;
            box-shadow: 0px 5px 10px 0px rgba(176, 192, 237, 0.69);
            border-radius: 2px;
            > div {
                width: 90px;
                height: 32px;
            }
            > div:hover {
                background: rgba(75, 116, 255, 0.1);
            }
        }
    }
    .svip {
        display: inline-block;
        margin-bottom: -3px;
        color: rgba(255, 255, 255, 1);
        width: 36px;
        height: 16px;
        background: url("~assets/imgs/svip.png");
        background-size: 100% 100%;
    }
    .vip {
        display: inline-block;
        margin-bottom: -3px;
        color: rgba(255, 255, 255, 1);
        width: 36px;
        height: 16px;
        background: url("~assets/imgs/not_vip.svg");
        background-size: 100% 100%;

        &.active {
            background: url("~assets/imgs/vip.svg");
            background-size: 100% 100%;
        }
    }
}
</style>
