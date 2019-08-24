<template>
    <div class="proxy __pointer">
        <div class="op item">
            <div class="title">交易委托</div>
            <div class="btn_group">
                <div class="btn btn__ok" @click="addProxy">新建委托</div>
                <div class="btn btn__cancel">了解委托</div>
            </div>
        </div>
        <div class="active item">
            <div class="title">委托记录</div>
            <div class="proxytb">
                <div class="proxytb_row head">
                    <div class="proxytb_cell">委托地址</div>
                    <div class="proxytb_cell">委托交易对</div>
                    <div class="proxytb_cell">操作</div>
                </div>
                <div class="proxytb_content">
                    <div
                        class="proxytb_row"
                        v-for="addr in relation"
                        :key="addr"
                    ></div>
                </div>
                <div class="proxytb_content_no_data">
                    <div class="proxytb_no_data"></div>
                </div>
            </div>
        </div>
        <div class="passive item">
            <div class="title">接受委托记录</div>
            <div class="proxytb">
                <div class="proxytb_row head">
                    <div class="proxytb_cell">委托人地址</div>
                    <div class="proxytb_cell">委托交易对</div>
                </div>
                <div class="proxytb_content">
                    <div
                        class="proxytb_row"
                        v-for="addr in grantor"
                        :key="addr"
                    ></div>
                </div>
                <div class="proxytb_content_no_data">
                    <div class="proxytb_no_data"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getProxyRelation, getProxyGrantor } from 'services/tradeOperation';
export default {
    data() {
        return { relation: {}, grantor: {} };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        updateData() {
            getProxyRelation({ address: this.address }).then(data => {
                this.relation = data;
            });
            getProxyGrantor({ address: this.address }).then(data => {
                this.grantor = data;
            });
        },
        addProxy() {

        }
    }
};
</script>
<style lang="scss">
@import "~assets/scss/vars.scss";
.proxy {
    display: flex;
    flex-direction: column;
    padding-top: 13px;
    .title {
        padding: 14px 0;
        font-size: 14px;
        color: #1d2024;
        @include font-family-bold();
    }
    .item {
        display: flex;
        flex-direction: column;
    }
    .op {
        .title {
            font-size: 18px;
        }
        .btn_group {
            display: flex;
            .btn {
                box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
                border-radius: 2px;
                font-size: 12px;
            }
        }
    }
    .active {
    }
    .passive {
    }
}
.btn {
    &__ok {
    }
    &__cancel {
    }
}

.proxytb {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    min-width: 1050px;
    overflow: hidden;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);

    .proxytb_content {
        flex: 1;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .proxytb_content_no_data {
        min-height: 200px;
    }
    .proxytb_no_data {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        font-size: 12px;
        @include font-family-normal();
        font-weight: 400;
        color: rgba(94, 104, 117, 0.58);
        line-height: 16px;
        text-align: center;
        &:before {
            display: inline-block;
            margin-bottom: 16px;
            content: " ";
            width: 60px;
            height: 60px;
            background: url("~assets/imgs/dexEmpty.svg") 100% 100%;
        }
    }
    .proxytb_pagination {
        height: 75px;
        line-height: 75px;
        text-align: center;
    }
    .proxytb_row {
        display: flex;
        color: #5e6875;
        border-bottom: 1px solid rgba(227, 235, 245, 0.6);

        justify-content: space-between;
        box-sizing: border-box;
        align-items: center;
        padding: 9px 0;
        &.active:hover {
            background: rgba(88, 145, 255, 0.13);
        }
        &.head {
            flex: none;
            @include font-family-normal();
            color: rgba(94, 104, 117, 0.58);
            border-bottom: 1px solid #c6cbd4;
        }
    }

    .proxytb_cell {
        display: inline-block;
        text-align: left;
        font-size: 12px;
        margin: 0 3px;
        @include font-family-normal();
        white-space: nowrap;
        box-sizing: border-box;
        &:first-child {
            padding-left: 30px;
            margin-left: 0;
        }
        &:last-child {
            padding-right: 30px;
            margin-right: 0;
        }
    }
    .click-able {
        cursor: pointer;
        color: #007aff;
    }
}
</style>
