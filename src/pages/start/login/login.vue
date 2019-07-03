<template>
    <div class="login-wrapper">
        <div class="__title">{{ $t("login") }}</div>

        <div class="switch-btn" :class="{ radius: tabName === 'vb' }">
            <div
                class="btn-item __pointer"
                :class="{ active: tabName === 'vb' }"
                @click="toggleTab('vb')"
                :key="'tb'"
            >
                {{ $t("existingAcc") }}
            </div>
            <div
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
        <div class="vb" v-if="tabName === 'vb'">
            <div class="code_container">
                <div class="code_tips">
                    dsfasdfasdflsjalsjlksdjfsdlfjsdlkfjsalkdfjlkdsfjsdlakfjsdalkfjasdlfsd
                </div>
                <qrcode
                    :options="qrcodeOpt"
                    :text="vb && vb.uri"
                    class="vb_qrcode"
                ></qrcode>
                <div class="code_tips">
                    dsfasdfasdflsjalsjlksdjfsdlfjsdlkfjsalkdfjlkdsfjsdlakfjsdalkfjasdlfsd<span
                        class="action_get_app"
                        >Get Vite App</span
                    >
                </div>
            </div>
            <div class="__btn __btn_all_in __pointer" @click="createAcc">
                {{ $t("addAccount") }}
            </div>
        </div>
        <div v-if="tabName === 'existingAcc'" class="existing-acc">
            <div class="bottom __btn __pointer">
                <div
                    v-click-outside="hideAccountList"
                    @click="toggleAccountList"
                >
                    <div
                        v-show="currAcc && !currAcc.activeAddr"
                        class="__btn __btn_input"
                    >
                        <div class="name __ellipsis">{{ currAcc.name }}</div>
                    </div>

                    <account-item
                        v-show="currAcc && currAcc.activeAddr"
                        class="__btn"
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
                    :placeholder="$t('startCreate.input')"
                    v-model="password"
                    :type="'password'"
                    @focus="inputFocus('pass')"
                    @blur="inputBlur('pass')"
                />
            </div>

            <div class="__btn_list">
                <span class="__btn __btn_border __pointer" @click="createAcc">
                    {{ $t("addAccount") }}
                </span>
                <div class="__btn __btn_all_in __pointer" @click="login">
                    <span v-show="!isLoading">
                        {{
                            isShowExisting
                                ? $t("btn.login")
                                : $t("startCreate.finish")
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
</template>

<script>
import Vue from "vue";
import loading from "components/loading.vue";
import ellipsisAddr from "utils/ellipsisAddr.js";
import { getList, deleteOldAcc, getCurrHDAcc } from "wallet";

import accountItem from "./accountItem.vue";
import restore from "../restore.vue";
import accountList from "./accountList.vue";

import qrcode from "components/qrcode";
import { initVB } from "wallet/vb";
import icon from "assets/imgs/start_qrcode_icon.svg";

const TABNAME = {
    vb: "vb",
    existingAcc: "existingAcc",
    restore: "restore"
};

export default {
    components: { accountList, loading, restore, accountItem, qrcode },
    destroyed() {
        this.clearAll();
    },
    data() {
        return {
            id: this.$route.params.id,
            currAcc: {},
            password: "",
            inputItem: "",
            isLoading: false,
            isShowAccountList: false,
            isShowExisting: true,
            tabName: TABNAME.vb,
            qrcodeOpt: {
                size: 140,
                image: icon,
                mSize: 0.3
            },
            vb: null
        };
    },
    beforeMount() {
        this.initVB();
    },
    beforeDestroy() {
        this.destoryVB();
    },
    computed: {
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        }
    },
    watch: {
        isShowExisting: function() {
            if (!this.isShowExisting) {
                this.clearAll();
                return;
            }

            this.init();
            this.$refs.accList && this.$refs.accList.initAccountList();
        }
    },
    methods: {
        init() {
            this.$onKeyDown(13, () => {
                this.login();
            });
            this.currAcc = this.getCurrAcc();
        },
        clearAll() {
            this.password = "";
            this.isLoading = false;
            this.$offKeyDown();
        },
        showExisting(id) {
            this.id = id;
            this.isShowExisting = true;
        },
        toggleTab(tabName) {
            if (this.tabName === tabName) return;
            if (this.tabName !== "vb" && tabName === "vb") {
                this.initVB();
            } else if (this.tabName === "vb" && tabName !== "vb") {
                this.destoryVB();
            }
            this.tabName = tabName;
        },
        initVB() {
            const vb = initVB();
            vb.on("connect", (payload) => {
                const {address=`mock an address`}=payload;
                this.$store.commit("switchHDAcc", {
                    activeAddr: address,
                    isBirforst: true
                });
                getCurrHDAcc().unlock(vb.sendTx);
                this.$store.commit("setCurrHDAccStatus");
                const name = this.$store.state.env.lastPage || "tradeCenter";
                this.$router.push({ name });
            });
            vb.on("disconnect", () => {
                if (getCurrHDAcc() && getCurrHDAcc().isBirforst) {
                    getCurrHDAcc().lock();
                    this.$store.commit("setCurrHDAccStatus");
                }
            });
            this.vb = vb;
        },
        destoryVB() {
            this.vb && this.vb.destroy();
            this.vb = null;
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
                            : "";
                        return account;
                    }
                }
            }

            // Second: from current
            if (this.currHDAcc) {
                return {
                    id: this.currHDAcc.id,
                    showAddr: this.currHDAcc.activeAddr
                        ? ellipsisAddr(this.currHDAcc.activeAddr)
                        : "",
                    name: this.currHDAcc.name || "",
                    ...this.currHDAcc
                };
            }

            // Finally: from list[0]
            const account = list[0];
            account.showAddr = account.activeAddr
                ? ellipsisAddr(account.activeAddr)
                : "";
            return account;
        },

        inputFocus(text) {
            this.inputItem = text;
        },
        inputBlur(text) {
            text === this.inputItem && (this.inputItem = "");
        },
        focusPass() {
            Vue.nextTick(() => {
                this.$refs.passInput && this.$refs.passInput.focus();
            });
        },

        chooseAccount(account) {
            this.currAcc = account;
            this.isShowAccountList = false;
            this.password = "";
        },
        toggleAccountList() {
            this.isShowAccountList = !this.isShowAccountList;
        },
        hideAccountList() {
            this.isShowAccountList = false;
        },

        createAcc() {
            this.$router.push({ name: "startCreate" });
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
                this.$toast(this.$t("startCreate.input"), "error");
                this.focusPass();
                return;
            }

            this.isLoading = true;

            this.$store.commit("switchHDAcc", this.currAcc);
            this.$store
                .dispatch("login", this.password)
                .then(() => {
                    if (!this.isLoading) {
                        return;
                    }
                    this.isLoading = false;

                    if (!this.currAcc.id && this.currAcc.entropy) {
                        deleteOldAcc(this.currAcc);
                    }

                    this.currHDAcc.activate();
                    const name =
                        this.$store.state.env.lastPage || "tradeCenter";
                    this.$router.push({ name });
                })
                .catch(err => {
                    console.warn(err);
                    if (!this.isLoading) {
                        return;
                    }
                    this.isLoading = false;
                    this.$toast(this.$t("hint.pwErr"));
                });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.login-wrapper {
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
        display: inline-block;
        margin-bottom: 20px;
        border-radius: 16px;
        background: #007aff;
        box-shadow: 0 0 4px 0 rgba(0, 105, 219, 1);
        padding-left: 12px;
        // .tab-toggle {
        //     &-enter-active {
        //         animation: slide-in 0.5s;
        //     }
        //     &-leave-active {
        //         animation: bounce-in 0.5s reverse;
        //     }
        //     @keyframes slide-in {
        //         0% {
        //             transform: translateX(0);
        //         }
        //         50% {
        //             transform: translateX(70%);
        //         }
        //         100% {
        //             transform: translateX(100%);
        //         }
        //     }
        // }
        &.radius {
            padding-left: 0;
            padding-right: 12px;
        }

        .btn-item {
            display: inline-block;
            color: #fff;
            font-size: 14px;
            @include font-family-bold();
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 18px;

            &.active {
                background: rgba(51, 187, 255, 1);
                border-radius: 16px;
                padding: 6px 12px;
                box-shadow: 0 0 4px 0 rgba(0, 105, 219, 1);
            }
        }
    }
    .vb {
        width: 100%;
        .code_container {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
            background: #fff;
            margin-bottom: 20px;
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
                }
            }
            .vb_qrcode {
                margin: 30px auto;
            }
        }
    }
}
</style>

