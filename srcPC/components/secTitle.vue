<template>
    <div class="sec-title-container">
        <span v-show="isShowBack" class="back __pointer" @click="back"></span>
        <span>{{ _title }}</span>
        <span v-if="isShowHelp" @click="_showHelp" class="help __pointer">
            <i class="icon"></i>
            <span class="help-text">{{ $t(helpTitle) }}</span>
        </span>
        <slot></slot>
    </div>
</template>

<script>
import { blackHole } from 'pcUtils/ethWallet/viteContract';
import confirm from 'components/confirm/index.js';

export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        isShowBack: {
            type: Boolean,
            default: false
        },
        isShowHelp: {
            type: Boolean,
            default: true
        },
        helpTitle: {
            default: function () {
                return `${ this.$route.name }.help.title`;
            }
        },
        helpText: {
            default: function () {
                return `${ this.$route.name }.help.text`;
            }
        },
        showHelp: { default: null }
    },
    computed: {
        _title() {
            return this.title || this.$t(`${ this.$route.name }.title`);
        }
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        _showHelp() {
            if (this.showHelp) {
                this.showHelp();
                return;
            }

            confirm({
                size: 'small',
                type: 'description',
                title: this.$t(this.helpTitle),
                singleBtn: true,
                closeBtn: { show: false },
                leftBtn: { text: this.$t('btn.understand') },
                content: this.$t(this.helpText, { blackAddr: blackHole })
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.sec-title-container {
    @include font-family-bold();
    [data-theme="0"] & {
        color: $black-color-5;
    }
    [data-theme="1"] & {
        color: $white-color;
    }
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    padding: 10px 0 14px 0;

    .back {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('~assets/imgs/back.svg') center no-repeat;
        background-size: 16px 16px;
        margin-bottom: -3px;
        margin-right: 6px;
        border-radius: 2px;
        border: 1px solid $blue-color-1;
    }

    .help {
        align-items: center;
        font-size: 12px;
        color: $blue-color-1;
        text-align: right;
        line-height: 16px;
        margin-left: 12px;
        display: inline-block;
        white-space: nowrap;

        .icon {
            background: url(~assets/imgs/detail.svg);
            width: 16px;
            height: 16px;
            background-size: 100% 100%;
            display: inline-block;
            margin-right: 0;
        }

        .help-text {
            position: relative;
            bottom: 2px;
        }
    }

    .other-prod {
        float: right;
    }
}
</style>
