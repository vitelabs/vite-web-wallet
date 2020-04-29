<template>
    <div class="package-info" :class="{active: active}" @click="onClick">
        <span class="package-info-title">{{$t('trade.openapi.package') + ' ' + data.type}}</span>
        <span class="left">{{$t('trade.openapi.callNum')}}:</span>
        {{$t('trade.openapi.callNumInfo', data)}}
        <br/>
        {{$t('trade.openapi.price') + ':' }} {{$t('trade.openapi.priceInfo', {price: data.amount})}}
        <div class="slot">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        active: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        }
    }
};
</script>

<style lang="scss" scoped>
.package-info {
    @include common_border();
    max-width: 180px;
    border-radius: 4px;
    text-align: center;
    padding: 10px;
    font-size: 13px;
    @include box_shadow();
    &:hover {
        cursor: pointer;
    }
    &.active {
        background-color: $blue-color-3;
        border: 1px solid transparent;
        color: white;
    }
    .slot {
        margin-top: 10px;
    }
    .package-info-title {
        font-size: 16px;
        display: block;
        margin-bottom: 10px;
    }
}
</style>
