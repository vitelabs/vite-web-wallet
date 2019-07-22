<template>
    <div class="import-account-wrapper">
        <div class="__title">{{ $t('mnemonic.record') }}</div>
        <div class="note">{{ $t('mnemonic.prompt') }}</div>

        <div class="row">
            <span @click="change" class="change __pointer">{{ $t('mnemonic.change', { len }) }}</span>
            <img @click="copy" class="copy __pointer" src="~assets/imgs/copy_white.svg"/>
        </div>

        <div class="wrapper">
            <copy ref="copyDome" class="copy-wrapper"></copy>
            <span class="item" :class="{
                'long-item': mnemonicList.length === 12
            }" v-for="(item, index) in mnemonicList" :key="index">
                {{ item }}
            </span>
        </div>

        <div class="agree-list">
            <div @click="toogleAgree('1')" class="agreement __pointer" :class="{
                'active': !!agreeList['1']
            }">{{ $t('startRecord.agreeList.0') }}</div>
            <div @click="toogleAgree('2')" class="agreement __pointer" :class="{
                'active': !!agreeList['2']
            }">{{ $t('startRecord.agreeList.1') }}</div>
            <div @click="toogleAgree('3')" class="agreement __pointer" :class="{
                'active': !!agreeList['3']
            }">{{ $t('startRecord.agreeList.2') }}</div>
        </div>

        <div class="__btn_list">
            <span class="__btn __btn_border __pointer" @click="goBack">{{ $t('btn.back') }}</span>
            <span class="__btn __btn_all_in __pointer" :class="{
                'unuse': !isAgree
            }" @click="login">
                <span v-show="!isLoading">{{ $t('btn.submit') }}</span>
                <loading v-show="isLoading" loadingType="dot"></loading>
            </span>
        </div>
    </div>
</template>

<script>
import { hdAddr } from '@vite/vitejs';
import { saveHDAccount } from 'wallet';
import process from 'components/process';
import copy from 'components/copy';
import loading from 'components/loading.vue';

export default {
    components: { process, copy, loading },
    props: {
        name: {
            type: String,
            default: ''
        },
        pass: {
            type: String,
            default: ''
        },
        goBack: {
            type: Function,
            default: () => {}
        }
    },
    destroyed() {
        this.isLoading = false;
    },
    data() {
        const hdAddrObj = hdAddr.newAddr();

        return {
            hdAddrObj,
            len: 12,
            agreeList: {},
            isLoading: false
        };
    },
    computed: {
        mnemonicList() {
            return this.hdAddrObj.mnemonic.split(/\s/);
        },
        isAgree() {
            for (let i = 1; i < 4; i++) {
                if (!this.agreeList[i]) {
                    return false;
                }
            }
            return true;
        }
    },
    methods: {
        toogleAgree(key) {
            this.agreeList[key] = !this.agreeList[key];
            this.agreeList = Object.assign({}, this.agreeList);
        },
        copy() {
            this.$refs.copyDome.copy(this.hdAddrObj.mnemonic);
        },
        change() {
            const bits = this.len === 12 ? 128 : 256;
            this.hdAddrObj = hdAddr.newAddr(bits);
            this.len = this.len === 24 ? 12 : 24;
        },

        login() {
            if (this.isLoading || !this.isAgree) {
                return;
            }

            this.isLoading = true;

            saveHDAccount({
                name: this.name,
                pass: this.pass,
                hdAddrObj: this.hdAddrObj
            }).then(id => {
                if (!this.isLoading) {
                    return;
                }

                this.isLoading = false;
                this.$router.push({
                    name: 'startLogin',
                    params: { id }
                });
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                this.$toast(this.$t('hint.err'));
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./agree.scss";

.__btn.__btn_all_in.unuse {
    background: rgba(191,191,191,1);
    color: #fff;
}

.wrapper {
    position: relative;
    box-sizing: border-box;
    padding: 4px 8px 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    background: #f3f6f9;
    border-radius: 2px;

    .item {
        background: #fff;
        border-radius: 2px;
        flex-basis: 55px;
        height: 24px;
        line-height: 24px;
        margin-top: 0;
        font-size: 12px;
        color: #1d2024;
        text-align: center;
        margin-top: 4px;

        &.long-item {
            flex-basis: 110px;
        }
    }
}

.note {
    font-size: 14px;
    color: #fff;
    text-align: left;
    line-height: 20px;
    margin-bottom: 30px;
}

.__btn_list {
    margin-top: 20px;
}

.row {
    margin-bottom: 8px;
    text-align: left;
    height: 26px;
    line-height: 26px;

    .change {
        background: #00a3ff;
        border-radius: 2px;
        padding: 4px 10px;
        @include font-family-bold();
        font-size: 12px;
        color: #fff;
        letter-spacing: 0;
        text-align: center;
        line-height: 16px;
    }

    .copy {
        float: right;
        width: 20px;
        height: 20px;
        margin-top: 3px;
    }
}

.copy-wrapper {
    top: -32px;
    bottom: unset;
}
</style>
