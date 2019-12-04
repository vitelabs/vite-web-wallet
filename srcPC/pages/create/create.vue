<template>
    <div>
        <div class="__title">{{ $t('settingAcc')}}</div>

        <create ref="createDom" :submit="createAccount"></create>

        <div class="__btn_list">
            <span class="__btn __btn_border __pointer" @click="back" >
                {{ $t('btn.back') }}
            </span>
            <div class="__btn __btn_all_in __pointer" @click="valid">
                {{ $t('btn.next')}}
            </div>
        </div>
    </div>
</template>

<script>
import create from '../start/login/create.vue';

export default {
    components: { create },
    props: {
        toNext: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.$onKeyDown(13, () => {
            this.valid();
        });
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
        valid() {
            this.$refs.createDom && this.$refs.createDom.valid();
        },
        back() {
            this.$router.go(-1);
        },
        createAccount(name, pass) {
            this.toNext && this.toNext(name, pass);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./create.scss";

.__btn.__btn_all_in.unuse {
    background: rgba(191,191,191,1);
    color: rgba(255,255,255,1);
}

.__btn_list {
    margin-top: 20px;
}
</style>
