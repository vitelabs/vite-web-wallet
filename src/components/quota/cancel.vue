<template>
    <confirm :title="$t('quotaConfirm.title')" :showMask="showMask"
             :leftBtnTxt="$t('quotaConfirm.noOperate', { 'operate': operate })"
             :leftBtnClick="_cancel"
             :rightBtnTxt="$t('quotaConfirm.goQuota')" :rightBtnClick="_submit">
        {{ $t('quotaConfirm.cancelContent', { 'operate': operate }) }}
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
    components: { confirm },
    methods: {
        _cancel() {
            this.cancel && this.cancel();
        },
        _submit() {
            this.$router.push({ name: 'walletQuota' });
            this.submit && this.submit();
        }
    }
};
</script>
