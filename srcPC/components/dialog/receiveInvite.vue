<template lang="pug">
extends /components/dialog/base.pug
block content
    img.bg-img(src="~assets/imgs/invite.png")
    div(v-if="inviteeCode&&+inviteeCode!==-1")
        .invite-code {{$t('assets.invite.invited')}}{{this.inviteeCode}}
    div(v-else)
        .block__title {{ $t('assets.invite.codeLable') }}
            .err(v-if="formatErr") {{$t('assets.invite.formatErr')}}
        input.block__content(v-model="code")
    .block__title {{$t('assets.invite.inviteRule')}}
    .illustrate(v-for="(i,j) in $t('assets.invite.ruleItems')" :key="j")
        span(v-html="i")
        .dot

</template>

<script>
import { bindCode } from 'pcServices/tradeOperation';
import { doUntill } from 'utils/asyncFlow';
import { emptySpace } from 'utils/storageSpace';

export default {
    async beforeMount() {
        try {
            await this.getInviteeCode();
        } catch (e) {
            console.log('get bind code error', e);
        }
        const code = emptySpace.getItem('INVITE_CODE');
        if (code) {
            this.code = code;
        }
        this.status = 'LOADED';
    },
    data() {
        return {
            status: 'LOADING', // "ERROR" "LOADING" "LOADED"
            dTitle: this.$t('assets.invite.receiveInviteTitle'),
            code: ''
        };
    },
    computed: {
        inviteeCode() {
            return this.$store.state.exchangeFee.invitedCode;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        dSTxt() {
            return (
                (!this.inviteeCode || Number(this.inviteeCode) === -1) ? this.$t('assets.invite.receiveInviteTitle') : ''
            );
        },
        formatErr() {
            return this.code !== '' && !/\d{1,10}/.test(this.code);
        },
        dBtnUnuse() {
            return this.formatErr || this.code === '';
        }
    },
    methods: {
        async getInviteeCode() {
            return this.$store.dispatch('getInvitedCode');
        },
        inspector() {
            bindCode(this.code)
                .then(() => {
                    this.$toast(this.$t('assets.invite.successToast'));
                    doUntill({
                        createPromise: () => this.getInviteeCode(),
                        interval: 1000,
                        times: 3
                    })
                        .then(res => {
                            console.log('code', res);
                        })
                        .catch(e => {
                            this.$toast(this.$t('assets.invite.noResult'), e);
                        });
                })
                .catch(e => {
                    this.$toast(this.$t('assets.invite.failToast'), e);
                });
            return Promise.reject('no close');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
/deep/ .strong {
    color: #1d2024;
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
    .err {
        color: #ff2929;
        font-size: 12px;
    }
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

