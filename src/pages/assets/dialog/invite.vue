<template lang="pug">
extends /components/dialog/base.pug
block content
    img.bg-img(src="~assets/imgs/invite.png")
    div(v-if="inviteCode")
        .invite-code
            img.title_icon.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copy")
        .invite-info
            .item.num
            .item.benifit
    div(v-else)
        .block__title {{ $t(`tradeAssets.confirmrecharge.lable1`) }}
            .right 可用余额kkkkkEth
        .block__content.edit.space dsfsfafsf
        .block__title 邀请规则
    .illustrate sdfasdfasfdasfsafdasfd
        .dot
    .illustrate sdfasdfasfdasfsafdasfd
        .dot
    .illustrate sdfasdfasfdasfsafdasfd
        .dot

</template>

<script>
import { getInviteInfo, getCode, genCode } from 'services/tradeOperation';
import copy from 'utils/copy';
import { doUntill } from 'utils/asyncFlow';

export default {
    async beforeMount() {
        await this.getCode();
        this.inviteInfo = await getInviteInfo(this.address);
        this.status = 'LOADED';
    },
    data() {
        return {
            status: 'LOADING', // "ERROR" "LOADING" "LOADED"
            dTitle: '邀请好友',
            inviteCode: 0,
            inviteInfo: null
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        dSTxt() {
            return '生成邀请码';
        }
    },
    methods: {
        async getCode() {
            this.inviteCode = await getCode(this.address);
            return this.inviteCode;
        },
        inspector() {
            genCode().then(() => doUntill(() => this.getCode(), undefined, 1000, 3));
            return Promise.reject('no close');
        },
        copy() {
            copy(this.address);
            this.$toast(this.$t('hint.copy'));
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
        border: 1px solid #D4DEE7  ;
        @include font-family-bold();
    }
}
.illustrate {
    height: 18px;
    font-size: 14px;
    color: rgba(94, 104, 117, 1);
    line-height: 18px;
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
        top: 8px;
    }
}
.invite-code {
}
.invite-info {
    .item {
        .num {
        }
        .benifit {
        }
    }
}
</style>

