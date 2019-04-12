<template>
    <div class="confirm-container gray" >
        <div class="confirm-wrapper">
            <div class="title">
                <span>{{title}}</span>
                <span @click="close" class="close-icon __pointer"></span>
            </div>

            <div class="ex_tb">
                <div class="head-row">
                    <div v-for="(h) in heads" :key="h">{{ h }}</div>
                </div>
                <div class="no-data" v-show="!list || !list.length">
                    <div>{{ $t('hint.noData') }}</div>
                </div>
                <div class="row-container">
                    <div class="row" v-for="(v,i) in list" :key="i">
                        <div v-for="(item,j) in v " :key="j">{{item}}</div>
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
    flex: 1;
}

@include rowWith {
    width: 15%;
    &:first-child {
        min-width: 110px;
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

    .ex_tb {
        position: absolute;
        display: block;
        top: 44px;
        bottom: 0;
        left: 0;
        right: 0;
        box-shadow: none;
        .no-data {
            position: relative;
            top: 0;
            margin-top: 55px;
        }
        .head-row {
            position: sticky;
            >div {
                &:first-child {
                    margin: 0 3px 0 18px;
                }
                &:last-child {
                    justify-content: flex-start;
                    margin: 0 18px 0 3px;
                }
            }
        }
        .row-container {
            position: absolute;
            top: 32px;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .row {
            &:last-child {
                border-bottom: 1px solid rgba(198, 203, 212, 0.3);
            }
            >div {
                &:first-child {
                    margin: 0 3px 0 18px;
                }
                &:last-child {
                    justify-content: flex-start;
                    margin: 0 18px 0 3px;
                }
            }
        }
    }
}
</style>

