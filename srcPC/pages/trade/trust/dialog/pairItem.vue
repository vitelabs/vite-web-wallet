<template>
    <div class="pair-item" :class="{'cancel-able':cancelAble}">{{ item.name }}<div class="cancel __pointer" v-if="cancelAble" @click="cancel"></div></div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        },
        cancelAble: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        cancel() {
            this.$emit('cancelItem', this.item);
        }
    }
};
</script>

<style lang="scss">
.pair-item {
    padding: 4px 6px;
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    @include common_font_color();
    font-size: 12px;
    display: flex;
    align-items: center;
    [data-theme="0"] & {
        background: rgba(243, 246, 249, 1);
    }
    &.cancel-able {
        background: rgba(0, 122, 255, 0.05);
        border: 1px solid rgba(0, 122, 255, 0.3);
    }
    .cancel{
        width: 12px;
        height: 12px;
        margin-left: 8px;
        background: url(~assets/imgs/cancel_item.png);
        background-size: cover;
        background-repeat: no-repeat;
    }
}
</style>
