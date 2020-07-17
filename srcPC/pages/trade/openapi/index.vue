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
                        {{(apiInfo.agentPledgeAmount || 0) | formatNum(18, 0)}} VITE
                        <span class="__small_btn" @click="_goStaking">{{$t('trade.openapi.staking')}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="__form_input_title">{{$t('trade.openapi.package')}}</div>
                    <div class="__form__input_content package" v-if="packageInfo">
                        <package-info :data="packageInfo" :upgrade="true">
                            <span v-if="canUpgrade" class="__small_btn" @click="_goUpgrade">{{$t('trade.openapi.upgrade')}}</span>
                        </package-info>
                    </div>
                </div>
                <div v-if="apiInfo.expireTime" class="row">
                    <div class="__form_input_title"> {{$t('trade.openapi.expireTime')}} </div>
                    <div class="__form__input_content permissions"> {{apiInfo.expireTime | date(this.$i18n.locale)}} </div>
                </div>
                <div class="row">
                    <div @click="_deleteApiKey" :class="{unuse: pending}" class="create-open-api __form_btn __pointer">{{ $t('trade.openapi.deleteKey') }}</div>
                </div>
            </div>
            <div v-else class="item">
                <div class="row" v-if="balanceNotEnough">
                    <tips type="warn">{{ $t('trade.openapi.balanceAlert', {balanceLimit: this.balanceLimit}) }}</tips>
                </div>
                <div class="row" v-else>
                    <div @click="_createApiKey" :class="{ unuse: pending}" class="create-open-api __form_btn __pointer">{{ $t('trade.openapi.createKey') }}</div>
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
                            <li v-for="(_item, index) in [1,2,3,4]" :key="index" v-html="$t(`trade.openapi.tips.0-step${_item}`)"></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteKey, getProxyGrantor, getAgentAddress, createOpenApiKey, getPackageList } from 'pcServices/tradeOperation';
import { doUntill } from 'utils/asyncFlow';
import { execWithValid } from 'pcUtils/execWithValid';
import openUrl from 'utils/openUrl';
import secTitle from 'pcComponents/secTitle';
import walletTable from 'pcComponents/table/index.vue';
import tips from 'pcComponents/tips.vue';

import { keyConfirmDialog, stakingDialog, upgradeDialog } from './dialog';
import { baseDialog } from 'pcComponents/dialog';
import PackageInfo from './packageInfo';
import { addDialog } from '../trust/dialog';
import PairItem from '../trust/dialog/pairItem';


export default {
    components: { PairItem, secTitle, walletTable, tips, PackageInfo },
    beforeMount() {
        if (!this.address) return;
        this.updateData();
    },
    data() {
        return {
            agentAddress: null,
            permissions: [],
            pairList: [],
            packageList: [],
            apiInfo: {
                apiKey: null,
                apiSecret: null,
                createTime: null,
                agentPledgeAmount: null,
                type: 1, // Open Api package type
                expireTime: null
            },
            balanceNotEnough: false,
            balanceLimit: null,
            pending: false
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
        },
        canUpgrade() {
            return this.packageList.find(item => this.packageInfo.type < item.type);
        },
        currentHeight() {
            return this.$store.state.ledger.currentHeight;
        },
        isHardware() {
            const currAcc = this.$store.state.wallet.currHDAcc;
            return currAcc && currAcc.isHardware;
        }
    },
    watch: {
        address() {
            this.agentAddress = null;
            this.permissions = [];
            this.pairList = [];
            this.apiInfo = {
                apiKey: null,
                apiSecret: null,
                createTime: null,
                agentPledgeAmount: null,
                type: 1 // Open Api package type
            };
            this.updateData();
        }
    },
    methods: {
        updateData() {
            return Promise.all([
                this.getAgentAddress()
                    .then(() => {
                        if (this.agentAddress) {
                            return this.getPermissions();
                        }
                    }),
                this.getPackageList()
            ]);
        },

        tryUpdateData() {
            return doUntill({
                createPromise: () => this.updateData(),
                interval: 1000,
                times: 5
            });
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
            }).then(() => this.tryUpdateData());
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
            }).catch(err => {
                if (err.code === 2001) {
                    this.balanceNotEnough = true;
                    this.balanceLimit = err.data.balanceLimit;
                }
                throw (err);
            });
        },
        _createApiKey: execWithValid(function () {
            this.createApiKey();
        }, function () {
            this.$router.push({ name: 'startLogin' });
        }),
        createApiKey() {
            if (!this.agentAddress) return;
            if (this.isHardware) {
                return this.$t('trade.openapi.noSupportForHardware');
            }
            this.pending = true;

            createOpenApiKey({
                address: this.address,
                agentAddress: this.agentAddress,
                latestSnapshotHeight: this.currentHeight
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
            })
                .finally(() => {
                    this.pending = false;
                });
        },
        _deleteApiKey() {
            this.deleteApiKey();
        },
        deleteApiKey: execWithValid(function () {
            baseDialog({
                title: this.$t('trade.openapi.deleteKey'),
                content: this.$t('trade.openapi.deleteAlert'),
                rTxt: this.$t('trade.openapi.confirmDelete'),
                lTxt: this.$t('trade.openapi.cancel')
            }).then(({ status }) => {
                if (status === 'CONFIRMED') {
                    this.pending = true;
                    deleteKey({
                        address: this.address,
                        agentAddress: this.agentAddress,
                        latestSnapshotHeight: this.currentHeight
                    }).then(() => {
                        this.tryUpdateData();
                    })
                        .catch(err => {
                            if (err.msg) {
                                return this.$toast(err.msg);
                            }
                            return this.$toast(err.message);
                        })
                        .finally(() => {
                            this.pending = false;
                        });
                }
            });
        }),
        _goStaking: execWithValid(function () {
            this.goStaking();
        }),
        goStaking() {
            stakingDialog({ agentAddress: this.agentAddress }).then(() => this.tryUpdateData());
        },
        _goUpgrade: execWithValid(function () {
            this.goUpgrade();
        }),
        goUpgrade() {
            upgradeDialog({
                currentPackage: this.packageInfo,
                packageList: this.packageList.filter(item => item.type > this.packageInfo.type),
                agentAddress: this.agentAddress
            }).then(() => this.tryUpdateData());
        },
        getPackageList() {
            getPackageList().then(list => {
                list = list || [];
                list.sort((a, b) => a.type - b.type);
                this.packageList = list;
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
            font-size: 14px;
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
            .__tips_wrapper {
                font-size: 14px;
                margin-top: 20px;
            }
            .__form_input_title {
                margin-top: 12px;
            }
            .__form__input_content {
                font-size: 14px;
                @include default_font_color();
                &.permissions {
                    display: flex;
                    flex-wrap: wrap;
                    .pair-item {
                        margin: 10px 10px 0 0;
                    }
                    margin-bottom: 15px;
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
