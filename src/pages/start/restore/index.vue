<template>
    <div>
        <div class="__title">{{ $t('mnemonic.restore') }}</div>
        <restore ref="restoreDom" :leftClick="back" leftTxt="btn.back"></restore>
    </div>
</template>

<script>
import restore from '../restore.vue';

export default {
    components: { restore },
    methods: {
        back() {
            this.$router.go(-1);
        }
    }
};
</script>
