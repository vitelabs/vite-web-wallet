<template>
    <div></div>
</template>
<script>
export default {
    
};
</script>
<style lang="scss" scoped>
.dialog {
    margin: 24px;
    overflow-y: auto;
    pointer-events: auto;
    transition: .3s ease-in-out;
    width: 100%;
    z-index: inherit;
    &__content {
        align-items: center;
        display: flex;
        height: 100%;
        justify-content: center;
        left: 0;
        pointer-events: none;
        position: fixed;
        top: 0;
        transition: .2s ease-in-out;
        width: 100%;
        z-index: 6;
        outline: none;
    }
    &:not(.dialog--fullscreen) {
        max-height: 90%;
    }
    &__activator {
        cursor: pointer;
    }
    &__container {
        display: inline-block;
        vertical-align: middle
    }
    @keyframes animate-dialog {
        0% {
            transform: scale(1)
        }
        50% {
            transform: scale(1.03)
        }
        100% {
            transform: scale(1)
        }
    }
    &--animated {
        animation-duration: .15s;
        animation-name: animate-dialog;
        animation-timing-function: ease-in-out;
    }
    &--scrollable,
    &--scrollable>form {
        display: flex;
        >.card {
            display: flex;
            flex: 1 1 100%;
            max-width: 100%;
            flex-direction: column;
            >.card__title>.card__actions {
                flex: 1 0 auto;
                >.card__text {
                    overflow-y: auto;
                    backface-visibility: hidden;
                }
            }
        }
    }
}
</style>


