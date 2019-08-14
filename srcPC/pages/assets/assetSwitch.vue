<template>
    <Vswitch :optList="optList" v-model="innerValue"/>
</template>

<script>
import statistics from 'utils/statistics';
import Vswitch from 'uiKit/switch';

export default {
    components: { Vswitch },
    props: {
        value: {
            type: String,
            default: 'TOTAL'
        }
    },
    computed: {
        activeAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        innerValue(val) {
            statistics.event(this.$route.name, 'changeEstimate', this.activeAddr || '');
            this.$emit('input', val);
        }
    },
    data() {
        return {
            optList: [ { name: this.$t('tokenCard.assetType')['TOTAL'], value: 'TOTAL' }, { name: this.$t('tokenCard.assetType')['WALLET'], value: 'WALLET' }, { name: this.$t('tokenCard.assetType')['EX'], value: 'EX' } ],
            innerValue: this.value
        };
    }
};
</script>
