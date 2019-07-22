<template>
    <div class="index-layout-wrapper">
        <div class="header">
            <img class="header-logo __pointer" src="~assets/imgs/ViteLogo1.svg"/>
            <change-lang class="start change-lang __pointer"></change-lang>
        </div>
        <div class="confirm-wrapper">
            <div class="confirm">
                <router-view></router-view>
                <first-notice v-if="$route.name === 'start'"></first-notice>
            </div>
        </div>
    </div>
</template>

<script>
import firstNotice from 'components/firstNotice.vue';
import changeLang from 'components/changeLang';

export default {
    components: { changeLang, firstNotice },
    mounted() {
        console.log(this.$route.name);
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.index-layout-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    animation: key-opacity 0.3s ease-in-out;
    background: url(~assets/imgs/bg.svg) rgba(255, 255, 255, 0.1) no-repeat;
    background-size: cover;
    @keyframes key-opacity {
        0% {
            opacity: 0.1;
        }

        100% {
            opacity: 1;
        }
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
            text-align: center;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

@media only screen and (max-width: 500px) {
    .index-layout-wrapper .header {
        padding: 40px 0 40px 20px;
    }
}
</style>

