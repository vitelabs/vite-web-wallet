<template>
    <div class="index-layout-wrapper">
        <div class="container">
            <div class="header">
                <span class="header-logo __pointer"></span>
                <change-lang class="start change-lang __pointer" is-large></change-lang>
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
    background: linear-gradient(63deg,#5897fb 32.8%,#000 94.95%);
    
    .container {
        margin: 0 auto;
        max-width: 1170px;
    }

    .header {
        padding-top: 10px;
        display: grid;
        grid-template-columns: 1fr auto;
        .header-logo {
            display: block;
            height: 50px;
            width: 152px;
            background: url("@assets/imgs/ViteLogo.svg");
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

