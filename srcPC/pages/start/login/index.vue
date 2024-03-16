<template>
    <div class="login-wrapper">
        <div class="switch-btn">
            <div
                v-show="!isTestnet"
                class="btn"
                :class="{ active: tabName === 'vb' }"
                @click="toggleTab('vb')"
                :key="'tb'"
            >
                {{ $t('assets.vb.title') }}
            </div>
            <div
                v-show="!isTestnet"
                v-if="!isDesktop"
                class="btn __pointer"
                :class="{ active: tabName === 'ledger' }"
                @click="toggleTab('ledger')"
                :key="'ledger'"
            >
                {{ $t('assets.ledger.title') }}
            </div>
            <div
                v-show="isHaveList"
                class="btn __pointer"
                :class="{ active: tabName === 'existingAcc' }"
                @click="toggleTab('existingAcc')"
                :key="'existingAcc'"
            >
                {{ $t('existingAcc') }}
            </div>
            <div
                class="btn __pointer"
                :class="{ active: tabName === 'resotre' }"
                @click="toggleTab('resotre')"
                :key="'resotre'"
            >
                {{ $t('restore') }}
            </div>
            <div
                class="btn __pointer"
                :class="{ active: tabName === 'vitePassport' }"
                @click="toggleTab('vitePassport')"
                :key="'vitePassport'"
            >
                {{ $t('assets.vitePassport.title') }}
            </div>
        </div>

        <div class="tab-content">
            <figure class="image">
                <img srcset="@pc/assets/login-bg@2x.png 2x,
                    @pc/assets/login-bg.png 1x"
                    src="@pc/assets/login-bg.png" alt="login background image">
            </figure>
            <div class="container">
                <h3 class="title">{{ $t('login') }}</h3>
                <div class="vb box" v-if="tabName === 'vb'">
                    <div class="box-content">
                        <div class="box-title">{{ $t('assets.vb.start.scan') }}</div>
                        <qrcode
                            :options="qrcodeOpt"
                            :text="vb && vb.uri"
                            class="vb_qrcode"
                        ></qrcode>
                    </div>
                    <div class="box-footer">
                        <div class="code_tips">
                            <p>{{ $t('assets.vb.start.downloadTips') }}</p>
                            <a href="https://app.vite.net/" target="_blank">{{ $t('assets.vb.start.download') }}</a>
                        </div>
                        <div class="actions">
                            <button class="btn active __pointer" @click="createAcc">
                                {{ $t('addAccount') }}
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Ledger wallet login panel -->
                <div class="ledger box" v-if="tabName === 'ledger'">
                    <div class="box-content">
                        <div class="box-title">{{ $t('assets.ledger.start.title') }}</div>
                        <div class="img_wrapper">
                            <img src="@assets/imgs/ledger_logo.svg" alt="" />
                        </div>
                    </div>
                    <div class="box-footer">
                        <div class="code_tips_introduction">
                            <a :href="$t('assets.ledger.start.introductionUrl')" target="_blank">{{ $t('assets.ledger.start.introduction') }}</a>
                            <br />
                            <a :href="$t('assets.ledger.start.connectErrorUrl')" target="_blank">{{ $t('assets.ledger.start.connectError') }}</a>
                        </div>
                        <div class="actions">
                            <button class="btn active __pointer" @click="connectLedger()">{{ $t('assets.ledger.connectLedger') }}</button>
                        </div>
                    </div>
                </div>
                <div v-if="tabName === 'existingAcc'" class="existing-acc box">
                    <div class="box-content">
                        <div
                            class="bottom __btn __pointer"
                            v-click-outside.includeChildrens="hideAccountList"
                        >
                            <div @click="toggleAccountList">
                                <div
                                    v-show="
                                        currAcc &&
                                            !currAcc.activeAddr &&
                                            !currAcc.isSeparateKey
                                    "
                                    class="__btn __btn_input"
                                >
                                    <div class="name __ellipsis">
                                        {{ currAcc.name }}
                                    </div>
                                </div>

                                <account-item
                                    v-show="currAcc && currAcc.activeAddr"
                                    :account="currAcc"
                                ></account-item>

                                <span
                                    :class="{
                                        slide: true,
                                        down: !isShowAccountList,
                                        up: isShowAccountList
                                    }"
                                ></span>
                            </div>
                            <account-list
                                ref="accList"
                                v-show="isShowAccountList"
                                :clickAccount="chooseAccount"
                            ></account-list>
                        </div>

                        <div
                            class="bottom __btn __btn_input"
                            :class="{ active: !!password || inputItem === 'pass' }"
                        >
                            <input
                                ref="passInput"
                                autofocus
                                :placeholder="$t('create.input')"
                                v-model="password"
                                :type="'password'"
                                @focus="inputFocus('pass')"
                                @blur="inputBlur('pass')"
                            />
                        </div>
                    </div>
                    
                    <div class="box-footer">
                        <div class="tips"></div>
                        <div class="actions">
                            <span
                                class="btn active __pointer"
                                @click="createAcc"
                            >
                                {{ $t('addAccount') }}
                            </span>
                            <div class="btn active __pointer" @click="login">
                                <span v-show="!isLoading">
                                    {{
                                        isShowExisting
                                            ? $t('btn.login')
                                            : $t('create.finish')
                                    }}
                                </span>
                                <loading v-show="isLoading" loadingType="dot"></loading>
                            </div>
                        </div>
                    </div>
                </div>

                <restore
                    ref="restoreDom"
                    v-if="tabName === 'resotre'"
                    :leftClick="createAcc"
                    leftTxt="createAcc"
                    :finishCb="showExisting"
                ></restore>
                
                <div class="vitePassport box" v-if="tabName === 'vitePassport'">
                    <div class="box-content">
                        <div class="box-title">{{ $t('assets.vitePassport.subtitle') }}</div>
                    </div>
                    <div class="box-footer">
                        <div class="tips">
                            <a :href="$t('assets.vitePassport.helpLink')" target="_blank">{{  $t('assets.vitePassport.help') }}</a>
                        </div>
                        <div class="actions">
                            <button class="btn active __pointer" @click="connectVitePassport">
                                <span v-show="!isLoading">{{ $t('assets.vitePassport.connect') }}</span>
                                <loading v-show="isLoading" loadingType="dot"></loading>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import loading from '@components/loading.vue';
import ellipsisAddr from '@utils/ellipsisAddr.js';
import { getAppLink } from '@utils/getLink';
import openUrl from '@utils/openUrl';
import { getList, deleteOldAcc } from '@pc/wallet';
import * as DnsHost from '@services/dnsHostIP';

import accountItem from './accountItem.vue';
import restore from './restore.vue';
import accountList from './accountList.vue';
import { hwAddressSelectDialog } from '@pc/components/dialog';

import qrcode from '@components/qrcode.vue';
import { initVB } from '@pc/wallet/vb';
import icon from '@assets/imgs/start_qrcode_icon.svg';

const TABNAME = {
    vb: 'vb',
    existingAcc: 'existingAcc',
    restore: 'restore',
    ledger: 'ledger',
    vitePassport: 'vitePassport'
};

export default {
    components: { accountList, loading, restore, accountItem, qrcode },
    destroyed() {
        this.clearAll();
    },
    data() {
        const list = getList();
        return {
            id: this.$route.params.id,
            currAcc: {},
            password: '',
            inputItem: '',
            isLoading: false,
            isShowAccountList: false,
            tabName: TABNAME.vb,
            qrcodeOpt: {
                size: 240,
                image: icon,
                mSize: 0.3
            },
            isHaveList: list && list.length,
            vb: null
        };
    },
    beforeMount() {
        if (this.id) {
            this.showExisting(this.id);
            return;
        }
        if (this.tabName === 'vb') {
            this._initVB();
        } else if (this.tabName === 'existingAcc') {
            this.init();
        }
    },
    beforeDestroy() {
        this.destoryVB();
    },
    computed: {
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        },
        isShowExisting() {
            return this.tabName === 'existingAcc';
        },
        isDesktop() {
            return window.DESKTOP;
        },
        isTestnet() {
            return import.meta.env.VITE_NETWORK == 'testnet';
        },
        autoReceive() {
            return this.$store.state.env.autoReceive;
        }
    },
    methods: {
        getWallet() {
            openUrl(getAppLink(this.$i18n.locale));
        },
        destoryVB() {
            console.log('destory vb');
        },
        init() {
            this.$onKeyDown(13, () => {
                this.login();
            });
            this.currAcc = this.getCurrAcc();
        },
        clearAll() {
            this.password = '';
            this.isLoading = false;
            this.$offKeyDown();
        },
        showExisting(id) {
            this.id = id;
            this.isHaveList = true;
            this.toggleTab('existingAcc');
        },
        _initVB() {
            if (DnsHost.Server.isReady) {
                this.initVB();
            } else {
                DnsHost.onReady(() => {
                    this.initVB();
                });
            }
            if (this.isTestnet) {
                this.toggleTab('resotre');
            }
        },
        initVB() {
            this.vb = initVB();
            this.vb.on('connect', () => {
                const name = this.$store.state.env.lastPage || 'tradeCenter';
                this.$router.push({ name });
            });
            this.vb.on('disconnect', () => {
                this.$route.name.indexOf('start') > -1 && this.initVB();
            });
        },
        toggleTab(tabName) {
            if (this.tabName === tabName) return;

            if (this.tabName !== 'vb' && tabName === 'vb') {
                this.initVB();
            } else if (this.tabName === 'vb' && tabName !== 'vb') {
                this.destoryVB();
            }

            if (this.tabName !== 'existingAcc' && tabName === 'existingAcc') {
                this.init();
                this.$refs.accList && this.$refs.accList.initAccountList();
            } else if (
                this.tabName === 'existingAcc'
                && tabName !== 'existingAcc'
            ) {
                this.clearAll();
            }

            this.tabName = tabName;
        },

        getCurrAcc() {
            const list = getList();

            // First: from router
            if (this.id) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id === this.id) {
                        const account = list[i];
                        account.showAddr = account.activeAddr
                            ? ellipsisAddr(account.activeAddr)
                            : '';
                        return account;
                    }
                }
            }

            // Second: from current
            if (this.currHDAcc && !this.currHDAcc.isSeparateKey) {
                return {
                    id: this.currHDAcc.id,
                    showAddr: this.currHDAcc.activeAddr
                        ? ellipsisAddr(this.currHDAcc.activeAddr)
                        : '',
                    name: this.currHDAcc.name || '',
                    ...this.currHDAcc
                };
            }

            // Finally: from list[0]
            const account = list[0];
            account.showAddr = account.activeAddr
                ? ellipsisAddr(account.activeAddr)
                : '';
            return account;
        },

        inputFocus(text) {
            this.inputItem = text;
        },
        inputBlur(text) {
            text === this.inputItem && (this.inputItem = '');
        },
        focusPass() {
            Vue.nextTick(() => {
                this.$refs.passInput && this.$refs.passInput.focus();
            });
        },

        chooseAccount(account) {
            this.currAcc = account;
            this.isShowAccountList = false;
            this.password = '';
        },
        toggleAccountList() {
            this.isShowAccountList = !this.isShowAccountList;
        },
        hideAccountList() {
            this.isShowAccountList = false;
        },

        createAcc() {
            this.$router.push({ name: 'startCreate' });
        },
        login() {
            if (!this.isShowExisting) {
                this.$refs.restoreDom && this.$refs.restoreDom.valid();
                return;
            }

            if (!this.currAcc || this.isLoading) {
                return;
            }

            if (!this.password) {
                this.$toast(this.$t('create.input'), 'error');
                this.focusPass();
                return;
            }

            this.isLoading = true;

            this.$store.commit('switchHDAcc', this.currAcc);
            this.$store
                .dispatch('login', this.password)
                .then(() => {
                    if (!this.isLoading) {
                        return;
                    }
                    this.isLoading = false;

                    if (!this.currAcc.id && this.currAcc.entropy) {
                        deleteOldAcc(this.currAcc);
                    }

                    this.currHDAcc.activate(this.autoReceive);
                    const name
                        = this.$store.state.env.lastPage || 'tradeCenter';
                    this.$router.push({ name });
                })
                .catch(err => {
                    console.warn(err);
                    if (!this.isLoading) {
                        return;
                    }
                    this.isLoading = false;
                    this.$toast(this.$t('hint.pwErr'));
                });
        },
        connectLedger() {
            hwAddressSelectDialog({ width: 'wide' }).then(({ status }) => {
                if (status === 'CONFIRMED') {
                    const name
                        = this.$store.state.env.lastPage || 'tradeCenter';
                    this.$router.push({ name });
                }
            });
        },
        async connectVitePassport() {
            if (window?.vitePassport) {
                this.isLoading = true;
                try {
                    let address = await window.vitePassport.getConnectedAddress();
                    if (address) {
                        await window.vitePassport.disconnectWallet();
                    }
                    await window.vitePassport.connectWallet();

                    this.isLoading = false;
                    const name = this.$store.state.env.lastPage || 'tradeCenter';
                    this.$router.push({ name });
                } catch (error) {
                    this.isLoading = false;
                    this.$toast(error.message);
                }
            } else {
                this.$toast(this.$t('assets.vitePassport.notDetected'));
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
@use '../start.scss';

.no-border {
    border: none;
}

.login-wrapper {
    margin-top: 60px;
    padding-bottom: 80px;

    .bottom {
        margin-bottom: 20px;
    }

    .slide {
        display: inline-block;
        position: absolute;
        top: 20%;
        right: 20px;
        width: 16px;
        height: 16px;
        margin-top: -6px;

        &.down {
            background: url("@assets/imgs/down_icon.svg");
            background-size: 16px 16px;
        }

        &.up {
            background: url("@assets/imgs/up_icon.svg");
            background-size: 16px 16px;
        }
    }

    .switch-btn {
        display: flex;
        flex-flow: wrap;
        row-gap: 20px;
        justify-content: space-between;
    }

    .tab-content {
        margin-top: 30px;
        position: relative;
        border-radius: 12px;
        box-shadow: 4px 4px 6px 0px rgba(0, 0, 0, 0.5);
        min-height: 623px;
        background: #fff;
        .image {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            margin: 0;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            background: linear-gradient(180deg,#00beff 32.8%,#00ff95 94.95%);
            img {
                display: block;
            }
        }
        .container {
            box-sizing: border-box;
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 30px 40px;
            h3.title {
                font-size: 64px;
                line-height: 1.3;
                margin: 0 0 20px;
            }
        }
    }

    .vb {
        .code_container {
            box-sizing: border-box;
            margin-bottom: 20px;
            font-size: 14px;
            .code_tips {
                word-break: break-all;
                color: #333333;
                line-height: 18px;
                .action_get_app {
                    @include primary_color();
                    font-size: 14px;
                    font-family: $font-bold;
                    cursor: pointer;
                    margin-left: 2px;
                    word-break: keep-all;
                }
            }
        }
    }

    .ledger {
        .box-title {
            width: 300px;
        }
        .img_wrapper {
            width: 326px;
            margin-top: 60px;
        }
    }
}
</style>
