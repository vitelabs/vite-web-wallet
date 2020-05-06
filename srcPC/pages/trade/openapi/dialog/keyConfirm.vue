<template lang="pug">
extends /components/dialog/base.pug
block content
    .__row
        tips(type="warn") {{ $t('trade.openapi.keyConfirm.warn') }}
    .__row
        .__row_t {{ $t('trade.openapi.keyConfirm.accessKey') }}
        .__input_row {{accessKey}}
    .__row
        .__row_t {{ $t('trade.openapi.keyConfirm.secretKey') }}
        .__input_row {{secretKey}}
    .__row
        .__row_t {{ $t('trade.openapi.keyConfirm.agentAddress') }}
        .__input_row {{agentAddress}}
    .__row.key-confirm-tips
        .__row_t {{ $t('trade.openapi.keyConfirm.tips.title') }}
        ul
            li {{ $t('trade.openapi.keyConfirm.tips.0') }}
            li {{ $t('trade.openapi.keyConfirm.tips.1') }}
</template>

<script>
import tips from 'pcComponents/tips.vue';

export default {
    components: { tips },
    props: {
        accessKey: { type: String, default: null },
        secretKey: { type: String, default: null },
        agentAddress: { type: String, default: null }
    },
    data() {
        return {
            dWidth: 'wide',
            dSTxt: this.$t('trade.proxy.dialog.confirm.ok')
        };
    },
    computed: {
        dTitle() {
            return this.$t('trade.openapi.keyConfirm.title');
        }
    },
    methods: {
        inspector() {
            return Promise.resolve();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "pcComponents/confirm/confirmRow.scss";
@import "../../trust/dialog/confirm.scss";

.__row {
    .__input_row {
        @include gray_font_color_1();
    }
}

.key-confirm-tips {
    font-size: 13px;
    @include gray_font_color_1();
    ul {
        li {
            padding: 5px 0;
            list-style: disc inside;
        }
    }
}
</style>

