<template>
    <div class="create-wrapper">
        <div class="__btn __btn_input"
             :class="{ 'active': !!name || inputItem === 'name' }">
            <form autocomplete="off">
                <input ref="name" v-model="name" type='text' autocomplete="off"
                       :placeholder="$t('accountName')"
                       @focus="inputFocus('name')"
                       @blur="inputBlur('name')" />
            </form>
        </div>
        <div class="__btn __btn_input"
             :class="{ 'active': !!pass1 || inputItem === 'pass1' }">
            <form  autocomplete="off">
                <input ref="pass1" v-model="pass1" type='password'
                       :placeholder="$t('startCreate.input')"
                       @focus="inputFocus('pass1')"
                       @blur="inputBlur('pass1')" />
            </form>
        </div>
        <div class="__btn __btn_input"
             :class="{ 'active': !!pass2 || inputItem === 'pass2' }">
            <input ref="pass2" v-model="pass2" type='password' autocomplete="off"
                   :placeholder="$t('startCreate.again')"
                   @focus="inputFocus('pass2')"
                   @blur="inputBlur('pass2')" />
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    props: {
        submit: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.focusName();
    },
    data() {
        return {
            name: '',
            pass1: '',
            pass2: '',
            inputItem: ''
        };
    },
    methods: {
        inputFocus(text) {
            this.inputItem = text;
        },
        inputBlur(text) {
            text === this.inputItem && (this.inputItem = '');
        },

        focusName() {
            Vue.nextTick(() => {
                this.$refs.name && this.$refs.name.focus();
            });
        },
        focusPass1() {
            Vue.nextTick(() => {
                this.$refs.pass1 && this.$refs.pass1.focus();
            });
        },
        focusPass2() {
            Vue.nextTick(() => {
                this.$refs.pass2 && this.$refs.pass2.focus();
            });
        },

        valid() {
            // [NOTICE] Order fix
            // Name not empty
            if (!this.name) {
                this.$toast(this.$t('startCreate.hint.nameInput'));
                this.focusName();
                return;
            }

            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.name)) {
                this.$toast(this.$t('startCreate.hint.name'));
                this.focusName();

                return;
            }

            if (this.name.length > 32) {
                this.$toast(this.$t('startCreate.hint.nameLong'));
                this.focusName();

                return;
            }

            // Not empty
            if (!this.pass1) {
                this.$toast(this.$t('hint.pwEmpty'));
                this.focusPass1();

                return;
            }

            // Chinese
            if (/[\u4e00-\u9fa5]|\s+/g.test(this.pass1)) {
                this.$toast(this.$t('startCreate.hint.pwFormat'));
                this.focusPass1();

                return;
            }

            // Length limit
            if (this.pass1.length < 1 || this.pass1.length > 32) {
                this.$toast(this.$t('startCreate.hint.long'));
                this.focusPass1();

                return;
            }

            // Not empty
            if (!this.pass2) {
                this.$toast(this.$t('startCreate.again'));
                this.focusPass2();

                return;
            }

            // Same password
            if (this.pass1 !== this.pass2) {
                this.$toast(this.$t('startCreate.hint.consistency'));
                this.focusPass2();

                return;
            }

            // Ok
            this.submit && this.submit(this.name, this.pass1);
        }
    }
};
</script>

<style lang="scss" scoped>
.__btn {
    margin-top: 20px;
}
</style>

