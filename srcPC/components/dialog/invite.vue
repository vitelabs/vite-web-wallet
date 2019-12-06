<template lang="pug">
extends /components/dialog/base.pug
block content
    img.bg-img(src="~assets/imgs/invite.png")
    div(v-if="inviteCode")
        .invite-code {{$t('assets.invite.myCode')}}{{this.inviteCode}}
            img.copy-share.__pointer(src="~assets/imgs/share.svg" @click="copyShare()")
            img.copy.__pointer(src="~assets/imgs/copy_default.svg" @click="copy")
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
    div.__row(v-else)
        .__row_t {{ $t('assets.invite.cost') }}
            .__err(v-if="this.avaliableExAmount && Number(this.avaliableExAmount) >= 1000") {{$t('assets.invite.avaliable')}} {{`${avaliableExAmount||0}VITE`}}
            .__err(v-else) {{$t('assets.invite.notEnough')}}
        .__input_row.__unuse_input 1000 VITE
    .__row.__row_t {{$t('assets.invite.inviteRule')}}
    .__hint(v-for="(i,j) in $t('assets.invite.ruleItems')")
        span(v-html="i")
</template>

<script>
import { getInviteInfo } from 'services/trade';
import { getCode } from 'services/viteServer';
import { genCode } from 'pcServices/tradeOperation';
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
            genCode()
                .then(() => {
                    this.$toast(this.$t('assets.invite.successToast'));
                    doUntill({
                        createPromise: () => this.getCode(),
                        interval: 1000,
                        times: 3
                    }).then(res => {
                        console.log(res);
                    }).catch(e => {
                        this.$toast(this.$t('assets.invite.noResult'), e);
                    });
                })
                .catch(e => {
                    this.$toast(this.$t('assets.invite.failToast'), e);
                });
            return Promise.reject('no close');
        },
        copyShare() {
            copy(`https://growth.vite.net${
                process.env.NODE_ENV === 'production' ? '' : '/test'
            }/vitex-board?ldfjacia=${ this.inviteCode }`);
            this.$toast(this.$t('hint.copyShare'));
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
@import './invite.scss';
</style>
