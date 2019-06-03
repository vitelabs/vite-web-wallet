<template>
    <tips ref="tips"></tips>
</template>

<script>
import tips from 'uiKit/tips';
import copy from 'utils/copy';

export default {
    components: { tips },
    methods: {
        copy(text) {
            copy(text);
            this.$refs.tips.tip(this.$t('hint.copy'));
        }
    }
};
</script>
