/**  vite-wallet index-layout */

<template>
    <div>
        <mnemonic :title="'mnemonic.record'" :submit="login">
            <div class="row">
                <span @click="change" class="change __pointer">{{ $t('mnemonic.change', { len }) }}</span>
                <img @click="copy" class="copy __pointer" src="../assets/imgs/copy_white.svg"/>
            </div>
            <div class="wrapper">
                <copyOK class="copy-wrapper" :copySuccess="copySuccess"></copyOK>
                <span class="item" :class="{
                    'long-item': mnemonicList.length === 12
                }" v-for="(item, index) in mnemonicList" :key="index">
                    {{ item }}
                </span>
            </div>
        </mnemonic>
        <process class="process" active="record"></process>
    </div>
</template>

<script>
import mnemonic from 'components/mnemonic.vue';
import process from 'components/process';
import copyOK from 'components/copyOK';
import copy from 'utils/copy';

export default {
    components: {
        mnemonic, process, copyOK
    },
    mounted() {
        this.activeAccount = this.$wallet.getActiveAccount();
        this.mnemonic = this.activeAccount.getMnemonic() || '';
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();
        let mnemonic = activeAccount.getMnemonic() || '';

        return {
            activeAccount,
            mnemonic,
            len: 12,
            copySuccess: false
        };
    },
    computed: {
        mnemonicList() {
            return this.mnemonic.split(/\s/);
        }
    },
    methods: {
        copy() {
            copy(this.mnemonic);
            this.copySuccess = true;
            setTimeout(()=>{
                this.copySuccess = false;
            }, 2000);
        },
        change() {
            this.activeAccount.changeMnemonic(this.len);
            this.len = this.len === 24 ? 12 : 24;
            this.mnemonic = this.activeAccount.getMnemonic() || '';
        },
        login() {
            this.activeAccount.encrypt();
            this.activeAccount.save();
            this.$router.push({
                name: 'index'
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
    background: #F3F6F9;
    border-radius: 2px;
    .item {
        background: #FFFFFF;
        border-radius: 2px;
        flex-basis: 55px;
        height: 24px;
        line-height: 24px;
        margin-top: 0;
        font-size: 12px;
        color: #1D2024;
        text-align: center;
        margin-top: 4px;
        &.long-item {
            flex-basis: 110px;
        }
    }
}
.row {
    margin-bottom: 8px;
    text-align: left;
    height: 26px;
    line-height: 26px;
    .change {
        background: #00A3FF;
        border-radius: 2px;
        padding: 4px 10px;
        font-family: $font-bold, arial, sans-serif;
        font-size: 12px;
        color: #FFFFFF;
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
