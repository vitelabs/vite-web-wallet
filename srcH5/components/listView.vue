<template>
    <div ref="listWrapper" class="list-view-wrapper" @scroll="onScroll">
        <div ref="list">
            <slot name="header"></slot>
            <slot name="content"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
let reachTopTimeout = null;

export default {
    props: {
        reachEnd: {
            type: Function,
            default: () => {}
        },
        reachTop: {
            type: Function,
            default: () => {}
        },
        scrollHandle: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return { scrollTop: 0 };
    },
    methods: {
        onScroll() {
            const listWrapperDom = this.$refs.listWrapper;
            const listDom = this.$refs.list;
            if (!listWrapperDom || !listDom) {
                return;
            }

            const listWrapperHeight = listWrapperDom.getBoundingClientRect().height;
            const listHeight = Math.floor(listDom.getBoundingClientRect().height);
            const scrollTop = listWrapperDom.scrollTop;
            const scrollBottom = listHeight - scrollTop;
            const directionDown = !!(scrollTop >= this.scrollTop);

            // Scroll trigger event
            this.scrollHandle(scrollTop, scrollBottom);

            // Reach the bottom: the direction is sliding down and reaching the threshold
            if (directionDown && listWrapperHeight + scrollTop >= listHeight) {
                this.reachEnd(scrollTop, scrollBottom);
                // Ensure that reachEnd and reachTop are in one scroll, only one is triggered
                return;
            }

            // Reach the top: the direction is swiping up and reaching the threshold
            if (!directionDown && scrollTop <= 20) {
                this._reachTop(scrollTop, scrollBottom);
            }

            this.scrollTop = scrollTop;
        },
        _reachTop(scrollTop, scrollBottom) {
            // Avoid repeatedly triggering reachTop
            window.clearTimeout(reachTopTimeout);
            reachTopTimeout = setTimeout(() => {
                this.reachTop(scrollTop, scrollBottom);
            }, 200);
        },
        goTop() {
            this.$refs.listWrapper.scrollTop = 0;
        }
    }
};
</script>

<style type="text/scss" lang="scss">
.list-view-wrapper {
    overflow: auto;
}
</style>
