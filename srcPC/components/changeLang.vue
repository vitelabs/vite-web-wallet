<template>
    <div class="common-list-wrapper  __pointer">
        <span :class="{
            'list-title': !isLarge,
            'lang-title': isLarge,
            'down': !showLang,
            'up': showLang
        }" @click="toggleLangList">{{ $t('lang') }}</span>
        <ul class="list" v-show="showLang">
            <li v-for="(key, index) in messages" v-show="key.lang !== $t('lang')" :key="index"
                @click="changeLocale(index)">{{key.lang}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        isLarge: Boolean,
    },
    data() {
        return {
            showLang: false,
            messages: this.$i18n.messages
        };
    },
    methods: {
        toggleLangList() {
            this.showLang = !this.showLang;
        },
        changeLocale(locale) {
            this.$i18n.locale = locale;
            window.viteWalletI18n && window.viteWalletI18n.setLocale(locale);
            this.$store.commit('setLang', locale);
            this.toggleLangList();
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
@use "@pc/assets/scss/list/start.scss" as *;
@use "@pc/assets/scss/list/setting.scss" as *;

.lang-title {
    @include font-family-normal();
    color: #fff;
    font-size: 14px;
    display: inline-block;
    min-width: 50px;
    text-align: right;
    padding: 10px 30px;
}

.start.common-list-wrapper .list {
    border: 1px solid #ced5de;
    border-radius: 12px;
    box-shadow: 0 37px 15px #20202d03, 0 21px 12px #20202d0d, 0 9px 9px #20202d17, 0 2px 5px #20202d1a, 0 0 #20202d1a;
    padding: 10px;
    li {
        text-align: right;
    }
}
</style>
