<template>
    <div class="confirm-container gray" >
        <div class="confirm-wrapper">
            <div class="title">
                <span>{{title}}</span>
                <span @click="close" class="close-icon __pointer"></span>
            </div>
            <div class="content-wrapper" >
                <div class="ex_tb">
                    <div class="head-row">
                        <div v-for="(h) in heads" :key="h">{{ h }}</div>
                    </div>
                    <div class="row-container">
                        <div class="row" v-for="(v,i) in list" :key="i">
                            <div v-for="(item,j) in v " :key="j">{{item}}</div>
                        </div>
                        <div class="no-data" v-show="!list || !list.length">
                            <div>{{ $t('hint.noData') }}</div>
                        </div>
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
@import "~assets/scss/vars.scss";
@import "./table.scss";

.ex_tb {
    height: 100%;
    padding-bottom: 10px;
    padding-top: 34px;
    .head-row {
        height: 34px;
    }
}

@include rowWith {
    width: 15%;
    &:first-child {
        min-width: 160px;
    }
}

.buy {
    color: #ff0008;
}

.sell {
    color: #5bc500;
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
    width: 90%;
    max-width: 960px;
    max-height: 85%;
    min-height: 300px;
    min-width: 500px;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 2px;

    .title {
        line-height: 20px;
        padding: 20px 6px;
        display: flex;
        justify-content: space-between;
        font-family: $font-bold, arial, sans-serif;
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

    .content-wrapper {
        position: relative;
        box-sizing: border-box;
        overflow: auto;
        font-size: 18px;
        color: #1d2024;
        line-height: 26px;
    }
}
</style>

