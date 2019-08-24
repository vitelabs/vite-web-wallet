<template>
    <div class="pair-item">{{item.name}}<div class="cancel" v-if="cancelAble" @click="cancel"></div></div>
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
            this.$emit('deleteItem', this.item);
        }
    }
};
</script>
<style lang="scss">
.pair-item {
    padding: 4px 6px;
    background: rgba(243, 246, 249, 1);
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    color: rgba(29, 32, 36, 1);
    font-size: 12px;
    display: flex;
    align-items: center;
    .cancel-able {
        background: rgba(0, 122, 255, 0.05);
        border: 1px solid rgba(0, 122, 255, 0.3);
    }
    .cancel{
        width: 6px;
        height: 6px;
        cursor: pointer;
        user-select: none;
    }
}
</style>
