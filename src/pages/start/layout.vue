<template>
    <div class="index-layout-wrapper" :style="{
        'background': `url(${bg}) rgba(255, 255, 255, 0.1) no-repeat`,
        'background-size': 'cover'
    }">
        <div class="header">
            <img class="header-logo __pointer" :src="logo" />
            <change-lang class="start change-lang __pointer"></change-lang>
        </div>
        <div class="confirm-wrapper">
            <div class="confirm"> <slot></slot> </div>
        </div>
    </div>
</template>

<script>
import changeLang from 'components/changeLang';
import bg from 'assets/imgs/bg.svg';
import logo from 'assets/imgs/ViteLogo1.svg';

export default {
    components: { changeLang },
    data() {
        return {
            bg,
            logo
        };
    }
};
</script>

<style lang="scss" scoped>
.index-layout-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    animation: key-opacity 0.3s ease-in-out;

    @keyframes key-opacity {
        0% { opacity: 0.1; }

        100% { opacity: 1; }
    }

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 40px;

        .header-logo {
            display: inline-block;
            width: 90px;
        }

        .change-lang {
            float: right;
        }
    }

    .confirm-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: auto;

        .confirm {
            position: relative;
            width: 100%;
            max-width: 360px;
            text-align: center;
            padding: 20px;
        }
    }
}

@media only screen and (max-width: 500px) {
    .index-layout-wrapper .header {
        padding: 40px 0 40px 20px;
    }
}
</style>
