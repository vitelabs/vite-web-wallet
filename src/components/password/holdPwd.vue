<template>
    <div class="hold-pwd __pointer" @click="toggleHold">
        <span :class="{ 'active': isHoldPWD }"></span>
        {{ $t('pwdConfirm.conf') }}
    </div>
</template>

<script>
import localStorage from 'utils/localStorage';

const HoldPwdKey = 'isHoldPWD';

export default {
    data() {
        return { isHoldPWD: !!localStorage.getItem(HoldPwdKey) };
    },
    methods: {
        toggleHold() {
            this.isHoldPWD = !this.isHoldPWD;
            localStorage.setItem(HoldPwdKey, this.isHoldPWD);

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
@import "~assets/scss/vars.scss";

// Page: /setting
.setting-wrapper .hold-pwd {
    font-size: 12px;
    color: #5E6875;
}

// Page: /trade...
.dex .hold-pwd {
    font-size: 12px;
    span {
        margin-bottom: -3px;
        width: 14px;
        height: 14px;
    }
}

.hold-pwd {
    margin-top: 12px;
    font-size: 14px;
    color: #1d2024;
    font-family: $font-normal, arial, sans-serif;

    span {
        display: inline-block;
        margin-bottom: -3px;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #d4dee7;
        border-radius: 16px;

        &.active {
            background: url('~assets/imgs/presnet.svg') no-repeat center;
            background-size: 16px 16px;
        }
    }
}
</style>
