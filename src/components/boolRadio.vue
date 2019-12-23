<template>
    <div class="radio-wrapper">
        <div class="select-icon-wrapper __pointer" @click="toogleSelect(true)">
            <span class="select-icon" :class="{
                active: isSelect
            }"></span>{{ $t('true') }}
        </div>
        <div class="select-icon-wrapper __pointer" @click="toogleSelect(false)">
            <span class="select-icon" :class="{
                active: !isSelect
            }"></span>{{ $t('false') }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return { isSelect: this.value };
    },
    watch: {
        value: function () {
            this.isSelect = this.value;
        }
    },
    methods: {
        toogleSelect(s) {
            this.isSelect = !!s;
            this.$emit('input', this.isSelect);
        }
    }
};
</script>

<style lang="scss" scoped>
.radio-wrapper {
    line-height: 32px;
}

.select-icon-wrapper {
    display: inline-block;
    font-size: 12px;
    @include font-family-normal();
    @include font_color_to_white(#5E6875);
    &:last-child {
        margin-left: 32px;
    }

    .select-icon {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border-radius: 10px;
        @include common_border();
        margin-right: 8px;
        margin-bottom: -4px;

        &.active:after {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -4px;
            margin-left: -4px;
            content: ' ';
            display: inline-block;
            width: 8px;
            height: 8px;
            background: $blue-color-1;
            border-radius: 5px;
        }
    }
}
</style>
