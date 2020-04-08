<template>
    <div class="__tips_wrapper" :class="[type]">
        <font-awesome-icon icon="exclamation-circle" class="__tips_icon"/>
        <slot></slot>
    </div>
</template>

<script>
const ICON_TYPE_MAP = {
    warn: 'exclamation-circle',
    info: 'info-circle'
};


export default {
    props: {
        type: {
            type: String,
            default: 'warn'
        }
    },
    computed: {
        icon() {
            return ICON_TYPE_MAP[this.type] || 'info-circle';
        }
    }
};
</script>

<style lang="scss" scoped>
$warnColor: #E6A23C;

.__tips_wrapper {
    padding: 15px;
    @include common_border();
    border-radius: 3px;
    &.warn {
        background-color: #fdf6ec;
        color: $warnColor;
        [data-theme="0"] & {
            border: 1px solid $warnColor;
        }
        [data-theme="1"] & {
            border: 1px solid $black-color-4;
            background-color: $black-color-3;
        }
    }
    .__tips_icon {
        margin-right: 10px;
    }
}
</style>
