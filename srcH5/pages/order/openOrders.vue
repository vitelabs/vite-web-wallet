<template>
    <open-table class="open-order-table" :list="list"></open-table>
</template>

<script>
import { order } from 'services/trade';
import openTable from 'h5Components/openTable';

export default {
    components: { openTable },
    mounted() {
        this.init();
    },
    data() {
        return { list: [] };
    },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        init() {
            if (!this.defaultAddr) {
                return;
            }

            order({
                address: this.defaultAddr,
                status: 1,
                offset: 0,
                limit: 100
            }).then(data => {
                this.list = data.order || [];
            });
        }
    }
};
</script>
