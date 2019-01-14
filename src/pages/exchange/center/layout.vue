<template>
    <div class="exchange-layout">
        <div class="left">
            <div class="left-top"> <slot name="leftT"></slot> </div>
            <div class="left-bottom"> <slot name="leftB"></slot> </div>
        </div>
        <div class="right"> <slot name="right"></slot> </div>
        <div class="center">
            <div class="center-top"> <slot name="centerT"></slot> </div>
            <div class="center-center"> <slot name="centerC"></slot> </div>
            <div class="center-bottom"> <slot name="centerB"></slot> </div>
        </div>
    </div>
</template>

<script>
export default {
    
};
</script>

<style lang="scss" scoped>
.exchange-layout {
    min-width: 1400px;
    height: 1000px;
    .left {
        width: 20%;
        height: 100%;
        background: #000;
        float: left;
        .left-top {
            width: 100%;
            height: 50%;
            background: #444;
        }
        .left-bottom {
            widows: 100%;
            height: 50%;
            background: #888;
        }
    }
    .center {
        margin-left: 20%;
        margin-right: 20%;
        height: 100%;
        background: #a9ef9a;
        .center-top {
            width: 100%;
            height: 10%;
            background: #23e;
        }
        .center-center {
            height: 50%;
            width: 100%;
            background: #2ae90e;
        }
        .center-bottom {
            width: 100%;
            height: 500px;
            background: #823;
        }
    }
    .right {
        width: 20%;
        height: 100%;
        background: #93a;
        float: right;
    }
}
</style>
