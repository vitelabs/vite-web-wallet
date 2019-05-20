<template>
    <div class="sec-title-container">
        <span>{{ $t(title) }}</span>
        <span v-if="isShowHelp" @click="_showHelp" class="help __pointer">
            <i class="icon"></i>
            <span class="help-text" v-html="$t(helpTitle)"></span>
        </span>
    </div>
</template>

<script>
import goNetBtn from './goNetBtn.vue';
import { blackHole } from 'utils/ethWallet/viteContract';

export default {
    components: { goNetBtn },
    props: {
        title: {
            default: function () {
                return `${ this.$route.name }.title`;
            }
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
    methods: {
        _showHelp() {
            if (this.showHelp) {
                this.showHelp();

                return;
            }
            this.$confirm({
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
    font-family: $font-bold, arial, sans-serif;
    font-size: 24px;
    color: #1d2024;
    line-height: 40px;

    .help {
        margin-top: 6px;
        align-items: center;
        font-size: 14px;
        color: #007aff;
        text-align: right;
        line-height: 20px;
        margin-left: 16px;
        display: inline-block;
        white-space: nowrap;

        .icon {
            background: url(~assets/imgs/detail.svg);
            width: 20px;
            height: 20px;
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

@media only screen and (max-width: 900px) {
    .sec-title-container {
        .help {
            margin-left: 0;
            margin-top: 8px;
            text-align: left;
            display: block;
        }
    }
}
</style>
