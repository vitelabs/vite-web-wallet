<template>
    <div class="change-lang-wrapper">
        <span class="lang" @click="toggleLangList">{{ $t('lang') }}</span>
        <ul class="lang-list" v-show="showLang">
            <li v-for="(key, index) in messages" v-show="key.lang !== $t('lang')" :key="index" 
                @click="changeLocale(index)">{{key.lang}}</li>
        </ul>
    </div>
</template>

<script>
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
            window.webViteEventEmitter.emit('changeLang', locale);
            this.toggleLangList();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.change-lang-wrapper {
    position: relative;
    height: 100%;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;
    font-family: $font-bold;
    &:before {
        content: ' ';
        display: block;
        float: left;
        width: 1px;
        height: 100%;
        background: #E5EDF3;
        opacity: 0.33;
    }
}
.lang {
    display: inline-block;
    min-width: 50px;
    text-align: center;
    height: 100%;
    padding: 10px 30px;
}
.lang-list {
    position: absolute;
    right: 20px;
    min-width: 80px;
    margin-top: 4px;
    background: #FFFFFF;
    border: 1px solid #E5EDF3;
    box-shadow: 0 6px 36px 0 rgba(176,192,237,0.04);
    border-radius: 4px;
    font-family: $font-normal;
    font-size: 14px;
    color: #5E6875;
    letter-spacing: 0;
    line-height: 16px;
    li {
        box-sizing: border-box;
        width: 100%;
        padding: 0 16px;
        text-align: center;
        height: 36px;
        line-height: 36px;
        &:hover {
            background: rgba(75,116,255,0.10);
        }
    }
}
</style>
