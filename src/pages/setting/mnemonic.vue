<template>
    <div v-show="mnemonic" class="mnemonic">
        <div class="row">
            <span class="title">{{ $t('mnemonic.title') }}</span>
            <span class="copy icon __pointer" @click="copy" :class="{ 'lock':  lock }"></span>
            <span class="eyes icon __pointer" @click="toggleVisible" :class="{
                'lock':  lock,
                'visible': visible
            }"></span>
        </div>
        <copyOK class="copy-wrapper" :copySuccess="copySuccess"></copyOK>
        <div class="content">{{ mnemonicStr }}</div>
    </div>
</template>

<script>
import copy from 'utils/copy';
import copyOK from 'components/copyOK';

export default {
    components: { copyOK },
    props: {
        lock: {
            type: Boolean,
            default: true
        }
    },
    data() {
        const activeAccount = this.$wallet.getActiveAccount();
        const mnemonic = activeAccount.getMnemonic();
        const mnemonicStr = mnemonic ? this.getShowMnemonic(mnemonic) : '';

        return {
            visible: false,
            mnemonic,
            copySuccess: false,
            mnemonicStr
        };
    },
    computed: {
        showMnemonic() {
            return !this.lock && this.visible;
        }
    },
    watch: {
        showMnemonic: function () {
            this.mnemonicStr = this.mnemonic ? this.getShowMnemonic(this.mnemonic) : '';
        }
    },
    methods: {
        copy() {
            if (this.lock) {
                return;
            }
            copy(this.mnemonic);
            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 1000);
        },
        toggleVisible() {
            if (this.lock) {
                return;
            }
            this.visible = !this.visible;
        },
        getShowMnemonic(mnemonic) {
            if (!this.lock && this.visible) {
                return mnemonic;
            }

            let showStr = '';
            for (let i = 0; i < mnemonic.length; i++) {
                showStr += '*';
            }

            return showStr;
        }
    }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.mnemonic {
    width: 100%;
    position: relative;

    .copy-wrapper {
        bottom: 90px;
    }
}

.row {
    width: 100%;
    margin-bottom: 16px;

    .title {
        font-size: 14px;
        color: #1d2024;
        letter-spacing: 0.35px;
        line-height: 16px;
        font-family: $font-bold, arial, sans-serif;
    }

    .icon {
        display: block;
        width: 20px;
        height: 20px;
        float: right;
    }

    .eyes {
        margin-right: 16px;
        background-size: 20px 20px;
        background: url('../../assets/imgs/eyeclose_default.svg');

        &.visible {
            background: url('../../assets/imgs/eyeopen_default.svg');
        }

        &.lock {
            background: url('../../assets/imgs/eyeopen_disabled.svg');
            cursor: not-allowed;
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
