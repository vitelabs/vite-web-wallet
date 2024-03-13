<template>
    <div class="index-layout-wrapper">
        <div class="container">
            <div class="header">
                <span @click="goVX" class="header-logo __pointer"></span>
                <change-lang class="start change-lang __pointer"></change-lang>
            </div>
            <router-view></router-view>
            <first-notice v-if="$route.name === 'start'"></first-notice>
        </div>
    </div>
</template>

<script>
import openUrl from '@utils/openUrl';
import changeLang from '@pc/components/changeLang.vue';
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
@use "./start.scss";

.index-layout-wrapper {
    min-height: 100%;
    background: linear-gradient(63deg,#00beff 32.8%,#00ff95 94.95%);
    
    .container {
        margin: 0 auto;
        max-width: 1170px;
    }

    .header {
        padding-top: 80px;
        display: grid;
        grid-template-columns: 1fr auto;
        .header-logo {
            display: block;
            height: 50px;
            width: 152px;
            background: url("@assets/imgs/ViteLogo1.svg");
            background-size: 100% 100%;
        }
        .change-lang {
            white-space: nowrap;
        }
    }
}

@media only screen and (max-width: 500px) {
    .index-layout-wrapper .header {
        padding: 40px 0 40px 20px;
    }
}
</style>

