<template>
    <div class="proxy">
        <div class="op item">
            <div class="title">{{ $t("trade.proxy.title") }}</div>
            <div class="btn_group">
                <div
                    class="btn btn__ok __pointer"
                    @click="addProxy({ actionType: 'new' })"
                >
                    {{ $t("trade.proxy.new") }}
                </div>
                <div class="btn btn__cancel __pointer">
                    {{ $t("trade.proxy.info") }}
                </div>
            </div>
        </div>
        <div class="active item">
            <div class="title">{{ $t("trade.proxy.active.title") }}</div>
            <div class="proxytb">
                <div class="proxytb_row head">
                    <div class="proxytb_cell">
                        {{ $t("trade.proxy.active.head.0") }}
                    </div>
                    <div class="proxytb_cell">
                        {{ $t("trade.proxy.active.head.1") }}
                    </div>
                    <div class="proxytb_cell">
                        {{ $t("trade.proxy.active.head.2") }}
                    </div>
                </div>
                <div
                    class="proxytb_content"
                    v-if="Object.keys(relation).length > 0"
                >
                    <div
                        class="proxytb_row"
                        v-for="addr in Object.keys(relation)"
                        :key="addr"
                    >
                        <div class="proxytb_cell">
                            {{ addr }}
                        </div>
                        <div class="proxytb_cell pair">
                            <span
                                v-for="t in transUtil(relation[addr])"
                                :key="t"
                                class="pure-pair"
                            >{{ t }}</span
                            >
                        </div>
                        <div class="proxytb_cell operation">
                            <div
                                class="click-able"
                                @click="
                                    addProxy({
                                        trustAddress: addr,
                                        existsPair: relation[addr],
                                        actionType: 'add'
                                    })
                                "
                            >
                                {{ $t("trade.proxy.active.operate.0") }}
                            </div>
                            <div
                                class="click-able"
                                @click="
                                    addProxy({
                                        trustAddress: addr,
                                        existsPair: relation[addr],
                                        actionType: 'delete'
                                    })
                                "
                            >
                                {{ $t("trade.proxy.active.operate.1") }}
                            </div>
                            <div
                                class="click-able"
                                @click="
                                    addProxy({
                                        trustAddress: addr,
                                        existsPair: relation[addr],
                                        actionType: 'deleteAll'
                                    })
                                "
                            >
                                {{ $t("trade.proxy.active.operate.2") }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="proxytb_content" v-else>
                    <div class="proxytb_no_data"></div>
                </div>
            </div>
        </div>
        <div class="passive item">
            <div class="title">{{ $t("trade.proxy.passive.title") }}</div>
            <div class="proxytb">
                <div class="proxytb_row head">
                    <div class="proxytb_cell">
                        {{ $t("trade.proxy.passive.head.0") }}
                    </div>
                    <div class="proxytb_cell">
                        {{ $t("trade.proxy.passive.head.1") }}
                    </div>
                </div>
                <div
                    class="proxytb_content"
                    v-if="Object.keys(grantor).length > 0"
                >
                    <div
                        class="proxytb_row"
                        v-for="addr in Object.keys(grantor)"
                        :key="addr"
                    >
                        <div class="proxytb_cell">{{ addr }}</div>
                        <div class="proxytb_cell">
                            <span
                                v-for="t in transUtil(grantor[addr])"
                                :key="t"
                                class="pure-pair"
                            >{{ t }}</span
                            >
                        </div>
                    </div>
                </div>
                <div class="proxytb_content" v-else>
                    <div class="proxytb_no_data"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getProxyRelation, getProxyGrantor } from 'pcServices/tradeOperation';
import { addDialog } from './dialog';
import PairItem from './dialog/pairItem';
import { doUntill } from 'utils/asyncFlow';
export default {
    components: { PairItem },
    data() {
        return { relation: {}, grantor: {} };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    beforeMount() {
        this.updateData();
    },
    methods: {
        updateData() {
            getProxyRelation({ address: this.address }).then(data => {
                this.relation = data.relations;
            });
            getProxyGrantor({ address: this.address }).then(data => {
                this.grantor = data.relations;
            });
        },
        addProxy({ trustAddress, existsPair, actionType } = {}) {
            if (existsPair) {
                existsPair = existsPair.map(p =>
                    Object.assign(p, {
                        name: p.symbol.replace('_', '/'),
                        id: `${ p.tradeToken }/${ p.quoteToken }`
                    }));
            }
            addDialog({
                trustAddress,
                existsPair: existsPair && existsPair.slice(0),
                actionType
            }).then(() => {
                doUntill(() =>
                    getProxyRelation({ address: this.address }).then(data => {
                        this.relation = data.relations;
                    }),
                undefined,
                1000,
                3);
            });
        },
        transUtil(pairs) {
            if (!pairs || pairs.length === 0) return [];
            return pairs.map(p => p.symbol.replace('_', '/'));
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
    height: 100%;
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
        flex: 1;
    }
    .passive {
        flex: 1;
    }
}
.btn {
    width: 128px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 11px;
    &__ok {
        color: #fff;
        background-color: #007aff;
    }
    &__cancel {
        background-color: #fff;
        color: #007aff;
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
    flex: 1;
    .proxytb_content {
        flex: 1;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;
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
        display: flex;
        font-size: 12px;
        margin: 0 3px;
        @include font-family-normal();
        white-space: nowrap;
        box-sizing: border-box;
        &.pair {
            flex-wrap: wrap;
        }
        .pure-pair {
            margin-right: 10px;
        }
        &.operation {
            display: flex;
            justify-content: space-between;
        }
        &:first-child {
            width: 400px;
            padding-left: 30px;
            margin-left: 0;
        }
        &:nth-child(2) {
            flex: 1;
        }
        &:last-child {
            padding-right: 30px;
            margin-right: 0;
        }
        &:nth-child(3) {
            width: 280px;
        }
    }
    .click-able {
        cursor: pointer;
        user-select: none;
        color: #007aff;
    }
}
</style>
