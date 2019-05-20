<template>
    <div class="setting-wrapper">
        <sec-title :isShowHelp="false"></sec-title>
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
                    <a href="mailto:info@vite.org"  target="_blank">
                        <span class="title">{{ $t('setting.service') }}</span><span class="link">info@vite.org</span>
                    </a>
                    <a href="https://vite.org/" target="_blank">
                        <span class="title">{{ $t('setting.site') }}</span><span class="link">vite.org</span>
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
        </div>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';

export default {
    components: { secTitle },
    data() {
        return { version: process.env.version };
    },
    computed: {
        height() {
            return this.$store.state.ledger.currentHeight;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.setting-wrapper {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding: 40px;

    .content-wrapper {
        position: absolute;
        top: 102px;
        bottom: 30px;
        left: 40px;
        right: 40px;
        overflow: auto;
        background: #fff;
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.17);
        border-radius: 8px;

        .content {
            max-width: 480px;
            padding: 20px;
        }

        .description {
            padding: 20px;
            border-top: 1px solid #c6cbd4;
            opacity: 0.8;
            line-height: 28px;
            letter-spacing: 0.35px;
            font-size: 14px;
            color: #5e6875;

            a {
                color: #5e6875;

                &:last-child {
                    margin-left: 20px;
                }

                &:first-child {
                    margin-left: 0;
                }
            }

            .title {
                margin-right: 15px;
                opacity: 0.8;
                font-size: 14px;
                font-family: $font-bold, arial, sans-serif;
            }

            .link {
                color: #118bff;
            }
        }
    }
}

@media only screen and (max-width: 850px) {
    .setting-wrapper {
        padding: 15px;
    }

    .setting-wrapper .content-wrapper {
        top: 70px;
        bottom: 15px;
        left: 15px;
        right: 15px;
    }
}

@media only screen and (max-width: 500px) {
    .setting-wrapper {
        background: #fff;
    }

    .setting-wrapper .content-wrapper {
        top: 122px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        box-shadow: none;
        border-radius: 0;

        .content {
            padding: 0;
        }

        .description {
            padding: 0;
        }
    }
}

@media only screen and (max-width: 750px) {
    .setting-wrapper .content-wrapper .description {
        a {
            display: block;

            &:last-child {
                margin-left: 0;
            }
        }
    }
}
</style>
