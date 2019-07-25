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
            if (getCurrHDAcc().isBifrost) {
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
@import "~assets/scss/vars.scss";

.dex .switch-address-wrapper {
    font-size: 13px;
}

.menu.switch-address-wrapper {
    .list-title {
        border: none;
    }
    .list {
        right: 12px;
    }
}

.switch-address-wrapper {
    width: 100%;
    color: #73767A;
    @include font-family-bold();
    font-weight: 600;
    font-size: 14px;

    .list-title {
        position: relative;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid rgba(212,222,231,1);
        padding: 0 8px;

        &:after {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
            background: url('~assets/imgs/uiKit/select/down.svg');
            background-size: 16px 16px;
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
            }
        }

    }
    .list {
        position: absolute;
        z-index: 100;
        width: 250px;
        max-height: 220px;
        overflow: auto;
        background: rgba(255,255,255,1);
        box-shadow: 0px 5px 10px 0px rgba(176,192,237,0.69);
        margin-top: 10px;
        word-break: break-all;
        .item {
            box-sizing: border-box;
            padding: 8px 12px;
            line-height: 16px;
            &:hover {
                background: rgba(75,116,255,0.1);
            }
            .name {
                font-size: 12px;
                @include font-family-bold();
                font-weight: 600;
                color: rgba(115,118,122,1);
            }
            .switch-address {
                font-size: 11px;
                @include font-family-normal();
                font-weight: 400;
                color: rgba(162,167,175,1);
            }
        }
    }
}
</style>
