<template>
    <div class="switch-button">
        <div
            class="switch-button__button"
            :class="{ 'switch-button__button--enable': isEnabled }"
            @click="toggle"
        >
            <div class="button"></div>
        </div>
        <div class="switch-button__label">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    model: {
        prop: 'isEnabled',
        event: 'toggle'
    },
    props: { isEnabled: Boolean },
    methods: {
        toggle: function () {
            this.$emit('toggle', !this.isEnabled);
        }
    }
};
</script>

<style lang="scss" scoped>
$switch-button-height: 18px;
$switch-button-color: #007aff;
$switch-transition: all 0.3s ease-in-out;
$switch-is-rounded: true;
$switch-background-height: 6px;

.switch-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 18px;

    &__button {
        height: $switch-background-height;
        width: $switch-button-height * 2 + 2px;
        border-radius: $switch-background-height;
        transition: $switch-transition;
        background-color: rgba(197,207,213,1);
        cursor: pointer;

        .button {
            height: $switch-button-height;
            width: $switch-button-height;
            background: $switch-button-color;

            transition: $switch-transition;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.15);
            border-radius: $switch-button-height;
            margin-top: -($switch-button-height - $switch-background-height) / 2;
        }
    }
    &__button--enable {
        background-color: $switch-button-color;
        box-shadow: none;

        .button {
            background: white;
            transform: translateX(calc(#{$switch-button-height} + 2px));
        }
    }

    &__label {
        margin-left: 10px;
    }
}
</style>
