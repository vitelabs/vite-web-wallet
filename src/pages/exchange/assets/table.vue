<template>
    <div class="ex_tb">
        <div class="head-row">
            <div v-for="(h) in $t('exchangeAssets.table.heads')"
                 :key="h">
                {{h.replace("#tokenSymbol#","vite")}}
            </div>
            <div>{{ $t('exchangeAssets.operate') }}
                <img @click="update" class="refresh" :class="{rotate:isRotate}" src="~assets/imgs/exchange/refresh.svg" />
            </div>
        </div>
        <div class="row-container">
            <div class="row" v-for="token in list" :key="token.id">
                <div>{{token.symbol}}</div>
                <div>{{Number((token.available+token.lock).toFixed(8))}}</div>
                <div>{{token.available}}</div>
                <div>{{token.lock||0}}</div>
                <div>{{token.worth}}</div>
                <div>
                    <span v-unlock-account @unlocked="recharge(token.id)"
                          class="click-able">
                        {{$t("exchangeAssets.table.rowMap.recharge")}}</span>
                    <span v-unlock-account @unlocked="withdraw(token.id)"
                          class="click-able">
                        {{$t("exchangeAssets.table.rowMap.withdraw")}}</span>
                    <span @click="detail(token.id)" class="click-able">
                        {{$t("exchangeAssets.table.rowMap.detail")}}</span>
                </div>
            </div>
            <div class="no-data" v-show="!list || !list.length">
                <div>{{ $t('hint.noData') }}</div>
            </div>
        </div>

        <confirm :title="c.title" :singleBtn="true" class="exchange"
                 :leftBtnTxt="c.btn" :leftBtnClick="confirmClick"
                 :closeIcon="true" :close="closeNumConfirm"
                 v-if="confirmShow">
            <div class="__row">
                <div class="__row-t">{{ c.lable1 }}</div>
                <div class="input un-click-able">
                    <img :src="c.icon" />
                    {{balance[c.tokenId].symbol}}
                    <div class="num">
                        {{ c.type.toLowerCase()==="recharge" ? balance[c.tokenId].balance : balance[c.tokenId].available }}
                    </div>
                </div>
            </div>
            <div class="__row">
                <div class="__row-t">{{ c.lable2 }}
                    <span class="__err __hint">{{ c.errTips }}</span>
                </div>
                <vite-input v-model="opNumber" :placeholder="c.placeholder"></vite-input>
            </div>
        </confirm>

        <alert v-show="detailConfirm" :list="detailList"
               :heads="$t('exchangeAssets.confirmTable.heads')"
               :title="$t('exchangeAssets.confirmTable.title')"
               :close="close"></alert>
    </div>
</template>

<script>
import alert from '../components/alert.vue';
import BigNumber from 'utils/bigNumber';
import getTokenIcon from 'utils/getTokenIcon';
import viteInput from 'components/viteInput';
import confirm from 'components/confirm.vue';
import sendTx from 'utils/sendTx';

import debounce from 'lodash/debounce';
import d from 'dayjs';

import { deposit, withdraw, chargeDetail } from 'services/exchange';

const VoteDifficulty = '201564160';

export default {
    components: { confirm, alert, viteInput },
    props: { filter: { type: Object } },
    beforeMount() {
        this.acc = this.$wallet.getActiveAccount();
        if (!this.acc) {
            return;
        }
        this.acc && (this.addr = this.acc.getDefaultAddr());
    },
    data() {
        return {
            detailConifrm: false,
            c: {},
            opNumber: '',
            confirmShow: false,
            detailData: [],
            detailConfirm: false,
            acc: null,
            addr: '',
            isRotate: false
        };
    },
    computed: {
        detailList() {
            return Object.keys(this.detailData).map(k => {
                const o = this.detailData[k];

                return [
                    d.unix(o.optime).format('YYYY-MM-DD HH:mm'),
                    o.tokenName,
                    this.$t('exchangeAssets.table.rowMap.sideMap')[o.optype],
                    o.amount
                ];
            });
        },
        balance() {
            const exB = this.$store.getters.exBalanceList;
            const walletB = this.$store.getters.tokenBalanceList;

            const res = {};
            Object.keys(exB).forEach(t => {
                res[t] = {
                    available: Number(exB[t].available),
                    lock: Number(exB[t].lock),
                    balance: 0,
                    icon: '',
                    id: t,
                    symbol: exB[t].tokenInfo.tokenSymbol,
                    decimals: exB[t].tokenInfo.decimals
                };
            });
            Object.keys(walletB).forEach(t => {
                if (res[t]) {
                    res[t].icon = walletB[t].icon;
                    res[t].balance = Number(walletB[t].balance);
                    return;
                }

                res[t] = {
                    available: 0,
                    lock: 0,
                    balance: Number(walletB[t].balance),
                    icon: walletB[t].icon,
                    id: t,
                    symbol: walletB[t].symbol,
                    decimals: walletB[t].decimals
                };
            });
            Object.keys(res).forEach(t => {
                res[t].icon = res[t].icon || getTokenIcon(res[t].id);
                if (!this.$store.state.exchangeRate.rateMap[t]) {
                    res[t].worth = '-';
                    return;
                }

                res[t].worth = `${ this.$i18n.locale === 'zh' ? '¥' : '$' }${ (
                    this.$store.state.exchangeRate.rateMap[t][
                        this.$i18n.locale === 'zh' ? 'cny' : 'usd'
                    ]
                    * (res[t].available + res[t].lock)
                ).toFixed(2) }`;
            });

            return res;
        },
        list() {
            return Object.keys(this.balance)
                .map(k => this.balance[k])
                .filter(v => {
                    const NOTnoZero = this.filter.hideZero && (v.available + v.lock) === 0;
                    const NOTmatchKey = this.filter.filterKey
                        && !v.symbol.match(new RegExp(this.filter.filterKey, 'i'));

                    return !(NOTnoZero || NOTmatchKey);
                });
        }
    },
    methods: {
        update: debounce(function () {
            this.isRotate = true;
            setTimeout(() => {
                this.isRotate = false;
            }, 2000);
            // Restart
            this.addr && this.$store.dispatch('startLoopExchangeBalance', this.addr);
        }, 0.1),
        withdraw(tokenId) {
            this.showConfirm({ tokenId, type: 'withdraw' });
        },
        recharge(tokenId) {
            this.showConfirm({ tokenId, type: 'recharge' });
        },
        detail(tokenId) {
            this.detailConfirm = true;
            chargeDetail({
                address: this.addr,
                tokenId
            }).then(data => {
                this.detailData = data.records;
            });
        },
        closeNumConfirm() {
            this.c = {};
            this.confirmShow = false;
        },
        close() {
            this.detailData = [];
            this.detailConfirm = false;
        },
        showConfirm({ tokenId, type }) {
            this.opNumber = '';

            this.c = {};
            const t = Object.assign({}, this.$t(`exchangeAssets.confirm${ type }`));
            t.tokenId = tokenId;
            t.type = type;
            t.icon = this.balance[tokenId].icon;
            this.c = t;

            this.confirmShow = true;
        },
        confirmClick() {
            if (!this.testAmount()) return;

            const tokenId = this.c.tokenId;
            const amount = BigNumber.toMin(this.opNumber,
                this.balance[tokenId].decimals);
            const c = this.c;

            const failSubmit = e => {
                this.$toast(this.$t(`exchangeAssets.confirm${ c.type }.failToast`), e);
            };

            const successSubmit = () => {
                this.$toast(this.$t(`exchangeAssets.confirm${ c.type }.successToast`));
            };

            const config = {
                pow: true,
                powConfig: {
                    isShowCancel: false,
                    difficulty: VoteDifficulty
                }
            };

            this.closeNumConfirm();
            this.acc.initPwd({
                submitTxt: this.$t(`exchangeAssets.table.rowMap.${ c.type }`),
                cancelTxt: this.$t('exchangeAssets.pwdConfirm.cancelTxt'),
                submit: () => {
                    c.type === 'recharge'
                        ? sendTx(deposit, { tokenId, amount }, config)
                            .then(successSubmit)
                            .catch(e => {
                                failSubmit(e);
                            })
                        : sendTx(withdraw, { tokenId, amount }, config)
                            .then(successSubmit)
                            .catch(e => {
                                failSubmit(e);
                            });
                }
            });
        },
        testAmount() {
            const amountBalance = this.c.type.toLowerCase() === 'recharge'
                ? this.balance[this.c.tokenId].balance
                : this.balance[this.c.tokenId].available;
            const decimals = this.balance[this.c.tokenId].decimals;
            const result = this.$validAmount(this.opNumber, decimals) === 0;

            if (!result) {
                this.c.errTips = this.$t('hint.amtFormat');
                return false;
            }

            if (BigNumber.isEqual(this.opNumber, 0)) {
                this.c.errTips = this.$t('wallet.hint.amount');
                return false;
            }

            // Const amount = BigNumber.toMin(this.opNumber, decimals);
            if (BigNumber.compared(amountBalance, this.opNumber) < 0) {
                this.c.errTips = this.$t('hint.insufficientBalance');
                return false;
            }

            this.c.errTips = '';
            return true;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/confirmInput.scss";
@import "../components/table.scss";

.ex_tb {
    height: calc(100% - 42px);
    flex: 1;

    .refresh {
        position: absolute;
        height: 20px;
        width: 20px;
        cursor: pointer;
        top: 10px;
        right: 0;
        &.rotate {
            transform: rotate(360deg);
            transition: all ease-in-out 1s;
        }
    }
    .head-row >div {
        position: relative;
        justify-content: flex-start;
        &:last-child {
            justify-content: flex-start;
            width: 300px;
        }
    }
    .row >div {
        justify-content: flex-start;
        &:last-child {
            display: flex;
            justify-content: space-between;
            width: 300px;
        }
    }
}

@include rowWith {
    width: 15%;
    &:first-child {
        width: 6%;
    }
}

.input {
    height: 40px;
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    width: 100%;
    display: flex;
    font-size: 14px;
    padding: 0 15px;
    align-items: center;
    box-sizing: border-box;

    img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
        border-radius: 20px;
    }

    .num {
        margin-left: auto;
        color: #007aff;
    }

    &.un-click-able {
        background: rgba(243, 246, 249, 1);
    }
}

.lable {
    font-size: 16px;
    margin-bottom: 16px;
    margin-top: 19px;

    .errtips {
        color: #ff2929;
        font-size: 12px;
        margin-left: auto;
    }

    &:first-child {
        margin-top: 0;
    }
}
</style>
