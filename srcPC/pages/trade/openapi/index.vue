<template>
    <div class="proxy openapi">
        <sec-title :isShowHelp="false" :title="hasKey ? $t('trade.openapi.myKey') : $t('trade.openapi.title')"></sec-title>
        <div class="__form_border">
            <div v-if="hasKey" class="item">
                <div class="row">
                    <div class="__form_input_title"> {{$t('trade.openapi.createTime')}} </div>
                    <div class="__form__input_content">{{ apiInfo.createTime | date($i18n.locale) }}</div>
                </div>
                <div class="row">
                    <div class="__form_input_title"> {{$t('trade.openapi.permissions')}} </div>
                    <div class="__form__input_content permissions">
                        <pair-item v-for="pair in permissions" :key="pair" :item="{name:pair}" ></pair-item>
                    </div>
                    <span class="click-able __small_btn" @click="_addProxy('add')">
                        {{ $t("trade.proxy.active.operate.0") }}
                    </span>
                    <span class="click-able __small_btn" @click="_addProxy('delete')">
                        {{ $t("trade.proxy.active.operate.1") }}
                    </span>
                </div>
                <div class="row">
                    <div class="__form_input_title"> {{$t('trade.openapi.keyConfirm.accessKey')}} </div>
                    <div class="__form__input_content permissions"> {{apiInfo.apiKey}} </div>
                </div>
                <div class="row">
                    <div class="__form_input_title"> {{$t('trade.openapi.keyConfirm.agentAddress')}} </div>
                    <div class="__form__input_content permissions"> {{agentAddress}} </div>
                </div>
                <div class="row">
                    <div class="__form_input_title"> {{$t('trade.openapi.agentAddressStakingAmount')}} </div>
                    <div class="__form__input_content staking-amount">
                        {{apiInfo.agentPledgeAmount | formatNum(18, 0)}} VITE
                        <span class="__small_btn" @click="goStaking">{{$t('trade.openapi.staking')}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="__form_input_title">{{$t('trade.openapi.package')}}</div>
                    <div class="__form__input_content package" v-if="packageInfo">
                        <package-info :data="packageInfo" :upgrade="true">
                            <span class="__small_btn" @click="goUpgrade">{{$t('trade.openapi.upgrade')}}</span>
                        </package-info>
                    </div>
                </div>
            </div>
            <div v-else class="item">
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
import { getProxyRelation, getProxyGrantor, getAgentAddress, createOpenApiKey, getPackageList } from 'pcServices/tradeOperation';
import { addDialog, keyConfirmDialog, stakingDialog } from './dialog';
import PairItem from './dialog/pairItem';
import PackageInfo from './package';
import { doUntill } from 'utils/asyncFlow';
import { execWithValid } from 'pcUtils/execWithValid';
import openUrl from 'utils/openUrl';
import secTitle from 'pcComponents/secTitle';
import walletTable from 'pcComponents/table/index.vue';
import tips from 'pcComponents/tips.vue';


export default {
    components: { PairItem, secTitle, walletTable, tips, PackageInfo },
    async beforeMount() {
        this.updateData();
    },
    data() {
        return {
            agentAddress: null,
            permissions: [],
            pairList: {},
            packageList: [],
            apiInfo: {
                apiKey: null,
                apiSecret: null,
                createTime: null,
                agentPledgeAmount: null,
                type: 1 // Open Api package type
            }
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        hasKey() {
            return !!this.apiInfo.apiKey;
        },
        packageInfo() {
            return this.packageList.find(item => item.type === this.apiInfo.type);
        }
    },
    watch: {
        address() {
            this.updateData();
        }
    },
    methods: {
        gotoProxyInfo() {
            openUrl('https://github.com/vitelabs/vite-wiki/blob/mainnet/docs/zh/dex/api/proxy.md');
        },
        updateData() {
            this.getAgentAddress()
                .then(() => {
                    if (this.agentAddress) {
                        return this.getPermissions();
                    }
                });
            this.getPackageList();
        },

        // Get grant permissions
        getPermissions() {
            getProxyGrantor({ address: this.agentAddress }).then(data => {
                if (data.relations[this.address]) {
                    this.permissions = this.transUtil(data.relations[this.address]);
                    this.pairList = data.relations[this.address];
                }
            });
        },
        _addProxy: execWithValid(function (actionType) {
            this.addProxy({
                trustAddress: this.agentAddress,
                existsPair: this.pairList,
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
        getAgentAddress() {
            if (!this.address) return;
            return getAgentAddress({ address: this.address }).then(result => {
                this.agentAddress = result.agentAddress;
                this.apiInfo = result;
            });
        },
        _createApiKey: execWithValid(function () {
            this.createApiKey();
        }),
        createApiKey() {
            if (!this.agentAddress) return;
            createOpenApiKey({
                address: this.address,
                agentAddress: this.agentAddress
            }).then(apiInfo => {
                this.apiInfo = apiInfo;
                if (apiInfo.apiSecret) {
                    keyConfirmDialog({
                        accessKey: apiInfo.apiKey,
                        secretKey: apiInfo.apiSecret,
                        agentAddress: apiInfo.agentAddress
                    });
                }
            }).catch(err => {
                console.log(err);
                this.$toast(err.message);
            });
        },
        goStaking() {
            stakingDialog({ agentAddress: this.agentAddress });
        },
        goUpgrade() {

        },
        getPackageList() {
            getPackageList().then(list => {
                this.packageList = list || [];
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
            .__form__input_content {
                font-size: 14px;
                &.permissions {
                    display: flex;
                    .pair-item {
                        margin-right: 10px;
                    }
                }
                &.staking-amount {
                    .__small_btn {
                        margin-left: 20px;
                    }
                }
            }
            .__small_btn {
                @include small_btn();
                margin-right: 10px;
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
