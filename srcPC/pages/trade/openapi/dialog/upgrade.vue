<template lang="pug">
extends /components/dialog/base.pug
block content
    .__row
        .__row_t {{ $t('trade.openapi.upgradeConfirm.currentPackage') }}
        div
            package-info(:data="currentPackage")
    .__row
        .__row_t {{ $t('trade.openapi.upgradeConfirm.selectPackage') }}
        .package-list
            package-info(
                v-for="item, index in packageList" :key="index" :data="item"
                @click="setPackage(item)"
                class="package-item"
                :active="item.type === (selectPackage && selectPackage.type)"
            )
    .__row
        .__row_t {{ $t('trade.openapi.upgradeConfirm.selectTime') }}
        .__input_row
            select(v-model="selectTime")
                option(:value="index + 1" v-for="item, index in new Array(12)" :key="index") {{ (index + 1)  + $t('trade.openapi.upgradeConfirm.month') }}
    .__row.key-confirm-tips(v-if="selectPackage")
        .__row_t {{ $t('trade.openapi.upgradeConfirm.payAmount') }}
        .__input_row {{ payAmount }}

</template>

<script>
import { execWithValid } from 'pcUtils/execWithValid';
import sendTx from 'pcUtils/sendTx';
import { constant } from '@vite/vitejs';
import { upgradePackage } from 'pcServices/tradeOperation';
import { doUntill } from 'utils/asyncFlow';
import bigNumber from 'utils/bigNumber';

import tips from 'pcComponents/tips.vue';
import packageInfo from '../packageInfo';

export default {
    components: { tips, packageInfo },
    props: {
        currentPackage: { type: Object, default: () => {} },
        packageList: { type: Array, default: () => [] },
        agentAddress: { type: String, default: null }
    },
    data() {
        return {
            dWidth: 'wide',
            dSTxt: this.$t('trade.proxy.dialog.confirm.ok'),
            selectTime: 1,
            selectPackage: null,
            loading: false
        };
    },
    computed: {
        dTitle() {
            return this.$t('trade.openapi.upgradeConfirm.title');
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        dBtnUnuse() {
            return this.loading && this.selectPackage;
        },
        payAmount() {
            if (this.selectPackage) {
                return this.selectPackage.amount * this.selectTime;
            }
            return 0;
        }
    },
    methods: {
        inspector() {
            return new Promise((resolve, reject) => {
                this._sendTx(resolve, reject);
            });
        },
        setPackage(item) {
            this.selectPackage = item;
        },
        _sendTx: execWithValid(function (resolve, reject) {
            this.loading = true;
            sendTx({
                methodName: 'send',
                data: {
                    toAddress: this.agentAddress,
                    tokenId: constant.Vite_TokenId,
                    amount: bigNumber.toMin(this.payAmount, constant.Vite_Token_Info.decimals)
                },
                config: {
                    pow: true,
                    powConfig: {
                        isShowCancel: true,
                        cancel: () => {
                            reject();
                        }
                    }
                }
            }).then(_accountBlock => {
                this.$toast(this.$t('hint.transSucc'));
                return doUntill({
                    createPromise: () => upgradePackage({
                        address: this.address,
                        agentAddress: this.agentAddress,
                        type: this.selectPackage.type,
                        packageTime: this.selectTime,
                        sendHash: _accountBlock.hash
                    }).then(() => true),
                    interval: 1000,
                    times: 15,
                    test: result => {
                        if (result.resolve) {
                            resolve();
                            this.loading = false;
                            return true;
                        }
                        if (result.reject && result.reject.code === 2003) {
                            resolve();
                        }
                        if (result.times === 15) {
                            reject();
                        }
                        return false;
                    }
                });
            })
                .catch(err => {
                    console.warn(err);
                    this.loading = false;
                    reject(err);
                });
        })
    }
};
</script>

<style lang="scss" scoped>
@import "pcComponents/confirm/confirmRow.scss";
@import "../../trust/dialog/confirm.scss";

.__row {
    .__input_row {
        @include gray_font_color_1();
        select {
            height: 100%;
            border: none;
            background: none;
        }
    }
    .package-list {
        display: flex;
        flex-direction: row;
        .package-item {
            margin-right: 10px;
        }
    }
}

.key-confirm-tips {
    font-size: 13px;
    @include gray_font_color_1();
    ul {
        li {
            padding: 5px 0;
            list-style: disc inside;
        }
    }
}
</style>
