/**  pageConfig layout:index */

<template>
    <mnemonic title="mnemonic.restore" :submit="validMnemonic" :isLoading="isLoading">
        <div class="wrapper">
            <textarea v-model="mnemonic" :class="{
                'center': !mnemonic
            }" :placeholder="$t('mnemonic.placeholder')"></textarea>
            <span v-show="errMsg" class="msg __err_msg" >
                {{ errMsg === 'mnemonic.empty' || errMsg === 'mnemonic.error' || errMsg === 'hint.nodeErr' ? $t(errMsg) : errMsg }}
            </span>
        </div>
    </mnemonic>
</template>

<script>
import mnemonic from 'components/mnemonic.vue';

export default {
    components: {
        mnemonic
    },
    mounted() {
        this.$onKeyDown(13, () => {
            this.validMnemonic();
        });
    },
    data() {
        return {
            mnemonic: '',
            errMsg: '',
            isLoading: false
        };
    },
    methods: {
        validMnemonic() {
            if (this.isLoading) {
                return;
            }

            let mnemonic = this.$trim(this.mnemonic);
            if (!mnemonic) {
                this.errMsg = 'mnemonic.empty';
                return;
            }

            this.isLoading = true;
            this.$wallet.restoreAddrs(mnemonic).then(()=>{
                this.isLoading = false;
                this.$router.push({
                    name: 'startCreate'
                });
            }).catch(err => {
                console.warn(err);
                if (err && err.code === 500005) {
                    this.errMsg = 'mnemonic.error';
                } else {
                    this.errMsg = 'hint.nodeErr';
                }
                this.isLoading = false;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    box-sizing: border-box;
    position: relative;
    background: #F3F6F9;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    color: #1D2024;
    box-sizing: border-box;
    position: relative;
    padding: 20px;
    height: 120px;
    color: rgba(94,104,117,0.30);
    textarea {
        width: 100%;
        height: 100%;
        resize: none;
        text-align: left;
        word-wrap: break-word;
        &.center {
            text-align: center;
            line-height: 80px;
        }
    }
    .msg {
        position: absolute;
        left: 0;
        bottom: 0;
    }
}
</style>
