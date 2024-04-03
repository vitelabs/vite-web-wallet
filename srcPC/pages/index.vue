<template>
    <div
        id="vite-wallet-app"
        class="app-wrapper"
        :class="{
            dex: $route.name.indexOf('trade') !== -1,
            wallet: $route.name.indexOf('trade') === -1
        }"
    >
        <router-view />
        <notice-list></notice-list>
    </div>
</template>

<script>
import noticeList from '@pc/components/noticeList.vue';
import { receiveInviteDialog } from '@pc/components/dialog';
import { emptySpace } from '@pc/utils/storageSpace';
import { getValidSession, initVB } from '@pc/wallet/vb';
import * as DnsHost from '@services/dnsHostIP';
import { getCurrHDAcc, setCurrHDAcc} from '@pc/wallet';

const inviteCodeKey = 'INVITE_CODE';

export default {
    components: { noticeList },
    beforeMount() {
        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('getApiConfig');
        this.$store.dispatch('startLoopQuota');

        this.$store.dispatch('startLoopBalance');
        this.$store.dispatch('subUnreceivedTx');
        this.$store.dispatch('startLoopExchangeBalance');
        this.$store.dispatch('exFetchLatestOrder');
        this._initVC();
        this.initVitePassport();
        try {
            if (Number(this.$route.query['ldfjacia']) > 0) {
                emptySpace.setItem(inviteCodeKey,
                    this.$route.query['ldfjacia']);
            }
        } catch (err) {
            console.warn(err);
        }

        this.$store
            .dispatch('getInvitedCode')
            .then(code => Number(code) === 0 && this.checkInvite())
            .catch(() => {
                this.checkInvite();
            });
    },
    computed: {
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        activeAcc() {
            return this.$store.state.wallet.activeAcc;
        },
        maxQuota() {
            return this.$store.state.pledge.maxQuota;
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
        initVC() {
            const { isBifrost, address } = this.activeAcc || {};
            if (!isBifrost || !address) return;
            const session = getValidSession();
            if (
                session
                && Array.isArray(session.accounts)
                && session.accounts.indexOf(address) > -1
            ) {
                initVB({ lastAccount: address });
            }
        },
        _initVC() {
            if (DnsHost.Server.isReady) {
                this.initVC();
            } else {
                DnsHost.onReady(() => {
                    this.initVC();
                });
            }
        },
        async initVitePassport() {
            if (window?.vitePassport) {
                // window.vitePassport.on('networkChange', (payload) => {
                //     console.log('Vitepassport networkChange', payload.activeNetwork)
                //     console.log('currentNode', this.$store.state.env.currentNode)
                // })
                window.vitePassport.on('accountChange', (payload) => {
                    console.log('VitePassport accountChange', payload)
                    this.syncVitePassport(payload.activeAddress)
                })
                const address = await window.vitePassport.getConnectedAddress();
                this.syncVitePassport(address);
            }
        },
        async syncVitePassport (address) {
            if (!address) return;

            setCurrHDAcc({
                activeAddr: address,
                isVitePassport: true,
                isSeparateKey: true
            });
            getCurrHDAcc().unlock();

            this.$store.commit('switchHDAcc', {
                activeAddr: address,
                isVitePassport: true,
                isSeparateKey: true
            });
            this.$store.commit('setCurrHDAccStatus');
        }
    },
    watch: {
        maxQuota: function (val, preVal) {
            if (!this.$store.state.pledge.maxQuotaLoading) {
                const acc = this.$store.state.wallet.currHDAcc;
                const hasPledge = val !== '0' && !!val;
                if (acc) {
                    hasPledge
                        ? acc.receiveTask?.start({
                            checkTime: 1000,
                            transactionNumber: 5,
                            gapTime: 1000
                        })
                        : acc.receiveTask?.start({
                            checkTime: 5000,
                            transactionNumber: 5,
                            gapTime: 5000
                        });
                }
                // do sth
            }
        },
        currHDAcc: function () {
            this.$store.dispatch('startLoopBalance');
            this.$store.dispatch('startLoopQuota');
            this.$store.dispatch('subUnreceivedTx');
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
@use "@assets/scss/theme.scss" as *;

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
