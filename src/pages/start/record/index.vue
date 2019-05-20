<template>
    <div class="import-account-wrapper">
        <div class="__title">{{ $t('mnemonic.record') }}</div>
        <div class="note">{{ $t('mnemonic.prompt') }}</div>

        <div class="row">
            <span @click="change" class="change __pointer">{{ $t('mnemonic.change', { len }) }}</span>
            <img @click="copy" class="copy __pointer" src="~assets/imgs/copy_white.svg"/>
        </div>

        <div class="wrapper">
            <copyOK class="copy-wrapper" :copySuccess="copySuccess"></copyOK>
            <span class="item" :class="{
                'long-item': mnemonicList.length === 12
            }" v-for="(item, index) in mnemonicList" :key="index">
                {{ item }}
            </span>
        </div>

        <div class="__btn_list">
            <span class="__btn __btn_border __pointer" @click="back">{{ $t('btn.back') }}</span>
            <span class="__btn __btn_all_in __pointer" @click="login">
                <span v-show="!isLoading">{{ $t('btn.submit') }}</span>
                <loading v-show="isLoading" loadingType="dot"></loading>
            </span>
        </div>

        <process class="process" active="record"></process>
    </div>
</template>

<script>
import process from 'components/process';
import copyOK from 'components/copyOK';
import loading from 'components/loading.vue';
import copy from 'utils/copy';

export default {
    components: { process, copyOK, loading },
    mounted() {
        this.activeAccount = this.$wallet.getActiveAccount();
        this.mnemonic = this.activeAccount.getMnemonic() || '';
    },
    destroyed() {
        this.isLoading = false;
    },
    data() {
        const activeAccount = this.$wallet.getActiveAccount();
        const mnemonic = activeAccount.getMnemonic() || '';

        return {
            activeAccount,
            mnemonic,
            len: 12,
            copySuccess: false,
            isLoading: false
        };
    },
    computed: {
        mnemonicList() {
            return this.mnemonic.split(/\s/);
        }
    },
    methods: {
        back() {
            this.$wallet.clearActiveAccount();
            this.$router.go(-1);
        },
        copy() {
            copy(this.mnemonic);
            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 2000);
        },
        change() {
            this.activeAccount.changeMnemonic(this.len);
            this.len = this.len === 24 ? 12 : 24;
            this.mnemonic = this.activeAccount.getMnemonic() || '';
        },
        login() {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;
            this.activeAccount.encrypt().then(() => {
                if (!this.isLoading) {
                    return;
                }
                this.isLoading = false;
                this.activeAccount.save();
                this.$router.push({ name: 'start' });
            })
                .catch(err => {
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
        font-family: $font-bold, arial, sans-serif;
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
