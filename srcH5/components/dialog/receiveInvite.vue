<template lang="pug">
extends /components/dialog/base.pug
block content
    img.bg-img(src="~assets/imgs/invite.png")
    div(v-if="inviteeCode && +inviteeCode!==0")
        .invite-code {{$t('assets.invite.invited')}}{{this.inviteeCode}}
    div(v-else)
        .block__title {{ $t('assets.invite.codeLable') }}
            .err(v-if="formatErr") {{$t('assets.invite.formatErr')}}
        vite-input.invite-input(v-model="code")
    .block__title {{$t('assets.invite.inviteRule')}}
    .illustrate(v-for="(i,j) in $t('assets.invite.receiveRuleItems')" :key="j")
        span(v-html="i")
        .dot

</template>

<script>
import { doUntill } from 'utils/asyncFlow';
import sendTx from 'h5Utils/sendTx';
import { getItem } from 'h5Utils/storage';
import viteInput from 'components/viteInput';

export default {
    components: { viteInput },
    async beforeMount() {
        try {
            await this.getInviteeCode();
        } catch (e) {
            console.log('get bind code error', e);
        }

        const code = getItem('inviteeCode');
        if (code > 0) {
            this.code = `${ code }`;
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
                (!this.inviteeCode || Number(this.inviteeCode) === 0) ? this.$t('assets.invite.receiveInviteTitle') : ''
            );
        },
        formatErr() {
            return this.code !== '' && !/^\d{1,10}$/.test(this.code);
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
            sendTx({
                methodName: 'dexBindInviteCode',
                data: { code: this.code }
            }).then(() => {
                // this.$toast(this.$t('assets.invite.successToast'));
                doUntill({
                    createPromise: () => this.getInviteeCode(),
                    interval: 1000,
                    times: 3
                }).then(res => {
                    console.log('code', res);
                }).catch(e => {
                    this.$toast(this.$t('assets.invite.noResult'), e);
                });
            }).catch(e => {
                console.warn(e);
                // if (e && e.error && e.error.code === 12002) {
                //     router.push({ name: 'startLogin' });
                //     this.close();
                //     return;
                // }
                // this.$toast(this.$t('assets.invite.failToast'), e);
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
    margin-top: 12px;
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
.invite-input {
    margin-top: 12px;
}

input {
    text-indent: 0;
}

.illustrate {
    font-size: 12px;
    color: #5e6875;
    line-height: 16px;
    padding-left: 13px;
    margin-top: 12px;
    position: relative;
    width: 100%;
    box-sizing: border-box;
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

