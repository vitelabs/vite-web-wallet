<template>
    <div class="setting-wrapper">
        <div class="title  __pointer">{{ $t('setting.title') }}</div>
        <div class="content-wrapper">
            <div class="content">
                <slot></slot>
            </div>
            <div class="description">
                <div class="row">
                    <span class="title">{{ $t('setting.block') }}</span>{{ height || '----' }}
                </div>
                <div class="row">
                    <span class="title">{{ $t('setting.version') }}</span>{{ version }}
                </div>
                <div class="row">
                    <span class="title">{{ $t('setting.service') }}</span>info@vite.org
                    <span class="title">{{ $t('setting.site') }}</span>vite.org
                </div>
                <div class="row">
                    <span class="title">{{ $t('setting.sys') }}</span>vite.net
                    <span class="title">{{ $t('setting.open') }}</span>https://github.com/vitelabs
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import versionList from 'version';

let heightEvent = null;

export default {
    data() {
        let code = 0;
        let versionStr = '';
        for(let key in versionList) {
            +key > code && (versionStr = versionList[key].version);
        }

        return {
            height: '',
            version: versionStr
        };
    },
    mounted() {
        this.height = viteWallet.Ledger.getHeight();
        heightEvent = webViteEventEmitter.on('currentHeight', (height) => {
            this.height = height;
        });
    },
    destroyed() {
        webViteEventEmitter.off(heightEvent);
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.setting-wrapper {
    position: relative;
    box-sizing: border-box;
    padding: 30px;
    height: 100%;
    .title {
        font-family: $font-bold;
        font-size: 24px;
        color: #1D2024;
        line-height: 32px;
    }
    .content-wrapper {
        position: absolute;
        top: 92px;
        bottom: 30px;
        left: 30px;
        right: 30px;
        overflow: auto;
        background: #FFFFFF;
        box-shadow: 0 2px 48px 1px rgba(176,192,237,0.17);
        border-radius: 8px;
        .content {
            padding: 20px;
        }
        .description {
            padding: 20px;
            border-top: 1px solid #C6CBD4;
            opacity: 0.8;
            line-height: 28px;
            font-size: 14px;
            color: #5E6875;
            letter-spacing: 0.35px;
            .title {
                opacity: 0.8;
                font-size: 14px;
                font-family: $font-bold;
                margin-right: 15px;
                &:last-child {
                    margin-left: 20px;
                }
                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }
}
</style>
