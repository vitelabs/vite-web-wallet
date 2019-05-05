<template>
    <div class="auto-logout-wrapper">
        <div class="title">{{ $t('setting.noPass') }}</div>

        <div class="setting common-list-wrapper __pointer">
            <span class="list-title" :class="{
                'down': !isShow,
                'up': isShow
            }" @click="toggleShow">{{ isHoldPWD }}</span>
            <ul class="list" v-show="isShow">
                <li @click="toggleHold">{{ !isHoldPWD }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import localStorage from 'utils/localStorage';

const HoldPwdKey = 'isHoldPWD';

export default {
    data() {
        return {
            isHoldPWD: !!localStorage.getItem(HoldPwdKey),
            isShow: false
        };
    },
    methods: {
        toggleShow() {
            this.isShow = !this.isShow;
        },
        toggleHold() {
            this.isHoldPWD = !this.isHoldPWD;
            localStorage.setItem(HoldPwdKey, this.isHoldPWD);
            this.toggleShow();

            const activeAccount = this.$wallet.activeAccount;
            if (this.isHoldPWD) {
                activeAccount.holdPWD();
            } else {
                activeAccount.releasePWD();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/list/setting.scss";

.title {
    font-size: 14px;
    color: #1d2024;
    font-family: $font-bold, arial, sans-serif;
    letter-spacing: 0.35px;
    line-height: 16px;
    margin-bottom: 16px;
}
</style>
