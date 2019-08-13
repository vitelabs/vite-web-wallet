<template>
    <div>
        <div class="__btn __btn_input">
            <input autofocus :placeholder="$t('create.input')"
                   v-model="password" :type="'password'" />
        </div>

        <div class="__btn __btn_all_in __pointer" @click="unlock">
            <span v-show="!isLoading">UNLOCK</span>
            <loading v-show="isLoading" loadingType="dot"></loading>
        </div>
    </div>
</template>

<script>
import viteCrypto from 'testwebworker';
import { account, keystore } from '@vite/vitejs';
import loading from 'components/loading.vue';
import $ViteJS from 'utils/viteClient';

export default {
    components: { loading },
    props: {
        keystore: {
            type: Object,
            default: null
        },
        unlockSuccess: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            isLoading: false,
            password: ''
        };
    },
    methods: {
        unlock() {
            this.isLoading = true;
            keystore.decrypt(JSON.stringify(this.keystore), this.password, viteCrypto).then(privateKey => {
                this.isLoading = false;

                this.unlockSuccess(new account({
                    privateKey,
                    client: $ViteJS
                }));
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                this.$toast('error');
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
</style>
