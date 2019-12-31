<template>
    <div ref="wrapper" @click="_setSize" class="process-wrapper __pointer">
        <div class="line-wrapper">
            <div ref="line" class="line" :class="{
                'smooth': !isShowPrecent
            }" :style="{ 'width': size + '%' }">
                <div ref="drag" @mousedown="pcDrag" class="drag"
                     @mouseenter="showPercent" @mouseleave="hidePercent">
                    <span ref="percent" class="percent" :class="{
                        'show': isShowPrecent
                    }">{{ parseFloat(size).toFixed(2) }}%</span>
                </div>
            </div>

            <ul class="list">
                <li ref="point0">
                    <span :class="{ 'active': size >= 0 }"></span>
                </li>
                <li ref="point1">
                    <span :class="{ 'active': size >= 25 }"></span>
                </li>
                <li ref="point2">
                    <span :class="{ 'active': size >= 50 }"></span>
                </li>
                <li ref="point3">
                    <span :class="{ 'active': size >= 75 }"></span>
                </li>
                <li ref="point4">
                    <span :class="{ 'active': size >= 100 }"></span>
                </li>
            </ul>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        },
        default: {
            type: Number,
            default: 0
        },
        _size: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.init();
    },
    data() {
        const size = this.default / (this.max - this.min);
        return {
            size: size * 100,
            isShowPrecent: false,
            isEnterPercent: false
        };
    },
    model: { prop: '_size' },
    watch: {
        _size: function () {
            let _size = this._size >= 1 ? 1 : this._size;
            _size = _size <= 0 ? 0 : _size;
            this.size = _size * 100;
        }
    },
    methods: {
        init() {
            this.$refs.drag.addEventListener('touchstart', e => {
                this.showPercent(e);
            });
            this.$refs.drag.addEventListener('touchmove', e => {
                this.mobileDrag(e);
            });
            this.$refs.drag.addEventListener('touchend', e => {
                this.hidePercent(e);
            });
        },
        pcDrag(e) {
            const eWidth = this.$refs.line.clientWidth;
            const startX = e.clientX;

            document.onmousemove = ev => {
                const currX = ev.clientX;
                this.emitDrag(currX, startX, eWidth);
            };
            document.touchend = () => {
                !this.isEnterPercent && this.hidePercent();

                document.onmousemove = null;
                document.onmouseup = null;
            };
            document.onmouseup = () => {
                !this.isEnterPercent && this.hidePercent();

                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
        mobileDrag(e) {
            const startX = this.$refs.drag.offsetLeft + this.$refs.drag.clientWidth / 2;

            const ev = e || window.event;
            const touch = ev.targetTouches[0];
            const currX = touch.clientX - this.$refs.wrapper.offsetLeft;

            this.emitDrag(currX, startX, this.$refs.line.clientWidth);
        },
        emitDrag(currX, startX, eWidth) {
            this.showPercent();

            const allWidth = this.$refs.wrapper.clientWidth;
            const distance = currX - startX;

            let curentWidth = eWidth + distance;
            curentWidth = curentWidth > 0 ? curentWidth : 0;
            curentWidth = curentWidth > allWidth ? allWidth : curentWidth;
            this.size = curentWidth / allWidth * 100;
            this.$emit('drag', this.size);
        },
        showPercent(e) {
            e && (this.isEnterPercent = true);
            this.isShowPrecent = true;
        },
        hidePercent(e) {
            e && (this.isEnterPercent = false);
            this.isShowPrecent = false;
        },
        _setSize(e) {
            if (e.target === this.$refs.drag || e.target === this.$refs.percent) {
                return;
            }

            const part = 25;
            let i;
            for (i = 0; i < 5; i++) {
                const el = this.$refs[`point${ i }`];
                if (el && (e.target === el || el.contains(e.target))) {
                    break;
                }
            }
            if (i < 5) {
                this.size = part * i;
                this.$emit('drag', this.size);
                return;
            }

            const allWidth = this.$refs.wrapper.clientWidth;
            let currentWidth = e.offsetX - this.$refs.wrapper.clientLeft;

            currentWidth = currentWidth > 0 ? currentWidth : 0;
            currentWidth = currentWidth > allWidth ? allWidth : currentWidth;

            this.size = currentWidth / allWidth * 100;
            this.$emit('drag', this.size);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

$red: linear-gradient(270deg, rgba(226,43,116,1) 0%, rgba(237,81,88,1) 100%);
$green: linear-gradient(270deg, rgba(0,212,208,1) 0%, rgba(0,215,100,1) 100%);

.dex-order.process-wrapper {
    padding: 16px 0px;
    .line-wrapper {
        height: 2px;
        border-radius: 2px;
        [data-theme="0"] & {
            background: rgba(229,235,241,1);
        }
        [data-theme="1"] & {
            background: $black-color-4;
        }
    }
    .line {
        .drag {
            position: absolute;
            width: 26px;
            height: 26px;
            top: -13px;
            right: -13px;
            background: none;
            box-shadow: none;
            border: none;
            z-index: 1;

            &:before {
                position: absolute;
                top: 8px;
                left: 8px;
                display: inline-block;
                content: ' ';
                width: 10px;
                height: 10px;
                border-radius: 10px;
            }
            .percent {
                opacity: 0;
                display: inline-block;
                position: absolute;
                top: -25px;
                transform: translateX(-50%);
                left: 12px;
                padding: 2px 6px;
                border-radius: 2px;
                font-size: 12px;
                font-family: $font-H;
                font-weight: 400;
                color: $white-color;
                line-height: 16px;
                transition: all 0.2s linear;
                user-select: none;
                &.show {
                    opacity: 1;
                }
                &::before {
                    display: inline-block;
                    content: ' ';
                    border: 6px solid transparent;
                    position: absolute;
                    bottom: -12px;
                    left: 50%;
                    margin-left: -6px;
                }
            }
        }
    }
    .list {
        display: block;
        position: absolute;
        top: -3px;
        left: 0;
        width: 100%;
        li {
            position: absolute;
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -6px;
            &:first-child {
                left: 0px;
            }
            &:nth-child(2) {
                left: 25%;
            }
            &:nth-child(3) {
                left: 50%;
            }
            &:nth-child(4) {
                left: 75%;
            }
            &:nth-child(5) {
                left: 100%;
            }
        }
        li span {
            position: absolute;
            top: 6px;
            left: 6px;
            display: inline-block;
            width: 8px;
            height: 8px;
            [data-theme="0"] & {
                background: rgba(255,255,255,1);
                border: 2px solid rgba(212,222,231,1);
            }
            [data-theme="1"] & {
                background: $black-color-2;
                border: 2px solid $black-color-4;
            }
            border-radius: 8px;
            box-sizing: border-box;
            &.active {
                border: none;
            }
        }
    }
}
.dex-order {
    &.buy {
        .line {
            background: $green;
            .drag {
                &::before {
                    background: $green;
                }
                .percent {
                    background: $green;
                    &::before {
                        border-top: 6px solid $green-color;
                    }
                }
            }
        }
        .list li span.active {
            background: $green;
        }
    }
    &.sell {
        .line {
            background: $red;
            .drag {
                &::before {
                    background: $red;
                }
                .percent {
                    background: $red;
                    &::before {
                        border-top: 6px solid #e22b74;
                    }
                }
            }
        }
        .list li span.active {
            background: $red;
        }
    }
}

.process-wrapper {
    width: 100%;
    .line-wrapper {
        position: relative;
        height: 6px;
        border-radius: 4px;
        background: rgba(229,235,241,1);
    }
    .line {
        position: absolute;
        top: 0;
        left: 0;
        background: #007aff;
        height: 100%;
        border-radius: 4px;
        &.smooth {
            transition: all 0.3s linear;
        }
        .drag {
            display: inline-block;
            position: absolute;
            top: -9px;
            right: -9px;
            width: 12px;
            height: 12px;
            border-radius: 12px;
            box-shadow: 0 2px 10px 1px rgba(176, 192, 237, 0.42);
            background: rgba(0, 122, 255, 1);
            border: 6px solid rgba(255, 255, 255, 1);
            .percent {
                display: none;
            }
        }
    }
    .list {
        display: none;
    }
}
</style>
