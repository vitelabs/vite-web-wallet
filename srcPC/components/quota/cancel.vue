<template>
    <confirm class="small" :title="$t('quotaConfirm.title')" :showMask="showMask"
             :leftBtnTxt="$t('quotaConfirm.noOperate', { 'operate': operate })"
             :leftBtnClick="_cancel"
             :rightBtnTxt="$t('quotaConfirm.goQuota')" :rightBtnClick="_submit">
        {{ $t('quotaConfirm.cancelContent', { 'operate': operate }) }}
    </confirm>
</template>

<script>
import confirm from '@pc/components/confirm/confirm.vue';

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
            this.submit && this.submit();
        }
    }
};
</script>
