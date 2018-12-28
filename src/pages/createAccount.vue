/**  vite-wallet index-layout */

<template>
    <div class="create-account-wrapper">
        <div class="__title">{{ activeAccount ? $t('nav.head.reset') : $t('nav.head.setting')}}</div>

        <div class="__btn __btn_input" 
             :class="{ 'active': !!name || inputItem === 'name' }">
            <input ref="name" v-model="name" type='text' autocomplete="off"
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
            <input ref="pass2" v-model="pass2" type='password' autocomplete="off"
                   :placeholder="$t('create.again')"
                   @focus="inputFocus('pass2')"
                   @blur="inputBlur('pass2')" />
        </div>

        <div class="__btn_list">
            <span class="__btn __btn_border __pointer" @click="back" >
                {{ $t('btn.back') }}
            </span>
            <div class="__btn __btn_all_in __pointer" @click="valid">
                <span v-show="!isLoading">{{ activeAccount ? $t('create.finish') : $t('btn.next')}}</span>
                <loading v-show="isLoading" loadingType="dot"></loading>
            </div>
        </div>

        <process v-show="showPro" class="process" active="createAccount"></process>
    </div>
</template>

<script>
import Vue from 'vue';
import process from 'components/process';
import loading from 'components/loading';

export default {
    components: {
        process, loading
    },
    mounted() {
        this.focusName();
        this.$onEnterKey(() => {
            this.valid();
        });
    },
    destroyed() {
        this.isLoading = false;
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();
        let showPro = !activeAccount;
        return {
            activeAccount,
            showPro,
            name: '',
            pass1: '',
            pass2: '',
            inputItem: '',
            isLoading: false
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
            // [NOTICE] Order fix
            // Name not empty
            if (!this.name) {
                this.$toast(this.$t('create.hint.nameInput'));
                this.focusName();
                return;
            }

            if ( !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.name) ) {
                this.$toast(this.$t('create.hint.name'));
                this.focusName();
                return;
            }

            if (this.name.length > 32) {
                this.$toast(this.$t('create.hint.nameLong'));
                this.focusName();
                return;
            }

            // Not empty
            if (!this.pass1) {
                this.$toast(this.$t('hint.pwEmpty'));
                this.focusPass1();
                return;
            }

            if ( /[\u4e00-\u9fa5]|\s+/g.test(this.pass1) ) {    // Chinese
                this.$toast(this.$t('create.hint.pwFormat'));
                this.focusPass1();
                return;
            }

            if (this.pass1.length < 1 || this.pass1.length > 32) { // length limit
                this.$toast(this.$t('create.hint.long'));
                this.focusPass1();
                return;
            }

            if (!this.pass2) { // not empty
                this.$toast(this.$t('create.again'));
                this.focusPass2();
                return;
            }

            if (this.pass1 !== this.pass2) { // same password
                this.$toast(this.$t('create.hint.consistency'));
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
            this.$wallet.create(this.name, this.pass1);
            this.$router.push({
                name: 'record'
            });
        },
        restoreAccount() {
            this.isLoading = true;
            this.$wallet.restoreAccount(this.name, this.pass1).then(() => {
                if (!this.isLoading) {
                    return;
                }
                this.isLoading = false;
                this.activeAccount.rename(name);
                this.activeAccount.save();
                this.$router.push({
                    name: 'index'
                });
            }).catch((err) => {
                this.isLoading = false;
                console.warn(err);
                this.$toast(this.$t('hint.err'));
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
</style>
