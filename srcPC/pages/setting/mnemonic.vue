<template>
    <div v-show="mnemonic" class="mnemonic">
        <div class="row">
            <span class="small-title">{{ $t('mnemonic.title') }}</span>
            <span class="copy icon __pointer" @click="copy" :class="{ 'lock':  lock }"></span>
            <span class="lock-icon icon __pointer" @click="unlock" :class="{
                'lock': lock
            }"></span>
        </div>
        <copy ref="copyDome" class="copy-wrapper"></copy>
        <div class="content">{{ mnemonicStr }}</div>
    </div>
</template>

<script>
import copy from 'components/copy';
import { pwdConfirm } from 'pcComponents/password';

export default {
    components: { copy },
    data() {
        return { lock: true };
    },
    computed: {
        mnemonic() {
            const acc = this.$store.state.wallet.currHDAcc;
            return acc ? acc.mnemonic : '';
        },
        mnemonicStr() {
            if (!this.mnemonic) {
                return '';
            }

            if (!this.lock) {
                return this.mnemonic;
            }

            let showStr = '';
            for (let i = 0; i < this.mnemonic.length; i++) {
                showStr += '*';
            }
            return showStr;
        }
    },
    methods: {
        unlock() {
            if (!this.lock) {
                this.lock = true;
                return;
            }

            pwdConfirm({
                submit: () => {
                    this.lock = false;
                }
            });
        },
        copy() {
            if (this.lock) {
                return;
            }
            this.$refs.copyDome.copy(this.mnemonic);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./setting.scss";

.mnemonic {
    width: 100%;
    position: relative;

    .copy-wrapper {
        bottom: 90px;
    }
}

.row {
    width: 100%;
    margin-bottom: 12px;
    .icon {
        display: block;
        width: 20px;
        height: 20px;
        float: right;
    }

    .lock-icon {
        margin-right: 16px;
        background-size: 20px 20px;
        background: url('~assets/imgs/unlock.svg') center no-repeat;
        &.lock {
            background: url('~assets/imgs/lock.svg') center no-repeat;
        }
    }

    .copy {
        background-size: 20px 20px;
        background: url('~assets/imgs/copy_default.svg');
        &.lock {
            background: url('~assets/imgs/copy_disabled.svg');
            cursor: not-allowed;
        }
    }
}

.content {
    background: #f3f6f9;
    border: 1px solid #d4dee7;
    border-radius: 2px;
    padding: 10px 15px;
    font-size: 14px;
    color: #5e6875;
    word-wrap: break-word;
}
</style>
