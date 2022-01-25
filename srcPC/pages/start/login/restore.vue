<template>
    <div>
        <div class="wrapper">
            <textarea class="" v-model="mnemonic" :class="{
                'center': !mnemonic
            }" :placeholder="$t('mnemonic.placeholder')"></textarea>
            <span v-show="errMsg" class="msg __err_msg" >
                {{ errMsg === 'mnemonic.empty' || errMsg === 'mnemonic.error' || errMsg === 'hint.nodeErr' ? $t(errMsg) : errMsg }}
            </span>
        </div>

        <create ref="createDom" :submit="validMnemonic"></create>

        <div v-if="!isTestnet" class="note">{{ $t('mnemonic.hint') }}</div>
        <div v-if="isTestnet" class="note-warning">{{ 'In theory, you could use any existing Vite wallet you already control. But out of caution let’s set up a new wallet for testnet.'  }}</div>

        <div class="__btn_list">
            <span class="__btn __btn_border __pointer" @click="leftClick" >{{ $t(leftTxt) }}</span>
            <div class="__btn __btn_all_in __pointer" @click="valid">
                <span v-show="!isLoading">{{ $t('create.finish') }}</span>
                <loading v-show="isLoading" loadingType="dot"></loading>
            </div>
        </div>
    </div>
</template>

<script>
import { wallet } from '@vite/vitejs';
import { getAccountBalance } from 'services/viteServer';
import loading from 'components/loading.vue';
import { saveHDAccount } from 'wallet';
import create from './create.vue';

export default {
    components: { create, loading },
    mounted() {
        this.$onKeyDown(13, () => {
            this.valid();
        });
    },
    props: {
        leftClick: {
            type: Function,
            default: () => {}
        },
        leftTxt: {
            type: String,
            default: ''
        },
        finishCb: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            mnemonic: '',
            errMsg: '',
            isLoading: false
        };
    },
    computed: {
        isTestnet() {
            return process.env.VITE_NET !== 'mainnet';
        }
    },
    methods: {
        valid() {
            this.$refs.createDom && this.$refs.createDom.valid();
        },
        validMnemonic(name, pass) {
            if (this.isLoading) {
                return;
            }

            const mnemonic = this.$trim(this.mnemonic);
            if (!mnemonic) {
                this.errMsg = 'mnemonic.empty';

                return;
            }

            this.restoreAccount(mnemonic, name, pass);
        },

        async restoreAccount(mnemonic, name, pass) {
            this.isLoading = true;

            let addrNum;
            try {
                addrNum = await this.fetchAddrNum(mnemonic);
            } catch (err) {
                console.warn(err);
                if (err && err.code === 500005) {
                    this.errMsg = 'mnemonic.error';
                } else {
                    this.errMsg = 'hint.nodeErr';
                }
                this.isLoading = false;
            }

            const myWallet = wallet.getWallet(mnemonic);
            const myAddress = myWallet.deriveAddress(0);

            saveHDAccount({
                name,
                pass,
                id: myWallet.id,
                entropy: myWallet.entropy,
                address: myAddress.address,
                addrNum
            }).then(id => {
                if (!this.isLoading) {
                    return;
                }

                this.isLoading = false;
                this.finishCb && this.finishCb(id);
                this.$router.push({
                    name: 'startLogin',
                    params: { id }
                });
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                this.$toast(this.$t('hint.err'));
            });
        },
        async fetchAddrNum(mnemonic) {
            const num = 10;
            let addrs;
            try {
                const myWallet = wallet.getWallet(mnemonic);
                console.log(myWallet);
                addrs = myWallet.deriveAddressList(0, num - 1);
            } catch (err) {
                console.warn(err);
                throw { code: 500005 };
            }

            const requests = [];
            for (let i = 0; i < num; i++) {
                requests.push(getAccountBalance(addrs[i].address));
            }

            const data = await Promise.all(requests);
            let index = 0;

            data.forEach((item, i) => {
                if (!item) {
                    return;
                }
                const balance = item.balance;
                const unreceived = item.unreceived;
                if ((+balance.blockCount) || (+unreceived.blockCount)) {
                    index = i;
                }
            });

            return index + 1;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../start.scss";

.wrapper {
    box-sizing: border-box;
    position: relative;
    background: #fff;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    color: #1d2024;
    box-sizing: border-box;
    position: relative;
    padding: 20px;
    height: 100px;
    color: rgba(94, 104, 117, 0.3);
    margin-bottom: 20px;

    textarea {
        width: 100%;
        height: 100%;
        resize: none;
        text-align: left;
        word-wrap: break-word;
        font-size: 14px;

        &.center {
            text-align: center;
            line-height: 60px;
        }
    }

    .msg {
        position: absolute;
        left: 0;
        bottom: 0;
    }
}

.note {
    font-size: 14px;
    [data-theme="0"] & {
        color: #fff;
    }
    [data-theme="1"] & {
        color: rgba(255,255,255, 0.8);
    }
    text-align: left;
    line-height: 20px;
    margin: 30px 0;
}
.note-warning {
    font-size: 14px;
    font-weight: bold;
    [data-theme="0"] & {
        color: #fff;
    }
    [data-theme="1"] & {
        color: rgba(255,255,255, 0.8);
    }
    text-align: left;
    line-height: 20px;
    margin: 30px 0;
}
</style>
