<template>
    <div v-click-outside="hideList" @click="toggleList" class="switch-address-wrapper __pointer">
        <span class="list-title" :class="{
            'down': !isShowList,
            'up': isShowList,
            'not-allowed': notAllowed
        }">{{ showStr }}</span>

        <ul class="list" v-show="isShowList">
            <li v-for="(addrObj, index) in addrList" :key="index"
                v-show="address !== addrObj.address"
                @click.stop="setDefaultAddr(addrObj.address, index)"
                class="item">
                <div class="name">{{ addrObj.name || `${$t('addrName', { index:index + 1 })}` }}</div>
                <div class="switch-address">{{ addrObj.address }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import statistics from 'utils/statistics';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import { StatusMap, getCurrHDAcc } from 'wallet';

export default {
    props: {
        isShowAddr: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return { isShowList: false };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        showStr() {
            if (!this.isShowAddr) {
                return this.showName;
            }
            return this.showName ? `${ this.showName }: ${ this.showAddr }` : this.showAddr;
        },
        showAddr() {
            return ellipsisAddr(this.address, 5);
        },
        showName() {
            const currAcc = getCurrHDAcc();
            if (currAcc && currAcc.isBifrost) {
                return this.$t('assets.vb.accountName');
            }
            const i = this.addrList.findIndex(v => v.address === this.address);
            if (i < 0) {
                return '';
            }
            return this.addrList[i].name || `${ this.$t('addrName', { index: this.addrList[i].idx + 1 }) }`;
        },
        addrList() {
            return this.$store.state.wallet.addrList;
        },
        notAllowed() {
            return this.addrList.length <= 1 || getCurrHDAcc().isBifrost;
        }
    },
    methods: {
        setDefaultAddr(address, index) {
            if (!this.isLogin) {
                return;
            }
            this.$store.commit('switchActiveAcc', { address, index });
            statistics.event(this.$route.name, 'switchAddress', this.address || '');

            this.toggleList();
        },
        toggleList() {
            if (this.notAllowed) {
                return;
            }
            this.isShowList = !this.isShowList;
        },
        hideList() {
            this.isShowList = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.menu.switch-address-wrapper {
    .list-title {
        [data-theme="0"] & {
            border: none;
        }
        [data-theme="1"] & {
            border: none;
        }
        border: none;
    }
    .list {
        right: 12px;
    }
}

.switch-address-wrapper {
    width: 100%;
    [data-theme="0"] & {
        color: $gray-color-3;
    }
    [data-theme="1"] & {
        color: $white-color;
    }
    @include font-family-bold();
    font-weight: 600;
    font-size: 13px;

    .list-title {
        position: relative;
        box-sizing: border-box;
        border-radius: 2px;
        @include common_border();
        padding: 0 8px;
        white-space: nowrap;

        &:after {
            content: '';
            display: inline-block;
            width: 14px;
            height: 7px;
            @include background_common_img("decend.svg");
        }
        &.not-allowed {
            &:after {
                display: none;
            }
        }
        &.down {
            &:after {
                transform: rotateX(0deg);
            }
        }
        &.up {
            &:after {
                transform: rotateX(180deg);
                margin-bottom: 2px;
            }
        }
    }
    .list {
        position: absolute;
        z-index: 100;
        width: 250px;
        max-height: 220px;
        overflow: auto;
        margin-top: 10px;
        word-break: break-all;
        [data-theme="0"] & {
            box-shadow: 0px 5px 10px 0px rgba(176,192,237,0.69);
        }
        .item {
            @include bg_color_2();
            box-sizing: border-box;
            padding: 8px 12px;
            line-height: 16px;
            &:hover {
                @include hover_color();
            }
            .name {
                font-size: 12px;
                @include font-family-bold();
                color: rgba(115,118,122,1);
            }
            .switch-address {
                font-size: 11px;
                @include font-family-normal();
                color: rgba(162,167,175,1);
            }
        }
    }
}
</style>
