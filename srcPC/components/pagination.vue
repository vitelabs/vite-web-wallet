<template>
    <div v-show="pageList.length">
        <div class="pagination-wrapper __pointer">
            <span class="box prev" :class="{
                'unuse': currentPage <= 1
            }" @click="_toPage(currentPage - 1)"> </span>

            <span v-for="(pageNumber, i) in pageList" :key="i"
                  @click="_toPage(pageNumber)"
                  class="box" :class="{
                      'active': pageNumber === currentPage,
                      'ellipsis': pageNumber === '...'
            }">{{ pageNumber }}</span>

            <span class="box next" :class="{
                'unuse': currentPage >= totalPage
            }"  @click="_toPage(currentPage + 1)"> </span>
        </div>
    </div>
</template>

<script>
const ellipsis = '...';
const maxPageNumber = 7;

export default {
    props: {
        currentPage: {
            type: Number,
            default: 1
        },
        totalPage: { default: 0 },
        toPage: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        pageList() {
            if (!this.totalPage || !this.currentPage) {
                return [];
            }

            const min = 2;
            const max = this.totalPage - 1;
            const listNum = maxPageNumber - 3;

            const list = [1];
            let minNumber = this.currentPage - listNum / 2;
            let maxNumber = this.currentPage + listNum / 2 + (listNum % 2 ? 1 : 0);

            minNumber = minNumber < min ? min : minNumber;
            maxNumber = maxNumber > max ? max : maxNumber;

            if (maxNumber - minNumber !== listNum) {
                const tempMax = minNumber + listNum;
                maxNumber = tempMax > max ? max : tempMax;
            }
            if (maxNumber - minNumber !== listNum) {
                const tempMin = maxNumber - listNum;
                minNumber = tempMin < min ? min : tempMin;
            }

            minNumber > 2 && list.push(ellipsis);
            for (let i = minNumber; i <= maxNumber; i++) {
                list.push(i);
            }
            maxNumber < this.totalPage - 1 && list.push(ellipsis);
            this.totalPage !== 1 && list.push(this.totalPage);

            return list;
        }
    },
    methods: {
        _toPage(pageNumber) {
            if (!pageNumber || pageNumber === ellipsis
                || pageNumber < 1 || pageNumber > this.totalPage) {
                return;
            }
            this.toPage(pageNumber);
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
.pagination-wrapper {
    display: inline-block;
    align-items: center;
}

.box {
    text-align: center;
    box-sizing: border-box;
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 2px;
    line-height: 30px;
    font-size: 12px;
    color: #333;
    margin-left: 6px;
    [data-theme="0"] & {
        border: 1px solid rgba(198,203,212,1);
    }
    [data-theme="1"] & {
        border: 1px solid $black-color-4;
    }

    &:first-child {
        margin-left: 0;
    }

    &.unuse {
        color: #999;
    }

    &.active {
        @include primary_bg_color();
        [data-theme="0"] & {
            // background: $blue-color-1;
            border: none;
        }
        // color: $white-color;
        @include primary_font_color();
        top: -1px;
        position: relative;
    }

    &.ellipsis {
        border: none;
        cursor: default;
    }
}

.prev,
.next {
    position: relative;
    top: 10px;
}

.prev {
    background: url("@assets/imgs/left.svg");
    background-size: 100% 100%;
}

.next {
    background: url("@assets/imgs/right.svg");
    background-size: 100% 100%;
}
</style>
