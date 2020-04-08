<template>
    <div class="proxy openapi">
        <sec-title :isShowHelp="false" :title="$t('trade.openapi.title')"></sec-title>
        <div class="__form_border">
            <div class="item">
                <div class="row">
                    <div class="__form_input_title">
                        {{$t('trade.openapi.permissions')}}
                    </div>
                    <div>
                        <span class="permissionsContent"> {{$t('trade.openapi.permissionsContent')}} </span>
                    </div>
                </div>
                <div class="row">
                    <div @click="createApiKey" class="create-open-api __form_btn __pointer">{{ $t('trade.openapi.createKey') }}</div>
                </div>
            </div>
            <div class="item right tips-wrapper">
                <div class="row">
                    <div class="__form_input_title">
                        {{$t('trade.openapi.tips.title')}}
                    </div>
                    <div v-for="(item, index) in [0,1,2,3]" :key="index">
                        {{$t(`trade.openapi.tips.${index}`)}}
                        <ul v-if="index === 0">
                            <li v-for="(_item, index) in [1,2,3]" :key="index">{{$t(`trade.openapi.tips.0-step${_item}`)}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getProxyRelation, getProxyGrantor, getAgentAddress, createOpenApiKey } from 'pcServices/tradeOperation';
import { addDialog, keyConfirmDialog } from './dialog';
import PairItem from './dialog/pairItem';
import { doUntill } from 'utils/asyncFlow';
import { execWithValid } from 'pcUtils/execWithValid';
import openUrl from 'utils/openUrl';
import secTitle from 'pcComponents/secTitle';
import walletTable from 'pcComponents/table/index.vue';
import tips from 'pcComponents/tips.vue';


export default {
    components: { PairItem, secTitle, walletTable, tips },
    beforeMount() {
        this.updateData();
        this.getAgentAddress();
    },
    data() {
        return {
            relation: {},
            grantor: {},
            agentAddress: null,
            apiInfo: {}
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
            openUrl('https://github.com/vitelabs/vite-wiki/blob/mainnet/docs/zh/dex/api/proxy.md');
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
        },
        async getAgentAddress() {
            if (!this.address) return;
            const result = await getAgentAddress({ address: this.address });
            this.agentAddress = result.agentAddress;
            console.log(result);
        },
        _createApiKey: execWithValid(function () {
            this.createApiKey();
        }),
        async createApiKey() {
            // if (!this.agentAddress) return;
            createOpenApiKey({
                address: this.address,
                agentAddress: this.agentAddress
            }).then(apiInfo => {
                this.apiInfo = apiInfo;
                console.log(apiInfo);
                keyConfirmDialog({
                    accessKey: apiInfo.apiKey,
                    secretKey: apiInfo.apiSecret,
                    agentAddress: apiInfo.agentAddress
                });
            }).catch(err => {
                console.log(err);
                this.$toast(err.message);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~pcAssets/scss/common.scss";
@import "~assets/scss/vars.scss";
@import "../../wallet/form.scss";

@include secondTitle();
@include tradeBtn();

.__second-title {
    margin: 14px 0;
}

.openapi {
    width: 100%;
    .item {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        width: 50%;
        padding: 6px 25px 20px 30px;
        &.right {
            float: right;
        }

        &.tips-wrapper {
            font-size: 14px;
            line-height: 25px;
            @include common_font_color();
            ul {
                margin: 8px 0;
            }
        }

        .row {
            position: relative;
            .__form_input_title {
                margin-top: 12px;
            }
            .permissionsContent {
                font-size: 14px;
            }
            .create-open-api {
                float: left;
                padding-left: 12px;
                padding-right: 12px;
                margin-top: 20px;
            }
            .half {
                width: 45%;
                display: inline-block;
                &:last-child {
                    margin-left: 28px;
                }
            }
        }
    }
}

.proxy {
    display: flex;
    flex-direction: column;
    height: 100%;
}
</style>
