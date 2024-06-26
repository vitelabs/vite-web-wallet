<template>
    <div class="proxy">
        <sec-title :isShowHelp="false" :title="$t('trade.proxy.title')"></sec-title>

        <div class="btn_group">
            <div class="__trade-btn __pointer" @click="_addProxy({ actionType: 'new' })">
                {{ $t("trade.proxy.new") }}
            </div>
            <div class="__trade-btn __trade-btn__cancel __pointer" @click="gotoProxyInfo">
                {{ $t("trade.proxy.info") }}
            </div>
        </div>

        <div class="__second-title">{{ $t("trade.proxy.active.title") }}</div>
        <wallet-table class="proxy-table" :headList="relationHeadList" :contentList="relationList">
            <span v-for="(item, i) in relationList" :key="i"
                  :slot="`${i}operationBefore`">
                <span class="click-able" @click="_addProxy(item, 'add')">
                    {{ $t("trade.proxy.active.operate.0") }}
                </span>
                <span class="click-able" @click="_addProxy(item, 'delete')">
                    {{ $t("trade.proxy.active.operate.1") }}
                </span>
                <span class="click-able" @click="_addProxy(item, 'deleteAll')">
                    {{ $t("trade.proxy.active.operate.2") }}
                </span>
            </span>
        </wallet-table>

        <div class="__second-title">{{ $t("trade.proxy.passive.title") }}</div>
        <wallet-table class="proxy-table" :headList="grantorHeadList" :contentList="grantorList"></wallet-table>
    </div>
</template>

<script>
import { getProxyRelation, getProxyGrantor } from '@pc/services/tradeOperation';
import { addDialog } from './dialog';
import PairItem from './dialog/pairItem.vue';
import { doUntill } from '@utils/asyncFlow';
import { execWithValid } from '@pc/utils/execWithValid';
import openUrl from '@utils/openUrl';
import secTitle from '@pc/components/secTitle.vue';
import walletTable from '@pc/components/table/index.vue';

export default {
    components: { PairItem, secTitle, walletTable },
    beforeMount() {
        this.updateData();
    },
    data() {
        return {
            relation: {},
            grantor: {},
            relationHeadList: [ {
                text: this.$t('trade.proxy.active.head.0'),
                cell: 'addr'
            }, {
                text: this.$t('trade.proxy.active.head.1'),
                cell: 'pairList'
            }, {
                text: this.$t('trade.proxy.active.head.2'),
                cell: 'operation'
            } ],
            grantorHeadList: [ {
                text: this.$t('trade.proxy.active.head.0'),
                cell: 'addr'
            }, {
                text: this.$t('trade.proxy.active.head.1'),
                cell: 'pairList'
            } ]
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        relationList() {
            const list = [];
            for (const addr in this.relation) {
                const pairList = this.transUtil(this.relation[addr]);
                list.push({
                    addr,
                    pairList: pairList.join(' ')
                });
            }
            return list;
        },
        grantorList() {
            const list = [];
            for (const addr in this.grantor) {
                const pairList = this.transUtil(this.grantor[addr]);
                list.push({
                    addr,
                    pairList: pairList.join(' ')
                });
            }
            return list;
        }
    },
    watch: {
        address() {
            this.relation = {};
            this.grantor = {};
            this.updateData();
        }
    },
    methods: {
        gotoProxyInfo() {
            openUrl('https://docs.vite.org/vite-docs/dex/api/rest-api.html#private-api-authorization');
        },
        updateData() {
            return Promise.all([
                getProxyRelation({ address: this.address }).then(data => {
                    this.relation = data.relations;
                }),
                getProxyGrantor({ address: this.address }).then(data => {
                    this.grantor = data.relations;
                })
            ]);
        },
        _addProxy: execWithValid(function (item, actionType) {
            this.addProxy({
                trustAddress: item.addr,
                existsPair: this.relation[item.addr],
                actionType
            });
        }),
        addProxy({
            trustAddress,
            existsPair,
            actionType
        } = {}) {
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
            }).then(() =>
                doUntill({
                    createPromise: () => this.updateData(),
                    interval: 1000,
                    times: 3
                }));
        },
        transUtil(pairs) {
            if (!pairs || pairs.length === 0) return [];
            return pairs.map(p => p.symbol.replace('_', '/'));
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@pc/assets/scss/common.scss" as *;

@include secondTitle();
@include tradeBtn();

.__second-title {
    margin: 14px 0;
}

.proxy {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
