<template>
    <div class="box">
        <div class="box-content">
            <div class="wrapper">
                <textarea rows="3" v-model="mnemonic" :class="{
                    'center': !mnemonic
                }" :placeholder="$t('mnemonic.placeholder')"></textarea>
                <span v-show="errMsg" class="msg __err_msg" >
                    {{ errMsg === 'mnemonic.empty' || errMsg === 'mnemonic.error' || errMsg === 'hint.nodeErr' ? $t(errMsg) : errMsg }}
                </span>
            </div>

            <create ref="createDom" :submit="validMnemonic"></create>

        </div>
        
        <div class="box-footer">
            <div class="tips">
                <div v-if="!isTestnet" class="note">{{ $t('mnemonic.hint') }}</div>
                <div v-if="isTestnet" class="note-warning">{{ 'In theory, you could use any existing Vite wallet you already control. But out of caution let’s set up a new wallet for testnet.'  }}</div>
            </div>
            <div class="actions">
                <span class="btn active __pointer" @click="leftClick" >{{ $t(leftTxt) }}</span>
                <div class="btn active __pointer" @click="valid">
                    <span v-show="!isLoading">{{ $t('create.finish') }}</span>
                    <loading v-show="isLoading" loadingType="dot"></loading>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { wallet } from '@vite/vitejs';
import { getAccountBalance } from '@services/viteServer';
import loading from '@components/loading.vue';
import { saveHDAccount } from '@pc/wallet';
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
            return import.meta.env.VITE_NETWORK == 'testnet';
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
                // this.$router.push({
                //     name: 'startLogin',
                //     params: { id }
                // });
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
@use "@assets/scss/theme.scss" as *;
@use "../start.scss";

.wrapper {
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    padding: 16px;
    textarea {
        width: 100%;
        height: 100%;
        resize: none;
    }
}

.note {
    font-size: 14px;
    line-height: 20px;
    color: #00BEFF;
}
.note-warning {
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
    color: #00BEFF;
}
</style>
