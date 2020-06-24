<template>
    <div class="index-layout-wrapper">
        <div class="header">
            <span @click="goVX" class="header-logo __pointer"></span>
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
import openUrl from 'utils/openUrl';
import changeLang from 'pcComponents/changeLang';
import firstNotice from './firstNotice.vue';

export default {
    components: { changeLang, firstNotice },
    methods: {
        goVX() {
            return this.$router.push({ name: 'tradeCenter' });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./start.scss";

.index-layout-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
    [data-theme="0"] & {
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
    }
    [data-theme="1"] & {
        background:#1E2745;
    }

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        -webkit-app-region: drag;
        .__pointer {
            -webkit-app-region: no-drag;
        }
        [data-theme="0"] & {
            padding: 40px;
        }
        [data-theme="1"] & {
            background: transparent;
            padding: 40px;
        }
        .header-logo {
            display: inline-block;
            [data-theme="0"] & {
                height: 50px;
                width: 152px;
                background: url("~assets/imgs/ViteLogo1.svg");
                background-size: 100% 100%;
            }
            [data-theme="1"] & {
                height: 50px;
                width: 152px;
                background: url("~assets/imgs/ViteLogo1.svg");
                background-size: 100% 100%;
            }
        }
        .change-lang {
            float: right;
            white-space: nowrap;
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

