<template>
    <div class="confirm-container gray" >
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

.dex .__tb {
    min-width: 0px;
    flex: 1;
    .__tb_no_data {
        margin-top: 60px;
    }
}

@include rowWith {
    width: 15%;
    &:first-child {
        min-width: 110px;
    }
}

.confirm-container {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    &.gray {
        background: rgba(0, 0, 0, 0.3);
    }
}

.confirm-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 70%;
    max-height: 85%;
    min-height: 300px;
    min-width: 500px;
    background: #fff;
    border-radius: 2px;

    .title {
        padding: 12px 18px;
        display: flex;
        justify-content: space-between;
        @include font-family-bold();
        font-size: 14px;
        color: #fff;
        background: rgba(38, 142, 255, 1);
        border-radius: 2px 2px 0 0;
        .close-icon {
            box-sizing: border-box;
            width: 20px;
            height: 20px;
            background: url('~assets/imgs/confirm_close.svg') no-repeat center;
            background-size: 20px 20px;
        }
    }
}
</style>

