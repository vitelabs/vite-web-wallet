<template>
    <div class="depth-table-wrapper">
        <div class="depth-row" @click="clickRow(item)"
             v-for="(item, i) in depthData" :key="i">
            <span class="depth-item">{{ item.pirce }}</span>
            <span class="depth-item">{{ item.num }}</span>
            <span class="depth-item">{{ item.pirce * item.num }}</span>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        depthData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        clickRow: {
            type: Function,
            default: () => {}
        }
    },
    created() {
        // ....
    },
    data() {
        return {
        };
    },
    methods: {

    }
};
</script>

<style lang="scss" scoped>
@import './center.scss';

</style>
