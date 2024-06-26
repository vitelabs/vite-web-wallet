<template lang="pug">
extends ../../../src/components/dialog/base.pug
block head
    .head {{ !(isConnected) ? $t('assets.ledger.connect.selectConnectType') : $t('assets.ledger.connect.tips')}}
block content
    div.__row(v-if="isConnected")
        table.hw_table(v-if="addressList && addressList.length")
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
                        a(:href="getUrl(address.address)" target="_blank") {{address.address | shortAddr}}
                        span.code_small_btn(v-if="!address.blockCount && address.blockCount !== undefined ") {{ $t('assets.ledger.addressSelect.unUsedAccount') }}

                    th {{address.balance | toBasic(18)}}
                    th {{address.unreceived | toBasic(18)}}
        div(class="loading_wrapper" v-else)
            loading(class="loading" class="ex-center-loading" loadingType="dot")
        div.hw_btn_wrapper(v-if="addressList && addressList.length")
            span.code_small_btn(@click="getAddressList('pre')" v-show="(this.startIndex - this.addrNum) > 0") {{ $t('assets.ledger.addressSelect.prePage') }}
            span.code_small_btn(@click="getAddressList('next')") {{ $t('assets.ledger.addressSelect.nextPage') }}

        div.__row.btn_wrapper(v-if="addressList && addressList.length")
            div.btn.btn-blue.__pointer(@click="confirm()" :class="{'btn-gray': isBtnUnuse}") {{ $t('assets.ledger.addressSelect.confirm') }}
    div.__row(v-else)
        div.ledger_introduction
            span.ledger_introduction__header {{$t('assets.ledger.connect.introduction.1.title')}}
            span.ledger_introduction__content {{$t('assets.ledger.connect.introduction.1.content')}}
        lottie(type="plugAndPinCode" class="ledger_lottie")
        div.ledger_introduction
            span.ledger_introduction__header {{$t('assets.ledger.connect.introduction.2.title')}}
            span.ledger_introduction__content {{$t('assets.ledger.connect.introduction.2.content')}}
        lottie(type="openApp" class="ledger_lottie")
        div.__row.ledger_connect_btn
            div.btn.btn-blue.__pointer(@click="connect('usb')")
                loading(loadingType="dot" v-show="connectPending")
                span(v-show="!connectPending") {{ $t("assets.ledger.connectWithUSB") }}
            div.btn.btn-blue.__pointer(@click="connect('blu')")
                span(v-show="!connectPending") {{ $t("assets.ledger.connectWithBlu") }}
                loading(loadingType="dot" v-show="connectPending")
</template>

<script>
import Vue from 'vue';

// import { initVB } from '@pc/wallet/vb';
import { getLedgerInstance, initLedger } from '@pc/wallet/ledgerHW';
// import { getCurrHDAcc } from '@pc/wallet';
// import icon from '@assets/imgs/start_qrcode_icon.svg';
import Checkbox from '@uiKit/checkbox.vue';
import { viteClient } from '@services/apiServer';
import { VITE_TOKENID } from '@utils/constant';
import loading from '@components/loading.vue';
import Lottie from '@pc/components/animation/lottie.vue';
import { getAccountLink } from '@utils/getLink';

export default {
    components: { Checkbox, loading, Lottie },
    data() {
        const ledgerInstance = getLedgerInstance();
        return {
            addressList: [],
            selected: null,
            isConnected: ledgerInstance && ledgerInstance.status && ledgerInstance.connector,
            addrNum: 5,
            connectPending: false
        };
    },
    beforeMount() {
        this.getAddressList();
        this.isConnected = getLedgerInstance() && getLedgerInstance().status && getLedgerInstance().connector;
        this.width = 'wide';
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
            const hw = getLedgerInstance();
            if (!hw || !hw.connector) return;
            let startIndex = this.startIndex;
            if (type === 'pre') startIndex = this.startIndex - this.addrNum * 2;
            const addressList = await hw.getAddressList(startIndex, this.addrNum);
            console.log(addressList);
            this.addressList = addressList;
            this.getBalanceInfo();
        },
        getBalanceInfo() {
            this.addressList.forEach(({ address }) => {
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
        getUrl(address) {
            return `${ getAccountLink(this.$i18n.locale, address) }`;
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
            getLedgerInstance().emit('connected', {
                address: this.selected.address,
                activeIdx: this.selected.index,
                publicKey: this.selected.publicKey
            });
            this.rClick();
        },
        connect(connectType) {
            if (this.connectPending) return;
            this.connectPending = true;
            initLedger({ connectType })
                .then(() => this.getAddressList())
                .then(() => {
                    this.isConnected = true;
                    console.log('Ledger connected !!!!!!!!!!!!!!!!');
                })
                .catch(err => {
                    console.log(err);

                    this.isConnected = false;
                    if (err) {
                        getLedgerInstance().emit('error', err);
                    }
                })
                .finally(() => {
                    this.connectPending = false;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
@use "../../pages/start/start.scss" as *;
@use "@pc/assets/scss/table.scss" as *;

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

.loading_wrapper {
    height: 120px;
    position: relative;
}

.ledger_introduction {
    .ledger_introduction__header {
        @include font-family-bold();
    }
    .ledger_introduction__content {
        @include font-family-normal();
    }
}

.ledger_lottie {
    height: 180px;
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
                // color: #00BEFF;
                @include primary_color();
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
        // color: #00BEFF;
        @include primary_color();
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
        // background: $blue-color-1;
        @include primary_bg_color();
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
        // background: $blue-color-1;
        @include primary_bg_color();
        box-sizing: border-box;
        text-align: center;
    }
}
</style>

