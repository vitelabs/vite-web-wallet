<template>
    <div class="net-info-wrapper">
        <div class="row">
            <span class="title">{{ $t('setting.block') }}</span>{{ height || '----' }}
        </div>
        <div class="row">
            <span class="title">{{ $t('setting.version') }}</span>{{ version }}
        </div>
        <div class="row">
            <a href="mailto:info@vite.org" target="_blank">
                <span class="title">{{ $t('setting.service') }}</span><span class="link">info@vite.org</span>
            </a>
            <a href="https://vite.org/" target="_blank">
                <span class="title">{{ $t('setting.site') }}</span><span class="link">vite.org</span>
            </a>
            <a class="__pointer" @click="goNet">
                <span class="title">{{ $t('setting.explorer') }}</span><span class="link">{{ netService }}</span>
            </a>
        </div>
        <div class="row">
            <a href="https://vite.net/" target="_blank">
                <span class="title">{{ $t('setting.sys') }}</span><span class="link">vite.net</span>
            </a>
            <a href="https://github.com/vitelabs" target="_blank">
                <span class="title">{{ $t('setting.open') }}</span><span class="link">https://github.com/vitelabs</span>
            </a>
        </div>
    </div>
</template>

<script>
import openUrl from 'utils/openUrl';

export default {
    created() {
        this.$store.dispatch('startLoopHeight');
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    data() {
        return {
            version: process.env.version,
            netService: process.env.viteNet
        };
    },
    computed: {
        height() {
            return this.$store.state.ledger.currentHeight;
        }
    },
    methods: {
        goNet() {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            openUrl(`${ process.env.viteNet }${ locale }`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./setting.scss";

.net-info-wrapper {
    opacity: 0.8;
    line-height: 28px;
    letter-spacing: 0.35px;
    font-size: 14px;
    color: #5e6875;

    a {
        color: #5e6875;
        margin-left: 20px;
        white-space: nowrap;

        &:first-child {
            margin-left: 0;
        }
    }

    .title {
        margin-right: 15px;
        opacity: 0.8;
        font-size: 14px;
        @include font-family-bold();
    }

    .link {
        color: #118bff;
    }
}
</style>
