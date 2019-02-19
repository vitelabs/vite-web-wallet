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
            <div
                v-for="(h) in heads"
                :key="h"
            >{{h}}
            </div>
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
        },
        title:{
            type:String,
            default:""
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
    width: 20%;
    &:first-child{
        width:40%
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
    max-width: 960px;
    max-height: 85%;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 2px;
    .title {
        height: 60px;
        line-height: 60px;
        padding:0 30px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        font-family: $font-bold, arial, sans-serif;
        font-size: 16px;
        color: #5E6875;
        align-items: center;
        .close-icon {
            box-sizing: border-box;
            width: 20px;
            height: 20px;
            background: url('~assets/imgs/exchange/close.svg') no-repeat center;
            background-size: 20px 20px;
        }
    }
    .content-wrapper {
        position: relative;
        box-sizing: border-box;
        overflow: auto;
        font-size: 18px;
        color: #1D2024;
        line-height: 26px;
    }
}
</style>

