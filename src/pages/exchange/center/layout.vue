<template>
    <div class="exchange-layout __flex_row">
        <div class="left __flex_column">
            <div class="left-top __border"> <slot name="lt"></slot> </div>
            <div class="left-bottom __flex_column">
                <div class="t __flex_row">
                    <div class="l __border"> <slot name="lb1"></slot> </div>
                    <div class="r __border"> <slot name="lb2"></slot> </div>
                </div>
                <div class="b __flex_row">
                    <div class="l __border"> <slot name="lb3"></slot> </div>
                    <div class="r __border"> <slot name="lb4"></slot> </div>
                </div>
            </div>
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
    min-height: 750px;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;

    .__border {
        border-radius: 2px;
        background: rgba(255,255,255,1);
        box-shadow: 0px 2px 10px 1px rgba(188, 198, 224, 0.42);
    }

    .left {
        flex: 1;
        margin-right: 10px;
        .left-top {
            width: 100%;
            height: 60px;
        }
        .left-bottom {
            flex: 1;
            margin-top: 10px;
            .t {
                flex: 1;
                margin-bottom: 10px;
            }
            .b {
                flex-basis: 300px;
            }
            .l {
                flex-basis: 32%;
                margin-right: 10px;
            }
            .r {
                flex: 1;
                overflow: auto;
            }
        }
    }
    .right {
        width: 300px;
    }
}
</style>
