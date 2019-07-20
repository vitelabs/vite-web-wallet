<template lang="pug">
extends /components/dialog/base.pug
block content
    img.bg-img(src="~assets/imgs/invite.png")
    div(v-if="inviteeCode")
        .invite-code 你已接受过邀请，邀请码为：{{this.inviteeCode}}
    div(v-else)
        .block__title {{ $t(`tradeAssets.confirmrecharge.lable1`) }}
        input.block__content(v-model="code")
    .block__title 邀请规则
    .illustrate 花费1000 vite生成邀请码，1000 vite会算作交易所收益，分给持有VX的用户
        .dot
    .illustrate 使用邀请码的用户交易过程中产生手续费，产生手续费的 5%，视为邀请用户产生的交易手续，可进行挖矿VX
        .dot
    .illustrate 使用邀请码的用户，在交易过程过程中手续费可9折
        .dot

</template>

<script>
import { getInviteeCode, bindCode } from 'services/tradeOperation';
import { doUntill } from 'utils/asyncFlow';

export default {
    async beforeMount() {
        await this.getInviteeCode();
        this.status = 'LOADED';
    },
    data() {
        return {
            status: 'LOADING', // "ERROR" "LOADING" "LOADED"
            dTitle: '接受邀请',
            inviteeCode: null,
            code: ''
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        dSTxt() {
            return !this.inviteeCode && '接受邀请';
        },
        dBtnUnuse() {
            return !/\d{1,10}/.test(this.code);
        }
    },
    methods: {
        async getInviteeCode() {
            this.inviteeCode = await getInviteeCode(this.address);
        },
        inspector() {
            bindCode(this.code).then(doUntill(() => this.getInviteeCode(), undefined, 1000, 3));
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.bg-img {
    height: 140px;
    width: 140px;
    margin: 0 auto 29px;
}
.block__title {
    height: 16px;
    font-size: 12px;
    @include font-family-bold();
    color: rgba(29, 32, 36, 1);
    line-height: 16px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .right {
        color: #767f8b;
        font-size: 12px;
    }
    &:first-child {
        margin-top: 0;
    }
}

.block__content {
    position: relative;
    height: 34px;
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    font-size: 12px;
    word-break: break-word;
    width: 100%;
    line-height: 34px;
    box-sizing: border-box;
    margin-top: 16px;
    padding: 10px 15px;
    align-items: center;
    display: flex;
    width: 100%;
    justify-content: space-between;

    .all {
        border-radius: 2px;
        background: #007aff;
        color: #fff;
        cursor: pointer;
        font-size: 12px;
        padding: 0 6px;
        height: 18px;
        line-height: 18px;
        float: right;
        display: flex;
        word-break: keep-all;
    }
    .token__title {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 20px;
            height: 20px;
            margin-right: 20px;
        }
    }
    input {
        width: 100%;
    }
    .light {
        color: #5e6875;
    }
    .blue {
        color: #007aff;
    }
    &.edit {
        text-align: left;
        background-color: rgba(176, 192, 237, 0.42);
        border: 1px solid #d4dee7;
        @include font-family-bold();
    }
}
.illustrate {
    font-size: 12px;
    color: #5e6875;
    line-height: 16px;
    padding-left: 13px;
    margin-top: 12px;
    position: relative;
    width: 100%;
    .dot {
        width: 4px;
        height: 4px;
        background: rgba(0, 122, 255, 1);
        border-radius: 100%;
        position: absolute;
        left: 0;
        top: 6px;
    }
}
.invite-code {
    height: 56px;
    border-radius: 2px;
    border: 1px dashed rgba(0, 122, 255, 0.7);
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    color: #1d2024;
    @include font-family-bold();
    justify-content: center;
}
</style>

