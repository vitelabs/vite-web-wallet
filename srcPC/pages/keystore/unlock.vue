<template>
    <div>
        <div class="__btn_input">
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
import { keystore } from '@vite/vitejs';
import loading from '@components/loading.vue';

export default {
    components: { loading },
    props: {
        keystore: {
            type: Object,
            default: null
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
            keystore.decrypt(JSON.stringify(this.keystore), this.password, null).then(privateKey => {
                this.isLoading = false;
                this.$emit('unlockSuccess', privateKey);
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
@use "./common.scss";
.__btn_input {
    margin-top: 20px;
}
</style>
