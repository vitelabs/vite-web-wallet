<template>
    <div ref="wrapper" @click="_setSize" class="process-wrapper __pointer">
        <div ref="line" class="line" :style="{ 'width': size + '%' }">
            <span ref="drag" @mousedown="drag" class="drag"></span>
        </div>
        <div class="speed">
            <span class="left">slow</span>
            <span class="right">fast</span>
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
        setSize: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        const size = this.default / (this.max - this.min);

        return { size: size * 100 };
    },
    methods: {
        drag(e) {
            const allWidth = this.$refs.wrapper.clientWidth;
            const eWidth = this.$refs.line.clientWidth;
            const startX = e.clientX;

            document.onmousemove = ev => {
                const distance = ev.clientX - startX;
                let curentWidth = eWidth + distance;
                curentWidth = curentWidth > 0 ? curentWidth : 0;
                curentWidth = curentWidth > allWidth ? allWidth : curentWidth;
                this.size = curentWidth / allWidth * 100;
                this.setSize && this.setSize(this.size);
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        },
        _setSize(e) {
            if (e.target === this.$refs.drag) {
                return;
            }

            const allWidth = this.$refs.wrapper.clientWidth;
            let currentWidth = e.offsetX - this.$refs.wrapper.clientLeft;

            currentWidth = currentWidth > 0 ? currentWidth : 0;
            currentWidth = currentWidth > allWidth ? allWidth : currentWidth;

            this.size = currentWidth / allWidth * 100;
            this.setSize && this.setSize(this.size);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.process-wrapper {
  position: relative;
  width: 100%;
  height: 6px;
  background: rgba(243, 246, 249, 1);
  border-radius: 4px;

  .line {
    position: absolute;
    top: 0;
    left: 0;
    background: #007aff;
    height: 100%;
    border-radius: 4px;

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
    }
  }

  .speed {
    width: 100%;
    font-size: 12px;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
    color: rgba(94, 104, 117, 1);
    line-height: 16px;
    padding-top: 16px;

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }
}
</style>

