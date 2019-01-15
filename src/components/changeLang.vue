<template>
    <div class="change-lang-wrapper __pointer">
        <span class="lang" :class="{
            'down': !showLang,
            'up': showLang
        }" @click="toggleLangList">{{ $t('lang') }}</span>
        <ul class="lang-list" v-show="showLang">
            <li v-for="(key, index) in messages" v-show="key.lang !== $t('lang')" :key="index" 
                @click="changeLocale(index)">{{key.lang}}</li>
        </ul>
    </div>
</template>

<script>
import localStorage from 'utils/localStorage';

export default {
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
            localStorage.setItem('lang', locale);
            this.toggleLangList();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/lang/start.scss";
@import "~assets/scss/lang/exchange.scss";
@import "~assets/scss/lang/setting.scss";
</style>
