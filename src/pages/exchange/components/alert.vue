<template>
    <div class="confirm-container gray" >
        <div class="confirm-wrapper">
            <div class="title">
                <span @click="close" class="close-icon __pointer"></span>
            </div>
            <div class="content-wrapper" >
                    <div class="ex_tb">
        <div class="head-row">
            <div
                v-for="(h) in heads"
                :key="h"
            >{{h.replace("#tokenSymbol#","vite")}}
            </div>
            <div></div>
        </div>
        <div class="row-container">
            <div
                class="row"
                v-for="(v,i) in list"
                :key="i"
            >
            <div v-for="(item,j) in v " :key="j">{{item}}</div>
            </div>
        </div>
    </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        close:{
            type:Function,
            default:()=>{}
        },
        heads:{
            type:Array,
            default:[]
        },
        list:{
            type:Array,
            default:[]
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
}
@include rowWith {
    width: 8%;
    &:first-child,
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
        width: 15%;
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
        background: rgba(0, 0, 0, 0.6);
    }
}

.confirm-wrapper {
    width: 90%;
    max-width: 460px;
    max-height: 85%;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    .title {
        height: 60px;
        line-height: 60px;
        padding-left: 30px;
        font-family: $font-bold, arial, sans-serif;
        font-size: 16px;
        color: #FFFFFF;
        .close-icon {
            box-sizing: border-box;
            display: block;
            float: right;
            padding: 30px;
            width: 20px;
            height: 20px;
            background: url('~assets/imgs/confirm_close.svg') no-repeat center;
            background-size: 20px 20px;
        }
    }
    .content-wrapper {
        position: relative;
        box-sizing: border-box;
        padding: 30px;
        overflow: auto;
        font-family: $font-bold, arial, sans-serif;
        font-size: 18px;
        color: #1D2024;
        line-height: 26px;
    }
    .bottom {
        padding: 0 30px;
        display: flex;
        min-height: 80px;
        box-sizing: border-box;
        justify-content: space-between;
        .__btn {
            white-space: nowrap;
            display: inline-block;
            width: 48%;
            max-width: 190px;
            font-family: $font-bold, arial, sans-serif;
            color: #FFFFFF;
            &.btn-left {
                box-sizing: border-box;
                border: 1px solid #007AFF;
                border-radius: 2px;
                color: #007AFF;
            }
            &.unuse {
                background: #efefef;
                color: #666;
            }
        }
        .btn-single {
            width: 100%;
            max-width: 100%;
        }
    }
}
</style>

