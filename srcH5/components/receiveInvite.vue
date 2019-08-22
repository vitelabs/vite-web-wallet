<template lang="pug">
extends /components/dialog/base.pug
block content
    img.bg-img(src="~assets/imgs/invite.png")
    div(v-if="inviteeCode && +inviteeCode!==-1")
        .invite-code {{ $t('assets.invite.invited') }}{{ this.inviteeCode }}
    div(v-else)
        .block__title {{ $t('assets.invite.codeLable') }}
            .err(v-if="formatErr") {{ $t('assets.invite.formatErr') }}
        input.block__content(v-model="code")
    .block__title {{ $t('assets.invite.inviteRule') }}
    .illustrate(v-for="(i,j) in $t('assets.invite.ruleItems')" :key="j")
        span(v-html="i")
        .dot
</template>

<script>
import { bindCode } from 'h5Services/tradeOperation';
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
@import "~h5Components/dialog/dialog.scss";
@import "~h5Assets/scss/vars.scss";
@include block;

/deep/ .strong {
    color: #1d2024;
    @include font-bold();
}
.bg-img {
    width: 73px;
    height: 76px;
    margin: 0 auto 13px;
}

.illustrate {
    font-size: 12px;
    color: rgba(62, 74, 89, 1);
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
    height: 34px;
    border-radius: 2px;
    border: 1px dashed rgba(0, 122, 255, 0.7);
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    color: rgba(36, 39, 43, 1);
    @include font-bold();
    justify-content: center;
    font-size: 12px;
}
</style>

