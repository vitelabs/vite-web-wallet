<template>
    <div class="confirm-container big gray" >
        <div class="confirm-wrapper">
            <div class="title">
                <span>{{title}}</span>
                <span @click="close" class="close-icon __pointer"></span>
            </div>

            <div class="__tb">
                <div class="__tb_row __tb_head __pointer">
                    <div class="__tb_cell" v-for="(h) in heads" :key="h">{{ h }}</div>
                </div>

                <div class="__tb_content __tb_content_no_data"  v-show="!list || !list.length">
                    <div class="__tb_no_data">
                        <div>{{ $t('hint.noData') }}</div>
                    </div>
                </div>

                <div v-show="list && list.length" class="__tb_content">
                    <div class="__tb_row __pointer __tb_content_row" v-for="(v,i) in list" :key="i">
                        <div class="__tb_cell" v-for="(item,j) in v " :key="j">{{item}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// [TODO] Need components/confirm and components/table
export default {
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

<style lang="scss" scoped>
@import "~assets/scss/table.scss";
@import "~components/confirm/confirm.scss";

.__tb {
    min-width: 0px;
    flex: 1;
}

@include rowWith {
    width: 25%;
    &:first-child {
        min-width: 110px;
    }
}

.confirm-wrapper {
    min-height: 300px;
}
</style>
