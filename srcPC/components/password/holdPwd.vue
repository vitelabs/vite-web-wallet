<template>
    <div class="hold-pwd __pointer" @click="toggleHold">
        <span :class="{ 'active': isHoldPWD }"></span>
        {{ $t('pwdConfirm.conf') }}
    </div>
</template>

<script>
import { constant } from 'pcUtils/store';

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
        @include bg_color_1();
        @include common_border();
        border-radius: 15px;
        margin-right: 4px;
        &.active {
            @include background_common_img_suffix('presnet', 'svg', 'png');
        }
    }
}
</style>
