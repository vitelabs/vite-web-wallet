<template>
    <div class="open-order-ct">
        <open-table class="open-order-table" :list="list"></open-table>
    </div>
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

<style lang="scss" scoped>
.open-order-ct {
    height: 100%;
    box-sizing: border-box;
    padding-top: 10px;
    .open-order-table {
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    }
}
</style>
