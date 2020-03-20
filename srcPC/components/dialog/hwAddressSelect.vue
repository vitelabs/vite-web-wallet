<template lang="pug">
extends /components/dialog/base.pug
block head
    .head {{ !(isConnected) ? $t('assets.ledger.connect.selectConnectType') : $t('assets.ledger.connect.tips')}}
block content
    div.__row(v-if="isConnected")
        table.hw_table
            thead
                tr
                    th
                    th {{ $t('assets.ledger.addressSelect.index') }}
                    th {{ $t('assets.ledger.addressSelect.address') }}
                    th {{ $t('assets.ledger.addressSelect.balance') }}
                    th {{ $t('assets.ledger.addressSelect.unreceived') }}
            tbody
                tr(v-for="address in addressList" :key="address.index")
                    th
                        checkbox(@input="onSelect(address, $event)" v-model="address.isChecked")
                    th {{address.index}}
                    th 
                        a(:href="'https://vitescan.io/address/' + address.address" target="_blank") {{address.address | shotAddr}}
                        span.code_small_btn(v-if="!address.blockCount && address.blockCount !== undefined ") {{ $t('assets.ledger.addressSelect.unUsedAccount') }}

                    th {{address.balance | toBasic(18)}}
                    th {{address.unreceived | toBasic(18)}}
        div.hw_btn_wrapper
            span.code_small_btn(@click="getAddressList('pre')" v-show="(this.startIndex - this.addrNum) > 0") {{ $t('assets.ledger.addressSelect.prePage') }}
            span.code_small_btn(@click="getAddressList('next')") {{ $t('assets.ledger.addressSelect.nextPage') }}

        div.__row.btn_wrapper
            div.btn.btn-blue.__pointer(@click="confirm" :class="{'btn-gray': isBtnUnuse}") {{ $t('assets.ledger.addressSelect.confirm') }}
    div.__row(v-else)
        div.__row.ledger_connect_btn
            div.btn.btn-blue.__pointer(@click="connect('usb')") {{ $t("assets.ledger.connectWithUSB") }}
            div.btn.btn-blue.__pointer(@click="connect('blu')") {{ $t("assets.ledger.connectWithBlu") }}
</template>

<script>
import { initVB } from 'wallet/vb';
import { getLedgerInstance, initLedger } from 'wallet/ledgerHW';
import { getCurrHDAcc } from 'wallet';
import icon from 'assets/imgs/start_qrcode_icon.svg';
import Checkbox from 'uiKit/checkbox';
import { viteClient } from 'services/apiServer';
import { VITE_TOKENID } from 'utils/constant';
import Vue from 'vue';

export default {
    components: { Checkbox },
    data() {
        const ledgerInstance = getLedgerInstance();
        return {
            addressList: [],
            selected: null,
            isConnected: ledgerInstance && ledgerInstance.status,
            addrNum: 4
        };
    },
    beforeMount() {
        this.getAddressList();
        this.isConnected = getLedgerInstance() && getLedgerInstance().status;
    },
    computed: {
        isBtnUnuse() {
            return !this.addressList.filter(item => item.isChecked).length;
        },
        startIndex() {
            if (!this.addressList || this.addressList.length === 0) return 0;
            return this.addressList[this.addressList.length - 1].index + 1;
        }
    },
    methods: {
        async getAddressList(type = 'next') {
            if (!getLedgerInstance()) return;
            let startIndex = this.startIndex;
            if (type === 'pre') startIndex = this.startIndex - this.addrNum * 2;
            const addressList = await getLedgerInstance().getAddressList(startIndex, 4);
            addressList.forEach(({ address }) => {
                viteClient.getBalanceInfo(address).then(({ balance, unreceived }) => {
                    let _balance = 0;
                    let _unreceived = 0;
                    let _blockCount = 0;
                    if (balance && balance.balanceInfoMap) {
                        _balance = balance.balanceInfoMap[VITE_TOKENID].balance;
                        _blockCount = balance.blockCount;
                    }
                    if (unreceived && unreceived.balanceInfoMap) {
                        _unreceived = unreceived.balanceInfoMap[VITE_TOKENID].balance;
                    }
                    this.updateAddressBalance(address, _balance, _unreceived, _blockCount);
                });
            });
            this.addressList = addressList;
        },
        updateAddressBalance(address, balance, unreceived, blockCount) {
            if (!this.addressList) return;
            for (let i = 0; i < this.addressList.length; i++) {
                if (this.addressList[i].address === address) {
                    Vue.set(this.addressList[i], 'balance', balance);
                    Vue.set(this.addressList[i], 'unreceived', unreceived);
                    Vue.set(this.addressList[i], 'blockCount', blockCount);
                }
            }
        },
        onSelect(address, isChecked) {
            this.selected = address;
            this.addressList = this.addressList.map(item => {
                return {
                    ...item,
                    isChecked: item.index === address.index ? isChecked : false
                };
            });
        },
        confirm() {
            if (this.isBtnUnuse) return;

            // this.getLedgerInstance().onConnect(null, {
            //     address: this.selected.address,
            //     addressIndex: this.selected.index
            // });

            // ledgerMock
            getLedgerInstance().emit('connected', {
                address: this.selected.address,
                addressIndex: this.selected.index,
                publicKey: this.selected.publicKey
            });
            this.rClick();
        },
        connect(connectType) {
            initLedger({ connectType })
                .then(appConfig => {
                    this.getAddressList().then(() => {
                        this.isConnected = true;
                        console.log('Ledger conneected !!!!!!!!!!!!!!!!');
                    });
                })
                .catch(err => {
                    console.log(err);

                    this.isConnected = false;
                    if (err) {
                        if (err.statusCode === 28160) return this.$toast(this.$t('assets.ledger.connect.connectError'));
                        if (err.name === 'TransportOpenUserCancelled') return this.$toast(this.$t('assets.ledger.connect.cancelSelect'))
                        if (err.message) this.$toast(err.message);
                    }
                });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "pcPages/start/start.scss";
@import "pcAssets/scss/table.scss";

.head {
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    font-size: 14px;
    font-family: $font-bold;
    @include font_color_to_white(#333);
}
.code_container {
    margin: 0 auto;
    justify-content: center;
}

.hw_table {
    margin-bottom: 15px;
    width: 100%;
    @include common_border();
    border-collapse: collapse;
    border-spacing: 0;
    th {
        padding: 4px 8px;
        margin: 0;
        white-space: nowrap;
        border: 0;
    }
    thead {
        @include bg_color_1();
        @include common_font_color();
        tr {
            padding: 5px 5px;
            @include common_border_one('bottom');
        }
    }
    tbody {
        @include gray_font_color_1();
        tr {
            @include common_border_one('bottom');
            a {
                @include gray_font_color_1();
            }
            .code_small_btn {
                font-size: 12px;
                word-break: keep-all;
                background: rgba(0,122,255,0.05);
                border-radius: 2px;
                border: 1px solid rgba(0,122,255,0.3);
                line-height: 15px;
                color: #007AFF;
                padding: 0 3px;
                margin-left: 5px;
            }
            &:hover {
                @include hover_color();
            }
            &:nth-child(2n) {
                @include hover_color();
            }
            th {
                &:first-child {
                    text-align: center;
                }
            }
        }
    }
}

.hw_btn_wrapper {
    text-align: right;
    .code_small_btn {
        word-break: keep-all;
        background: rgba(0,122,255,0.05);
        border-radius: 2px;
        border: 1px solid rgba(0,122,255,0.3);
        line-height: 15px;
        cursor: pointer;
        color: #007AFF;
        padding: 0 7px;
        &:last-child {
            margin-left: 10px;
        }
    }
}

.__row.btn_wrapper {
    margin-top: 15px;
    .btn {
        float: right;
        text-align: right;
        width: 120px;
        white-space: nowrap;
        @include font-family-bold();
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: white;
        background: $blue-color-1;
        box-sizing: border-box;
        text-align: center;
        &.btn-gray {
            @include gray_btn_color();
        }
    }
}
.ledger_connect_btn {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .btn {
        width: 250px;
        white-space: nowrap;
        @include font-family-bold();
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: white;
        background: $blue-color-1;
        box-sizing: border-box;
        text-align: center;
    }
}
</style>

