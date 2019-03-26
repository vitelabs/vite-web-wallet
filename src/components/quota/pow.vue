<template>
    <confirm :title="$t('quotaConfirm.title')" :showMask="showMask"
             :leftBtnTxt="$t('quotaConfirm.goQuota')"
             :leftBtnClick="_leftBtnClick"
             :rightBtnTxt="$t('quotaConfirm.runPow')"
             :rightBtnClick="rightBtnClick"
             :closeIcon="true" :close="closeBtnClick">
        {{ $t('quotaConfirm.powContent') }}
    </confirm>
</template>

<script>
import confirm from 'components/confirm';

export default {
    components: { confirm },
    props: {
        showMask: {
            type: Boolean,
            default: true
        },
        closeBtnClick: {
            type: Function,
            default: () => {}
        },
        rightBtnClick: {
            type: Function,
            default: () => {}
        },
        leftBtnClick: {
            type: Function,
            default: () => {}
        }
    },
    methods: {
        _leftBtnClick() {
            this.leftBtnClick && this.leftBtnClick();
            this.$router.push({ name: 'walletQuota' });
        }
    }
};
</script>
