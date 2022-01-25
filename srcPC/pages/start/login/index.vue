<template>
    <div class="login-wrapper">
        <div class="__title">{{ $t("login") }}</div>

        <div
            class="switch-btn"
        >
            <div
                v-show="!isTestnet"
                class="btn-item __pointer"
                :class="{ active: tabName === 'vb' }"
                @click="toggleTab('vb')"
                :key="'tb'"
            >
                <div class="star"></div>
                {{ $t("assets.vb.title") }}
            </div>
            <div
                v-show="!isTestnet"
                v-if="!isDesktop"
                class="btn-item __pointer"
                :class="{ active: tabName === 'ledger' }"
                @click="toggleTab('ledger')"
                :key="'ledger'"
            >
                <div class="star"></div>
                {{ $t("assets.ledger.title") }}
            </div>
            <div
                v-show="isHaveList"
                class="btn-item __pointer"
                :class="{ active: tabName === 'existingAcc' }"
                @click="toggleTab('existingAcc')"
                :key="'existingAcc'"
            >
                {{ $t("existingAcc") }}
            </div>
            <div
                class="btn-item __pointer"
                :class="{ active: tabName === 'resotre' }"
                @click="toggleTab('resotre')"
                :key="'resotre'"
            >
                {{ $t("restore") }}
            </div>
        </div>
        <div class="tab-content">
            <div class="vb" v-if="tabName === 'vb'">
                <div class="code_container">
                    <div class="code_tips">
                        {{ $t("assets.vb.start.scan") }}
                    </div>
                    <qrcode
                        :options="qrcodeOpt"
                        :text="vb && vb.uri"
                        class="vb_qrcode"
                    ></qrcode>
                    <div class="code_tips">
                        {{ $t("assets.vb.start.downloadTips")
                        }}<span class="action_get_app" @click="getWallet"
                        >{{ $t("assets.vb.start.download") }}&rarr;</span
                        >
                    </div>
                </div>
                <div class="__btn __btn_all_in __pointer" @click="createAcc">
                    {{ $t("addAccount") }}
                </div>
            </div>
            <!-- Ledger wallet login panel -->
            <div class="ledger" v-if="tabName === 'ledger'">
                <div class="code_container">
                    <div class="code_tips">
                        {{ $t("assets.ledger.start.title") }}
                    </div>
                    <div class="img_wrapper">
                        <img src="~assets/imgs/ledger_logo.svg" alt="">
                    </div>
                    <div class="code_tips_introduction">
                        <a :href="$t('assets.ledger.start.introductionUrl')" target="_blank">{{ $t("assets.ledger.start.introduction") }}</a>
                        <a :href="$t('assets.ledger.start.connectErrorUrl')" target="_blank">{{ $t("assets.ledger.start.connectError") }}</a>
                    </div>
                </div>
                <div class="__btn __btn_all_in __pointer" @click="connectLedger()">
                    {{ $t("assets.ledger.connectLedger") }}
                </div>
            </div>
            <div v-if="tabName === 'existingAcc'" class="existing-acc">
                <div class="bottom __btn __pointer" v-click-outside.includeChildrens="hideAccountList">
                    <div @click="toggleAccountList">
                        <div v-show="currAcc && !currAcc.activeAddr && !currAcc.isSeparateKey" class="__btn __btn_input">
                            <div class="name __ellipsis">
                                {{ currAcc.name }}
                            </div>
                        </div>

                        <account-item class="no-border"
                                      v-show="currAcc && currAcc.activeAddr"
                                      :account="currAcc"></account-item>

                        <span :class="{
                            slide: true,
                            down: !isShowAccountList,
                            up: isShowAccountList
                        }" ></span>
                    </div>

                    <account-list ref="accList" v-show="isShowAccountList"
                                  :clickAccount="chooseAccount"></account-list>
                </div>

                <div class="bottom __btn __btn_input"
                     :class="{ active: !!password || inputItem === 'pass' }">
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

                <div class="__btn_list">
                    <span
                        class="__btn __btn_border __pointer"
                        @click="createAcc"
                    >
                        {{ $t("addAccount") }}
                    </span>
                    <div class="__btn __btn_all_in __pointer" @click="login">
                        <span v-show="!isLoading">
                            {{
                                isShowExisting
                                    ? $t("btn.login")
                                    : $t("create.finish")
                            }}
                        </span>
                        <loading v-show="isLoading" loadingType="dot"></loading>
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
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import loading from 'components/loading.vue';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import { getAppLink } from 'utils/getLink';
import openUrl from 'utils/openUrl';
import { getList, deleteOldAcc } from 'wallet';
import * as DnsHost from 'services/dnsHostIP';


import accountItem from './accountItem.vue';
import restore from './restore.vue';
import accountList from './accountList.vue';
import { hwAddressSelectDialog } from 'pcComponents/dialog';

import qrcode from 'components/qrcode';
import { initVB } from 'wallet/vb';
import icon from 'assets/imgs/start_qrcode_icon.svg';

const TABNAME = {
    vb: 'vb',
    existingAcc: 'existingAcc',
    restore: 'restore',
    ledger: 'ledger'
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
            return process.env.VITE_NET !== 'mainnet';
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
            if(this.isTestnet){
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

                    this.currHDAcc.activate();
                    const name = this.$store.state.env.lastPage || 'tradeCenter';
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
                    const name = this.$store.state.env.lastPage || 'tradeCenter';
                    this.$router.push({ name });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../start.scss";

.no-border {
    border: none;
}

.login-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    .__title {
        [data-theme="0"] & {
            color: #fff;
        }
        [data-theme="1"] & {
            color: #fff;
        }
    }
    .__btn {
        position: relative;
        &.__btn_input {
            .name {
                width: 89%;
            }
        }
    }

    .bottom {
        margin-bottom: 20px;
    }

    .slide {
        display: inline-block;
        position: absolute;
        top: 50%;
        right: 20px;
        width: 16px;
        height: 16px;
        margin-top: -6px;

        &.down {
            background: url("~assets/imgs/down_icon.svg");
            background-size: 16px 16px;
        }

        &.up {
            background: url("~assets/imgs/up_icon.svg");
            background-size: 16px 16px;
        }
    }

    .switch-btn {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        border-radius: 16px;
        background: #007aff;
        box-shadow: 0 0 4px 0 rgba(0, 105, 219, 1);
        &.no-padding-left {
            padding-left: 0;
        }
        &.no-padding-right {
            padding-right: 0;
        }

        .btn-item {
            align-items: center;
            margin: 0 12px;
            display: flex;
            color: #fff;
            font-size: 14px;
            @include font-family-bold();
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 18px;
            .star {
                height: 10px;
                width: 10px;
                margin-right: 4px;
                background-image: url(~assets/imgs/star.png);
                background-size: contain;
                background-repeat: no-repeat;
            }
            &.active {
                background: rgba(51, 187, 255, 1);
                border-radius: 16px;
                padding: 6px 12px;
                box-shadow: 0 0 4px 0 rgba(0, 105, 219, 1);
                &:first-child{
                    margin-left: 0;
                }
                &:last-child{
                    margin-right: 0;
                }
            }
        }
    }
    .tab-content {
        width: 360px;
    }
    .vb {
        width: 100%;

        .code_container {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
            background: #fff;
            margin-bottom: 20px;
            font-size: 14px;
            border-radius: 2px;
            .code_tips {
                word-break: break-all;
                text-align: left;
                color: #333333;
                line-height: 18px;
                .action_get_app {
                    color: #007aff;
                    font-size: 14px;
                    font-family: $font-bold;
                    cursor: pointer;
                    margin-left: 2px;
                    word-break: keep-all;
                }
            }
            .vb_qrcode {
                margin: 30px auto;
            }
        }
    }
    .ledger {
        width: 100%;
        .code_container {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
            background: #fff;
            margin-bottom: 20px;
            font-size: 14px;
            .img_wrapper {
                margin: 30px 0;
            }
            .code_tips {
                text-align: left;
                word-break: break-all;
                color: #333333;
                line-height: 18px;
            }
            .code_tips_introduction {
                color: $blue-color-1;
                font-size: 14px;
                display: flex;
                flex-direction: row;
                a {
                    color: $blue-color-1;
                    flex: 1;
                    &:first-child {
                        text-align: left;
                    }
                    &:last-child {
                        text-align: right;
                    }
                }
            }
        }
    }
}
</style>

