<template>
    <div class="hold-pwd __pointer" @click="toggleHold">
        <span :class="{ 'active': isHoldPWD }"></span>
        {{ $t('pwdConfirm.conf') }}
    </div>
</template>

<script>
import { constant } from 'utils/store';

const HoldPwdKey = constant.HoldPwdKey;

export default {
    mounted() {
        const accInfo = this.currHDAcc.getAccInfo();
        this.isHoldPWD = !!accInfo[HoldPwdKey];
    },
    data() {
        return { isHoldPWD: false };
    },
    computed: {
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        }
    },
    methods: {
        toggleHold() {
            this.isHoldPWD = !this.isHoldPWD;
            this.currHDAcc.saveOnAcc(HoldPwdKey, this.isHoldPWD);
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
    @include font-family-normal();

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
