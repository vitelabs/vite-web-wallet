<template>
    <div class="change-lang-wrapper">
        <div class="title">{{$t('setting.lang')}}</div>

        <div class="lang-list __pointer">
            <div class="row" @click="toggleLangList">
                {{ $t('lang') }}
                <span :class="{ 
                    'slide': true,
                    'down': !showLang,
                    'up': showLang
                }"></span>
            </div>
            <div v-for="(key, index) in messages" v-show="showLang && key.lang !== $t('lang')" :key="index" 
                 class="row" @click="changeLocale(index)">{{key.lang}}</div>
        </div>
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
            localStorage.setItem('lang', locale);
            this.toggleLangList();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.title {
    font-size: 14px;
    color: #1D2024;
    letter-spacing: 0.35px;
    font-family: $font-bold;
    margin-bottom: 16px;
}
.lang-list {
    width: 250px;
    border: 1px solid #D4DEE7;
    border-radius: 2px;
    font-size: 14px;
    color: #5E6875;
}
.row {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    background: #FFFFFF;
    border-top: 1px solid #D4DEE7;
    &:first-child {
        border-top: none;
    }
    .slide {
        display: inline-block;
        position: absolute;
        top: 50%;
        right: 20px;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        &.down {
            background: url('../../assets/imgs/down_icon.svg');
            background-size: 16px 16px;
        }
        &.up {
            background: url('../../assets/imgs/up_icon.svg');
            background-size: 16px 16px;
        }
    }
}

</style>
