<template>
    <div class="account-head-wrapper">
        <div class="custom-name">
            <div class="head-title">
                <span>{{ $t('accountName') }}</span>
                <img @click="startRename" class="edit __pointer" src="~assets/imgs/edit_default.svg"/>
            </div>
            <div v-show="!isShowNameInput" class="name" :class="{
                'small-font': account.name && account.name.length > 16
            }" @click="startRename">{{ account.name }}</div>
            <!-- <input fake_pass type="password" style="display:none"/> -->
            <form autocomplete="off">
                <input ref="nameInput" v-show="isShowNameInput" type="text"
                       v-model="editName" :placeholder="account.name"
                       @blur="rename" autocomplete="off"/>
            </form>
        </div>

        <vite-address :title="$t('wallet.address')" :address="account.addr"
                      :addressQrcode="addressStr"></vite-address>

        <div class="btn-group">
            <div class="btn__small __pointer __btn-test" @click="getTestToken" :class="{'un_clickable':!getTestTokenAble}">
                <span>{{ $t('wallet.getTestToken') }}</span>
                <img src="~assets/imgs/Vite_icon.svg" class="icon" />
            </div>
            <div @click="goDetail" class="btn__small __pointer __btn-detail">
                {{ $t('wallet.transDetail') }}
                <img src="~assets/imgs/more.svg" class="more-icon" />
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import viteAddress from 'components/address';
import { stringify } from 'utils/viteSchema';
import { getTestToken } from 'services/testToken';

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
            getTestToken(this.account.addr).then(() => {
                this.$toast(this.$t('wallet.hint.token'));
                setTimeout(() => {
                    this.getTestTokenAble = true;
                }, 3000);
            }).catch(err => {
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
    padding: 30px 0 0 20px;
    text-align: center;
    background: #fff;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;

    .head-title {
        position: relative;
        display: block;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        letter-spacing: 0.35px;
        padding-bottom: 24px;
        font-family: $font-bold, arial, sans-serif;

        .edit {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-left: 20px;
        }
    }

    .addr-wrapper {
        padding-right: 20px;
        padding-bottom: 30px;
        display: inline-block;
        max-width: 510px;
        text-align: left;
    }

    .custom-name {
        padding-right: 20px;
        padding-bottom: 30px;
        font-size: 24px;
        color: #1d2024;
        text-align: left;
        font-family: $font-bold, arial, sans-serif;
        max-width: 26%;
        word-break: break-all;

        .name {
            display: inline-block;
            line-height: 32px;

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

    .btn-group {
        width: 212px;
        font-family: $font-normal-b, arial, sans-serif;
        padding-right: 20px;
        padding-bottom: 30px;

        .un_clickable {
            background-color: #bfbfbf !important;
            cursor: default !important;
        }

        .btn__small {
            box-sizing: border-box;
            width: 210px;
            height: 33px;
            line-height: 33px;
            text-align: center;
            font-size: 14px;
            border-radius: 2px;
        }

        .__btn-test {
            background: #007aff;
            color: #fff;
            height: 35px;
            line-height: 35px;

            &.unuse {
                background: #efefef;
                color: #666;
            }
        }

        .__btn-detail {
            border: 1px solid #007aff;
            color: #007aff;
            margin-top: 12px;
        }

        .icon {
            margin-bottom: -7px;
        }

        .more-icon {
            margin-left: 4px;
        }
    }
}

@media only screen and (max-width: 640px) {
    .account-head-wrapper {
        display: block;
        padding: 15px;

        .head-title {
            padding-bottom: 15px;

            .edit {
                float: right;
            }
        }
    }

    .account-head-wrapper .custom-name {
        padding: 0;
        width: 100%;
        max-width: 100%;

        input {
            width: 100%;
        }
    }

    .account-head-wrapper .addr-wrapper {
        padding: 0;
        margin-top: 20px;
        display: block;
        width: 100%;
        min-width: 0;

        .addr-content {
            padding: 10px;
            line-height: 20px;
        }
    }

    .account-head-wrapper .btn-group {
        padding: 0;
        margin-top: 20px;
        width: 100%;

        .btn__small {
            width: 100%;
        }
    }
}
</style>
