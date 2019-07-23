<template>
    <Vswitch :optList="optList" v-model="innerValue"/>
</template>
<script>
import Vswitch from 'uiKit/switch';
export default {
    components: { Vswitch },
    props: {
        value: {
            type: String,
            default: 'TOTAL'
        }
    },
    watch: {
        innerValue(val) {
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
