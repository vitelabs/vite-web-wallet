<template>
    <confirm :title="$t('quotaConfirmPoW.title')" :showMask="showMask"
             :leftBtnTxt="$t('quotaConfirmPoW.leftBtn.text')"
             :leftBtnClick="_leftBtnClick"
             :rightBtnTxt="$t('quotaConfirmPoW.rightBtn.text')"
             :rightBtnClick="rightBtnClick"
             :closeIcon="true" :close="closeBtnClick">
        {{ $t('quotaConfirmPoW.content') }}
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
