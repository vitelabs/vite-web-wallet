<template>
    <div class="net-info-wrapper">
        <div class="row">
            <span class="title">{{ $t('setting.block') }}</span>{{ height || '----' }}
        </div>
        <div class="row">
            <span class="title">{{ $t('setting.version') }}</span>{{ version }}
        </div>
        <div class="row">
            <span class="a-link __pointer" @click="openEmail">
                <span class="title">{{ $t('setting.service') }}</span><span class="link">info@vite.org</span>
            </span>
            <span class="a-link __pointer" @click="go('https://vite.org/')">
                <span class="title">{{ $t('setting.site') }}</span><span class="link">vite.org</span>
            </span>
            <span class="a-link __pointer" @click="goNet">
                <span class="title">{{ $t('setting.explorer') }}</span><span class="link">{{ netService }}</span>
            </span>
        </div>
        <div class="row">
            <span class="a-link __pointer"  @click="go('https://vite.net/')">
                <span class="title">{{ $t('setting.sys') }}</span><span class="link">vite.net</span>
            </span>
            <span class="a-link __pointer"  @click="go('https://github.com/vitelabs')">
                <span class="title">{{ $t('setting.open') }}</span><span class="link">https://github.com/vitelabs</span>
            </span>
        </div>
    </div>
</template>

<script>
import openUrl from 'utils/openUrl';
import { getExplorerLink } from 'utils/getLink';

export default {
    mounted() {
        this.$store.dispatch('startLoopHeight', 3000);
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    data() {
        return {
            version: process.env.version,
            netService: getExplorerLink(this.$i18n.locale)
        };
    },
    computed: {
        height() {
            return this.$store.state.ledger.currentHeight;
        }
    },
    methods: {
        goNet() {
            this.go(this.netService);
        },
        openEmail() {
            window.open('mailto:info@vite.org');
        },
        go(url) {
            openUrl(url);
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
    @include font_color_to_white(#5e6875);
    .a-link {
        @include setting_common_color();
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
        @include setting_common_color();
    }
    .link {
        color: $blue-color-1;
    }
}
</style>
