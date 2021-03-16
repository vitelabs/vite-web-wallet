<template>
    <div>
        <div class="strong">{{$t('tokenCard.charge.selectNetwork')}}</div>
        <div>
            <span v-for="item, index in list" :key="item.standard" @click="onClick(index)" class="__flag" :class="{__selected: index === selected}">{{item.standard}}</span>
        </div>
    </div>
</template>

<script>
export default {
    model: {
        prop: 'selected',
        event: 'change'
    },
    props: {
        list: {
            type: Array,
            default: () => [],
            required: true
        },
        selected: Number
    },
    methods: {
        onClick(index) {
            this.$emit('change', index);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";


.strong {
    @include common_font_color();
    @include font-family-bold();
    font-size: 12px;
    margin-top: 20px;
    margin-bottom: 10px;
}

.__flag {
    @include small_btn();
    border: none;
    background: #e8eff5;
    color: #5e6875;
    padding: 3px 20px;
    margin-right: 20px;
    [data-theme="1"] & {
        background: $black-color-4;
    }
    &.__selected {
        border: 1px solid #007aff;
        color: #007aff;
        background: rgba(0,122,255,0.05);
    }
}
</style>
