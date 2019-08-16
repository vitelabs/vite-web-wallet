<template>
    <div>
        <div class="wrapper">
            <textarea v-model="mnemonic" :class="{
                'center': !mnemonic
            }" :placeholder="$t('mnemonic.placeholder')"></textarea>
            <span v-show="errMsg" class="msg __err_msg" >
                {{ errMsg === 'mnemonic.empty' || errMsg === 'mnemonic.error' || errMsg === 'hint.nodeErr' ? $t(errMsg) : errMsg }}
            </span>
        </div>

        <create ref="createDom" :submit="validMnemonic"></create>

        <!--<div class="note">{{ $t('mnemonic.hint') }}</div>-->

        <div class="__btn_list note">
            <span class="__btn __btn_border __pointer" @click="leftClick" >{{ $t(leftTxt) }}</span>
            <div class="__btn __btn_all_in __pointer" @click="valid">
                <span v-show="!isLoading">{{ $t('create.finish') }}</span>
                <loading v-show="isLoading" loadingType="dot"></loading>
            </div>
        </div>
    </div>
</template>

<script>
import { hdAddr } from '@vite/vitejs';
import $ViteJS from 'utils/viteClient';
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
            let addrObj;
            try {
                const res = await this.fetchAddrNum(mnemonic);
                addrNum = res.addrNum;
                addrObj = res.addrObj;
            } catch (err) {
                console.warn(err);
                if (err && err.code === 500005) {
                    this.errMsg = 'mnemonic.error';
                } else {
                    this.errMsg = 'hint.nodeErr';
                }
                this.isLoading = false;
            }

            saveHDAccount({
                name,
                pass,
                hdAddrObj: {
                    addr: addrObj,
                    id: hdAddr.getId(mnemonic),
                    entropy: hdAddr.getEntropyFromMnemonic(mnemonic)
                },
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
                addrs = hdAddr.getAddrsFromMnemonic(mnemonic, 0, num);
            } catch (err) {
                throw { code: 500005 };
            }

            const requests = [];
            for (let i = 0; i < num; i++) {
                requests.push($ViteJS.getBalance(addrs[i].hexAddr));
            }

            const data = await Promise.all(requests);
            let index = 0;

            data.forEach((item, i) => {
                if (!item) {
                    return;
                }
                const account = item.balance;
                const onroad = item.onroad;
                if ((account && +account.totalNumber) || (onroad && +onroad.totalNumber)) {
                    index = i;
                }
            });

            return {
                addrNum: index + 1,
                addrObj: addrs[0]
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
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
        resize: none;
        text-align: left;
        word-wrap: break-word;

        &.center {
            text-align: center;
            /*line-height: 60px;*/
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
    color: #fff;
    text-align: left;
    line-height: 20px;
    margin: 30px 0;
}
</style>
