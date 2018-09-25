<template>
    <div class="create-account-wrapper">
        <div class="__title">{{$t('nav.head.setting')}}</div>

        <div class="__btn __btn_input" 
             :class="{ 'active': !!name || inputItem === 'name' }">
            <input ref="name" v-model="name" type='text'
                   :placeholder="$t('create.accName')"
                   @focus="inputFocus('name')"
                   @blur="inputBlur('name')" />
        </div>
        <div class="__btn __btn_input" 
             :class="{ 'active': !!pass1 || inputItem === 'pass1' }">
            <input ref="pass1" v-model="pass1" type='password'
                   :placeholder="$t('create.input')"
                   @focus="inputFocus('pass1')"
                   @blur="inputBlur('pass1')" />
        </div>
        <div class="__btn __btn_input" 
             :class="{ 'active': !!pass2 || inputItem === 'pass2' }">
            <input ref="pass2" v-model="pass2" type='password'
                   :placeholder="$t('create.again')"
                   @focus="inputFocus('pass2')"
                   @blur="inputBlur('pass2')" />
        </div>

        <div class="btn_list">
            <span class="__btn __btn_border __pointer" :class="{
                'unuse': isCreating
            }" @click="back" >{{ $t('btn.back') }}</span>
            <span class="__btn __btn_all_in __pointer" :class="{
                'unuse': isCreating
            }" @click="valid">{{ activeAccount ? $t('create.finish') : $t('btn.next')}}</span>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import toast from 'utils/toast/index.js';

export default {
    mounted() {
        this.focusName();
    },
    data() {
        return {
            activeAccount: viteWallet.Wallet.getActiveAccount(),
            name: '',
            pass1: '',
            pass2: '',
            inputItem: '',
            isCreating: false
        };
    },
    methods: {
        inputFocus(text) {
            this.inputItem = text;
        },
        inputBlur(text) {
            text === this.inputItem && (this.inputItem = '');
        },
        back() {
            if (this.isCreating) {
                return;
            }
            this.$router.go(-1);
        },

        focusName() {
            Vue.nextTick(()=>{
                this.$refs.name && this.$refs.name.focus();
            });
        },
        focusPass1() {
            Vue.nextTick(()=>{
                this.$refs.pass1 && this.$refs.pass1.focus();
            });
        },
        focusPass2() {
            Vue.nextTick(()=>{
                this.$refs.pass2 && this.$refs.pass2.focus();
            });
        },

        valid() {
            if (this.isCreating) {
                return;
            }
            
            // [NOTICE] Order fix
            // Name not empty
            if (!this.name) {
                toast(this.$t('create.hint.nameInput'));
                this.focusName();
                return;
            }

            if ( !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.name) ) {
                toast(this.$t('create.hint.name'));
                this.focusName();
                return;
            }

            if (this.name.length > 32) {
                toast(this.$t('create.hint.nameLong'));
                this.focusName();
                return;
            }

            // Not empty
            if (!this.pass1) {
                toast(this.$t('hint.pwEmpty'));
                this.focusPass1();
                return;
            }

            if ( /[\u4e00-\u9fa5]|\s+/g.test(this.pass1) ) {    // Chinese
                toast(this.$t('create.hint.pwFormat'));
                this.focusPass1();
                return;
            }

            if (this.pass1.length < 1 || this.pass1.length > 32) { // length limit
                toast(this.$t('create.hint.long'));
                this.focusPass1();
                return;
            }

            if (!this.pass2) { // not empty
                toast(this.$t('create.again'));
                this.focusPass2();
                return;
            }

            if (this.pass1 !== this.pass2) { // same password
                toast(this.$t('create.hint.consistency'));
                this.focusPass2();
                return;
            }
            
            // ok
            if (!this.activeAccount) {
                this.createAccount();
                return;
            }
            this.restoreAccount();
        },
        createAccount() {
            viteWallet.Wallet.create(this.name, this.pass1);
            this.$router.push({
                name: 'record'
            });
        },
        restoreAccount() {
            viteWallet.Wallet.restoreAccount(this.name, this.pass1);
            this.$router.push({
                name: 'login'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.__btn {
    margin-bottom: 20px;
    &.unuse {
        background: #efefef;
        color: #666;
    }
}
.btn_list {
    .__btn {
        display: inline-block;
        width: 167px;
    }
    .__btn_border {
        margin-right: 20px;
    }
}
</style>
