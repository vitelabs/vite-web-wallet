<template>
    <div id="vite-wallet-app" class="app-wrapper" :class="{
        'dex': $route.name.indexOf('trade') !== -1,
        'wallet': $route.name.indexOf('trade') === -1
    }">
        <router-view/>
        <notice-list></notice-list>
        <confirm class="bnb-conf" v-show="isShowConfirm" :showMask="true" :singleBtn="true"
                 :title="$t('bnbConf.title')" :closeIcon="true"
                 :close="close" :leftBtnTxt="$t('bnbConf.btn')"
                 :leftBtnClick="goLink">
            <img class="bnb-img" src="~assets/imgs/bnb.png"/>
            <div class="help-t">{{ $t('bnbConf.t1') }}</div>
            <div class="help-txt">{{ $t('bnbConf.t2') }}</div>
            <div class="help-txt">{{ $t('bnbConf.t3') }}</div>
            <div class="help-txt">{{ $t('bnbConf.t4') }}</div>
            <div class="__notice"><span>{{ $t('bnbConf.notice') }}</span></div>
        </confirm>
    </div>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import noticeList from 'pcComponents/noticeList.vue';
import { receiveInviteDialog } from 'pcComponents/dialog';
import { emptySpace } from 'pcUtils/storageSpace';
import openUrl from 'utils/openUrl';

const inviteCodeKey = 'INVITE_CODE';

export default {
    components: { noticeList, confirm },
    beforeMount() {
        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('startLoopBalance');
        this.$store.dispatch('startLoopExchangeBalance');
        this.$store.dispatch('exFetchLatestOrder');
        if (Number(this.$route.query['ldfjacia']) > 0) {
            emptySpace.setItem(inviteCodeKey, this.$route.query['ldfjacia']);
        }
        this.$store
            .dispatch('getInvitedCode')
            .then(code => Number(code) === 0 && this.checkInvite())
            .catch(() => {
                this.checkInvite();
            });
    },
    data() {
        return { isShowConfirm: true };
    },
    computed: {
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        link() {
            return this.$i18n.locale === 'zh'
                ? 'https://www.binance.com/cn/vote'
                : 'https://www.binance.com/en/vote';
        }
    },
    methods: {
        checkInvite() {
            if (Number(this.$route.query['ldfjacia']) > 0) {
                // random for avoid bloked
                if (this.$route.name === 'tradeCenter') {
                    receiveInviteDialog();
                }
            }
        },
        goLink() {
            openUrl(this.link);
        },
        close() {
            this.isShowConfirm = false;
        }
    },
    watch: {
        currHDAcc: function () {
            this.$store.dispatch('startLoopBalance');
            this.$store.dispatch('startLoopExchangeBalance');
            this.$store.dispatch('getInvitedCode');
        },
        address: function () {
            this.$store.commit('clearDexBalance');
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearPledge');
            this.$store.commit('commitClearTransList');
            this.address && this.$store.dispatch('exFetchLatestOrder');
            this.$store.dispatch('getInvitedCode').catch(console.log);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.app-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    .bnb-conf {
        z-index: 1000;
        text-align: center;
        .bnb-img {
            width: 100px;
            height: 100px;
            margin: 30px 0;
        }
    }
}

.help-t {
    @include font-family-bold();
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 12px;
    word-break: break-all;
    text-align: left;
    .link {
        color: #118bff;
    }
}

.help-txt {
    text-align: left;
    opacity: 0.66;
    font-size: 12px;
    color: #333;
    line-height: 22px;
    margin-bottom: 10px;
    word-break: break-all;
    @include font-family-bold();
}
.__notice {
    text-align: left;
}
</style>
