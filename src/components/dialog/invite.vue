<template lang="pug">
extends /components/dialog/base.pug
block content
    img.bg-img(src="~assets/imgs/invite.png")
    div(v-if="inviteCode")
        .invite-code {{$t('assets.invite.myCode')}}{{this.inviteCode}}
            img.title_icon.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copy")
        .invite-info
            .item
                img.left(src="~assets/imgs/invite_num.png")
                .right
                    .label {{ $t('assets.invite.inviteNum') }}
                    .content {{inviteInfo&&inviteInfo.inviteCount||0}}

            .item
                img.left(src="~assets/imgs/invite_benifit.png")
                .right
                    .label {{ $t('assets.invite.inviteBenifit') }}
                    .content {{(inviteInfo&&inviteInfo.miningTotal)?formatNum(inviteInfo.miningTotal):0}}
    div(v-else)
        .block__title {{ $t('assets.invite.cost') }}
            .right(v-if="this.avaliableExAmount && Number(this.avaliableExAmount) >= 1000") {{$t('assets.invite.avaliable')}} {{`${avaliableExAmount||0}VITE`}}
            .right(v-else) {{$t('assets.invite.notEnough')}}
        .block__content.edit.space 1000 VITE
    .block__title {{$t('assets.invite.inviteRule')}}
    .illustrate(v-for="(i,j) in $t('assets.invite.ruleItems')")
        span(v-html="i")
        .dot

</template>

<script>
import { getInviteInfo, getCode, genCode } from 'services/tradeOperation';
import copy from 'utils/copy';
import { doUntill } from 'utils/asyncFlow';
import { VITE_TOKENID } from 'utils/constant';
import bn from 'utils/bigNumber';

export default {
    async beforeMount() {
        await this.getCode();
        this.inviteInfo = await getInviteInfo(this.address);
        this.status = 'LOADED';
    },
    data() {
        return {
            status: 'LOADING', // "ERROR" "LOADING" "LOADED"
            dTitle: this.$t('assets.invite.inviteTitle'),
            inviteCode: 0,
            inviteInfo: null
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        dSTxt() {
            return !this.inviteCode && this.$t('assets.invite.genCode');
        },
        avaliableExAmount() {
            return (
                this.$store.getters.exBalanceList[VITE_TOKENID]
                && this.$store.getters.exBalanceList[VITE_TOKENID].available
            );
        },
        dBtnUnuse() {
            return !(
                this.avaliableExAmount && Number(this.avaliableExAmount) >= 1000
            );
        }
    },
    methods: {
        formatNum(n) {
            return bn.normalFormatNum(n);
        },
        async getCode() {
            this.inviteCode = await getCode(this.address);
            return this.inviteCode;
        },
        inspector() {
            genCode().then(() => {
                this.$toast(this.$t('assets.invite.successToast'));
                doUntill({
                    createPromise: () => this.getCode(),
                    interval: 1000,
                    times: 3
                })
                    .then(res => {
                        console.log(res);
                    })
                    .catch(e => {
                        this.$toast(this.$t('assets.invite.noResult'), e);
                    });
            }).catch(e => {
                this.$toast(this.$t('assets.invite.failToast'), e);
            });
            return Promise.reject('no close');
        },
        copy() {
            copy(this.inviteCode);
            this.$toast(this.$t('hint.copy'));
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
/deep/ .strong{
    color: #1D2024;
    @include font-family-bold();
}
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
    .copy {
        position: absolute;
        right: 15px;
    }
}
.invite-info {
    display: flex;
    justify-content: space-between;
    border-radius: 2px;
    height: 56px;
    margin-top: 23px;
    .item {
        background: rgba(0, 122, 255, 0.05);
        padding: 9px 15px;
        display: flex;
        align-items: center;
        width: calc(50% - 10px);
        box-sizing: border-box;
        .left {
            height: 24px;
            width: 24px;
            margin-right: 15px;
        }
        .right {
            display: flex;
            flex-direction: column;
            .label {
                color: #5e6875;
                font-size: 12px;
            }
            .content {
                color: #1d2024;
                font-size: 14px;
                @include font-family-bold();
            }
        }
    }
}
</style>

