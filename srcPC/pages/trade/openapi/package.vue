<template>
    <div class="package-info">
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
