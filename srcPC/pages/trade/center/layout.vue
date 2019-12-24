<template>
    <div class="exchange-layout __flex_row">
        <div class="left __flex_column">
            <div class="t __border"> <slot name="lb1"></slot> </div>
            <div class="b __border"> <slot name="lb3"></slot> </div>
        </div>
        <div class="center __flex_column">
            <div class="t __flex_column __border">
                <div class="t-t"> <slot name="lt"></slot> </div>
                <div class="c"> <slot name="lb2"></slot> </div>
            </div>
            <div class="b __border"> <slot name="lb4"></slot> </div>
        </div>
        <div class="right __border"> <slot name="r"></slot> </div>
    </div>
</template>

<style lang="scss" scoped>
.__flex_row {
    display: flex;
    flex-direction: row;
}

.__flex_column {
    display: flex;
    flex-direction: column;
}

.exchange-layout {
    width: 100%;
    height: 100%;
    padding-bottom: 10px;
    box-sizing: border-box;
    min-height: 750px;
    max-height: 900px;

    .__border {
        border-radius: 2px;
        @include bg_color_2();
        @include box_shadow();
    }

    .left {
        height: 100%;
        flex-basis: 270px;
        min-width: 270px;
        margin-right: 10px;
        .t {
            flex: 1;
            height: 480px;
            margin-bottom: 10px;
        }
        .b {
            flex-basis: 250px;;
            overflow: auto;
        }
    }

    .center {
        max-width: calc(100% - 550px);
        flex: 1;
        margin-right: 10px;
        .t {
            flex: 1;
        }
        .t-t {
            width: 100%;
        }
        .c {
            flex: 1;
            overflow: auto;
        }
        .b {
            margin-top: 10px;
            flex-basis: 250px;
            max-height: 250px;
        }
    }

    .right {
        width: 270px;
        min-width: 270px;
    }
}
</style>
