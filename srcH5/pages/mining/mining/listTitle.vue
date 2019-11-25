<template>
    <div class="title">
        {{ title || $t('mobileMining.listTitle') }}
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.title {
    font-size: 14px;
    @include font-bold();
    color: rgba(62,74,89,1);
    line-height: 20px;
    margin-bottom: 14px;
    margin-top: 20px;
}
</style>
