<template>
    <confirm :title="title" :leftBtnTxt="$t('btn.cancel')" :rightBtnTxt="$t('btn.submit')"
             :leftBtnClick="_cancel"  :rightBtnClick="_submit">
        <div class="pass-input">
            <input v-model="password" type="text"/>
        </div>
        <div @click="setting">
            {{ $t('pwdConfirm.conf') }}
        </div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm.vue';
import localStorage from 'utils/localStorage';

export default {
    components: {
        confirm
    },
    props: {
        title: {
            type: String,
            default: () => {
                return this.$t('pwdConfirm.title');
            }
        },
        cancel: {
            type: Function,
            default: () => {}
        },
        submit: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        let pwdConf = localStorage.getItem('pwdConf');
        console.log(pwdConf);
        // pass Config
    },
    data() {
        return {
            password: ''
        };
    },
    methods: {
        setting() {
            console.log('setting');
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
