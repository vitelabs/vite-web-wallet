<template>
    <div class="create-account-wrapper">
        <div class="__title">{{ $t('settingAcc')}}</div>

        <create ref="createDom" :submit="createAccount"></create>

        <div class="agreement">{{ $t('startCreate.agreementPre') }}
            <span class="link">{{ $t('startCreate.agreement') }}</span>
        </div>

        <div class="__btn_list">
            <span class="__btn __btn_border __pointer" @click="back" >
                {{ $t('btn.back') }}
            </span>
            <div class="__btn __btn_all_in __pointer" @click="valid">
                <span v-show="!isLoading">{{ $t('btn.next')}}</span>
                <loading v-show="isLoading" loadingType="dot"></loading>
            </div>
        </div>

        <process class="process" active="createAccount"></process>
    </div>
</template>

<script>
import create from '../create.vue';
import process from 'components/process';
import loading from 'components/loading';

export default {
    components: { create, process, loading },
    mounted() {
        this.$onKeyDown(13, () => {
            this.valid();
        });
    },
    destroyed() {
        this.isLoading = false;
    },
    data() {
        return {
            name: '',
            pass1: '',
            pass2: '',
            inputItem: '',
            isLoading: false
        };
    },
    methods: {
        valid() {
            this.$refs.createDom && this.$refs.createDom.valid();
        },
        back() {
            this.$router.go(-1);
        },
        createAccount(name, pass) {
            this.$wallet.create(name, pass);
            this.$router.push({ name: 'startRecord' });
        }
    }
};
</script>

<style lang="scss" scoped>
.__btn_list {
    margin-top: 20px;
}
</style>
