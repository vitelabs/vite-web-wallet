<template>
    <confirm :title="$t('quotaConfirmCancel.title')" :showMask="showMask"
             :leftBtnTxt="$t('quotaConfirmCancel.leftBtn', { 'operate': operate })"
             :leftBtnClick="_cancel"
             :rightBtnTxt="$t('quotaConfirmCancel.rightBtn')" :rightBtnClick="_submit">
        {{ $t('quotaConfirmCancel.describe', { 'operate': operate }) }}
    </confirm>
</template>

<script>
import confirm from 'components/confirm';

export default {
    props: {
        showMask: {
            type: Boolean,
            default: true
        },
        operate: {
            type: String,
            default: ''
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
    components: {
        confirm
    },
    methods: {
        _cancel() {
            this.cancel && this.cancel();
        },
        _submit() {
            this.$router.push({
                name: 'walletQuota'
            });
            this.submit && this.submit();
        }
    }
};
</script>
