<template lang="pug">
extends /components/dialog/base.pug
block content
    span.bg-img
    div(v-if="inviteeCode && +inviteeCode!==0")
        .invite-code {{ $t('assets.invite.invited') }}{{ this.inviteeCode }}
    div.__row(v-else)
        .__row_t {{ $t('assets.invite.codeLable') }}
            .__err(v-if="formatErr") {{ $t('assets.invite.formatErr') }}
        vite-input(v-model="code")
    .__row.__row_t {{ $t('assets.invite.inviteRule') }}
    .__hint(v-for="(i,j) in $t('assets.invite.receiveRuleItems')" :key="j")
        span(v-html="i")
</template>

<script>
import viteInput from 'components/viteInput';
import { bindCode } from 'pcServices/tradeOperation';
import { doUntill } from 'utils/asyncFlow';
import { emptySpace } from 'pcUtils/storageSpace';
import router from 'pcRouter';

export default {
    components: { viteInput },
    async beforeMount() {
        try {
            await this.getInviteeCode();
        } catch (e) {
            console.log('get bind code error', e);
        }
        const code = emptySpace.getItem('INVITE_CODE');
        if (code) {
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
            bindCode(this.code)
                .then(() => {
                    this.$toast(this.$t('assets.invite.successToast'));
                    doUntill({
                        createPromise: () => this.getInviteeCode(),
                        interval: 1000,
                        times: 3
                    }).then(res => {
                        console.log('code', res);
                    }).catch(e => {
                        this.$toast(this.$t('assets.invite.noResult'), e);
                    });
                })
                .catch(e => {
                    if (e && e.error && e.error.code === 12002) {
                        router.push({ name: 'startLogin' });
                        this.close();
                        return;
                    }
                    this.$toast(this.$t('assets.invite.failToast'), e);
                });
            return Promise.reject('no close');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import './invite.scss';
</style>

