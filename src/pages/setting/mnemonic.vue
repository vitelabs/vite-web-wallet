<template>
    <div v-show="mnemonic" class="mnemonic">
        <div class="row">
            <span class="small-title">{{ $t('mnemonic.title') }}</span>
            <span class="copy icon __pointer" @click="copy" :class="{ 'lock':  lock }"></span>
            <span class="lock-icon icon __pointer" @click="unlock" :class="{
                'lock': lock
            }"></span>
        </div>
        <copyOK class="copy-wrapper" :copySuccess="copySuccess"></copyOK>
        <div class="content">{{ mnemonicStr }}</div>
    </div>
</template>

<script>
import copy from 'utils/copy';
import copyOK from 'components/copyOK';
import { pwdConfirm } from 'components/password';

export default {
    components: { copyOK },
    data() {
        const activeAccount = this.$wallet.getActiveAccount();
        const mnemonic = activeAccount.getMnemonic();

        return {
            mnemonic,
            copySuccess: false,
            lock: true
        };
    },
    computed: {
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
            copy(this.mnemonic);
            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 1000);
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
        background: url('../../assets/imgs/unlock.svg') center no-repeat;
        &.lock {
            background: url('../../assets/imgs/lock.svg') center no-repeat;
        }
    }

    .copy {
        background-size: 20px 20px;
        background: url('../../assets/imgs/copy_default.svg');
        &.lock {
            background: url('../../assets/imgs/copy_disabled.svg');
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
