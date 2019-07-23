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

.hold-pwd {
    line-height: 16px;
    margin-top: 12px;
    font-size: 12px;
    color: #5E6875;
    @include font-family-normal();

    span {
        display: inline-block;
        margin-bottom: -3px;
        width: 15px;
        height: 15px;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #d4dee7;
        border-radius: 15px;
        margin-right: 4px;
        &.active {
            background: url('~assets/imgs/presnet.svg') no-repeat center;
            background-size: 16px 16px;
        }
    }
}
</style>
