<template>
    <Vswitch
        :optList="optList"
        v-model="innerValue"
    />
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
            optList: [ { name: '全部资产估值', value: 'TOTAL' }, { name: '钱包资产估值', value: 'WALLET' }, { name: '交易所资产估值', value: 'EX' } ],
            innerValue: this.value
        };
    }
};
</script>
