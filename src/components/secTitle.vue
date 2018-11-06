<template>
    <div class="sec-title-container">
        <span>{{ $t(title) }}</span>
        <span class="help">
            <i class="icon"></i>
            <span @click="_showHelp">{{ $t(helpTitle) }}</span>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            default: function() {
                return `${this.$route.name}.title`;
            }
        },
        helpTitle: {
            default: function() {
                return `${this.$route.name}.help.title`;
            }
        },
        helpText: {
            default: function() {
                return `${this.$route.name}.help.text`;
            }
        },
        showHelp: {
            default: null
        }
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
                closeBtn: {
                    show: false
                },
                leftBtn: {
                    text: this.$t('btn.understand')
                },
                content: this.$t(this.helpText)
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.sec-title-container {
    display: flex;
    justify-content: space-between;
    font-family: $font-bold;
    font-size: 24px;
    color: #1d2024;
    line-height: 32px;
    .help {
        align-items: center;
        display: flex;
        font-size: 14px;
        color: #007aff;
        text-align: right;
        line-height: 20px;
        cursor: pointer;
        .icon {
            background: url(~assets/imgs/detail.svg);
            width: 20px;
            height: 20px;
        }
    }
}
</style>
