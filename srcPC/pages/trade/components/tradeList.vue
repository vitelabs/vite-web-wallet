<template>
    <confirm class="big no-padding-confirm" :closeIcon="true" :showMask="true"
             :title="title" :close="close">
        <wallet-table class="trade-list-table" :headList="heads" :contentList="list"></wallet-table>
    </confirm>
</template>

<script>
import confirm from '@pc/components/confirm/confirm.vue';
import walletTable from '@pc/components/table/index.vue';

export default {
    components: { confirm, walletTable },
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        heads: {
            type: Array,
            default: () => []
        },
        list: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ''
        }
    }
};
</script>
