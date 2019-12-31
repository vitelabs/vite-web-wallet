<template>
    <div class="title">
        <span class="title-t">{{ title }}</span>
        <help-tips v-if="help" :helpText="help"></help-tips>
    </div>
</template>

<script>
import helpTips from 'pcComponents/helpTips';

export default {
    components: { helpTips },
    props: {
        title: {
            type: String,
            default: ''
        },
        help: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.title {
    padding: 14px 0;
    line-height: 18px;
    font-size: 13px;
    @include font-family-bold();
    [data-theme="0"] & {
        color: rgba(94,104,117,0.8);
    }
    [data-theme="1"] & {
        color: $white-color;
    }
}
</style>

