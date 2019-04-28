<template>
    <div class="account-head-wrapper">
        <div class="head__item">
            <img class="icon" src="~assets/imgs/head_acc.png"/>
            <div class="head-right ">
                <div class="head-title">
                    <span>{{ $t('accountName') }}</span>
                    <img
                        @click="startRename"
                        class="edit __pointer"
                        src="~assets/imgs/edit_default.svg"
                    />
                </div>
                <div
                    v-show="!isShowNameInput"
                    class="name"
                    :class="{
                        'small-font': account.name && account.name.length > 16
                    }"
                    @click="startRename"
                >{{ account.name }}</div>
                <!-- <input fake_pass type="password" style="display:none"/> -->
                <form autocomplete="off">
                    <input
                        ref="nameInput"
                        v-show="isShowNameInput"
                        type="text"
                        v-model="editName"
                        :placeholder="account.name"
                        @blur="rename"
                        autocomplete="off"
                    />
                </form>
            </div>
        </div>
        <div class="worth head__item">
            <img class="icon" src="~assets/imgs/head_asset.png" />
            <div class="head-right ">
                <div class="head-title">总资产</div>
                <div>{{totalAsset}}
                </div>
            </div>
        </div>
        <div class="head__item">
            <img class="icon" src="~assets/imgs/head_addr.png" />
            <vite-address
                :title="$t('wallet.address')"
                :address="account.addr"
                :addressQrcode="addressStr"
                style="color: #5E6875;"
            ></vite-address>
        </div>

        <div class="btn-group head__item">
            <div
                class="btn__small __pointer __btn-test"
                @click="getTestToken"
                :class="{'un_clickable':!getTestTokenAble}"
            >
                <span>{{ $t('wallet.getTestToken') }}</span>
                <img
                    src="~assets/imgs/more_blue.png"
                    class="more-icon"
                />
            </div>
            <div
                @click="goDetail"
                class="btn__small __pointer __btn-detail"
            >
                {{ $t('wallet.transDetail') }}
                <img
                    src="~assets/imgs/more_gray.png"
                    class="more-icon"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import viteAddress from 'components/address';
import { stringify } from 'utils/viteSchema';
import { getTestToken } from 'services/testToken';
import bigNumber from 'utils/bigNumber';

let activeAccount = null;

export default {
    components: { viteAddress },
    data() {
        return {
            account: {},
            addressStr: '',
            isShowNameInput: false,
            editName: '',
            copySuccess: false,
            qrcode: null,
            qrcodeShow: false,
            getTestTokenAble: true
        };
    },
    mounted() {
        activeAccount = this.$wallet.getActiveAccount();
        this.account = this.getSimpleAcc();
        this.addressStr = stringify({ targetAddress: this.account.addr });
    },
    computed: {
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        totalAsset() {
            const currency = this.$store.state.exchangeRate.coins[this.$i18n.locale];
            const rateMap = this.$store.state.exchangeRate.rateMap;
            const balanceInfo = this.$store.getters.balanceInfo;
            const total = Object.keys(balanceInfo).reduce((pre, cur) => {
                if (!rateMap[cur]) return pre;
                return bigNumber.plus(bigNumber.multi(balanceInfo[cur].balance, rateMap[cur][currency]), pre);
            }, 0);
            return `${ this.$i18n.locale === 'en' ? '$' : '¥' }${ total }`;
        }
    },
    methods: {
        goDetail() {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${ process.env.viteNet }${ locale }account/${ this.account.addr }`);
        },

        getTestToken() {
            if (!this.getTestTokenAble) {
                return;
            }
            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            if (!this.account || !this.account.addr) {
                this.$toast(this.$t('wallet.hint.tErr'));
            }

            this.getTestTokenAble = false;
            getTestToken(this.account.addr)
                .then(() => {
                    this.$toast(this.$t('wallet.hint.token'));
                    setTimeout(() => {
                        this.getTestTokenAble = true;
                    }, 3000);
                })
                .catch(err => {
                    this.getTestTokenAble = true;
                    console.warn(err);
                    this.$toast(this.$t('wallet.hint.tErr'), err);
                });
        },
        getSimpleAcc() {
            return {
                name: activeAccount.getName(),
                addr: activeAccount.getDefaultAddr()
            };
        },

        clearEditName() {
            this.isShowNameInput = false;
            this.editName = '';
            this.$offKeyDown();
        },
        startRename() {
            if (this.isShowNameInput) {
                return;
            }
            this.isShowNameInput = true;
            Vue.nextTick(() => {
                this.$onKeyDown(13, () => {
                    this.rename();
                });
                this.$refs.nameInput.focus();
            });
        },
        rename() {
            if (!this.editName) {
                this.clearEditName();
                return;
            }

            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.editName)) {
                this.$toast(this.$t('startCreate.hint.name'), 'error');
                this.clearEditName();
                return;
            }

            if (this.editName.length > 32) {
                this.$toast(this.$t('startCreate.hint.nameLong'), 'error');
                this.clearEditName();
                return;
            }

            activeAccount.rename(this.editName);
            this.clearEditName();
            this.account = this.getSimpleAcc();
        }
    }
};
</script>

<style lang="scss">
@import "~assets/scss/vars.scss";

.account-head-wrapper {
    position: relative;
    text-align: center;
    background: #fff;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
    display: flex;
    flex-wrap: no-wrap;
    flex-direction: row;
    justify-content: space-between;
    height: 100px;
    min-width: 1300px;
    .head__item {
        border-right: 1px solid rgba(227, 235, 245, 0.6);
        display: flex;
        align-items: center;
        padding: 0 20px;
        .icon{
            height: 34px;
            width: 34px;
            margin-right: 20px;
        }
        .head-right{
            font-size: 20px;
            color: #1d2024;
            text-align: left;
            font-family: $font-bold, arial, sans-serif;
            word-break: break-all;
            .head-title {
                display: flex;
                align-items: center;
                position: relative;
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                letter-spacing: 0.35px;
                padding-bottom: 10px;
                font-family: $font-bold, arial, sans-serif;
                color: #5E6875;
                font-family: $font-bold;

                .edit {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-left: 20px;
                }
            }
            .name {
                &.small-font {
                    font-size: 20px;
                    line-height: 26px;
                }
            }

            input {
                height: 32px;
                line-height: 32px;
                font-size: 20px;
                width: 100%;
            }
        }
        &.worth{
            flex-grow: 1;
        }
        &.btn-group {
            padding: 0 ;
            font-family: $font-normal, arial, sans-serif;
            display: flex;
            flex-direction: column;
            .un_clickable {
                background-color: #bfbfbf !important;
                cursor: default !important;
            }

            .btn__small {
                box-sizing: border-box;
                text-align: center;
                font-size: 14px;
                flex-grow: 1;
                width: 100%;
                color: rgba(94,104,117,1);
                display: flex;
                justify-content: center;
                padding-right: 30px;
                align-items: center;
                &:first-child{
                    color: rgba(0,122,255,1);
                    border-bottom: 1px solid rgba(227, 235, 245, 0.6);
                }
            }
            .more-icon {
                margin-left: 4px;
                height: 10px;
                width: 6px;
            }
        }
    }
    .addr-wrapper {
        display: inline-block;
        max-width: 510px;
        text-align: left;
    }
}

@media only screen and (max-width: 640px) {
    .account-head-wrapper {
        display: flex;
        flex-direction: column;
        padding: 15px;
        height: unset;
        min-width:unset;
        .head__item{
            border-right: none;
            border-bottom: 1px solid rgba(227, 235, 245, 0.6);
        }
        .head-title {
            padding-bottom: 15px;

            .edit {
                float: right;
            }
        }
        .custom-name {
            padding: 0;
            width: 100%;
            max-width: 100%;

            input {
                width: 100%;
            }
        }

        .addr-wrapper {
            padding: 0;
            margin-top: 20px;
            display: block;
            width: 100%;
            min-width: 0;

            .addr-content {
                padding: 10px;
                line-height: 20px;
                height: unset;
                min-height: 24px;
            }
        }

        .btn-group {
            padding: 0;
            width: 100%;
            .btn__small {
                width: 100%;
                margin-top: 10px;
            }
        }
    }
}
</style>
