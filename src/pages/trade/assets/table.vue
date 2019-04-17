<template>
    <div class="ex_tb">
        <div class="head-row">
            <div v-for="(h) in $t('tradeAssets.table.heads')"
                 :key="h">
                {{ h.replace("#tokenSymbol#","vite") }}
            </div>
            <div>{{ $t('tradeAssets.operate') }}
                <img @click="update" class="refresh" :class="{rotate:isRotate}" src="~assets/imgs/trade/refresh.svg" />
            </div>
        </div>
        <div class="row-container">
            <div class="row" v-for="token in list" :key="token.id">
                <div>{{ token.symbol }}</div>
                <div>{{ token.total }}</div>
                <div>{{ token.available }}</div>
                <div>{{ token.lock || 0 }}</div>
                <div>{{ token.worth }}</div>
                <div>
                    <span v-unlock-account @unlocked="recharge(token.id)"
                          class="click-able">
                        {{ $t("tradeAssets.table.rowMap.recharge") }}</span>
                    <span v-unlock-account @unlocked="withdraw(token.id)"
                          class="click-able">
                        {{ $t("tradeAssets.table.rowMap.withdraw") }}</span>
                    <span @click="detail(token.id)" class="click-able">
                        {{ $t("tradeAssets.table.rowMap.detail") }}</span>
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
                    {{ balance[c.tokenId].symbol }}
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
               :heads="$t('tradeAssets.confirmTable.heads')"
               :title="$t('tradeAssets.confirmTable.title')"
               :close="close"></alert>
    </div>
</template>

<script>
import d from 'dayjs';
import debounce from 'lodash/debounce';
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';
import getTokenIcon from 'utils/getTokenIcon';
import { timer } from 'utils/asyncFlow';
import { deposit, withdraw, chargeDetail, rateToken, tokenDetail } from 'services/trade';
import viteInput from 'components/viteInput';
import confirm from 'components/confirm.vue';
import alert from '../components/alert.vue';

const VoteDifficulty = '201564160';
const loopTime = 2 * 60 * 60 * 1000;
let rateTimer = null;

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
    destroyed() {
        this.stopLoopRate();
    },
    data() {
        return {
            fetchTokenIds: [],
            detailConifrm: false,
            c: {},
            opNumber: '',
            confirmShow: false,
            detailData: [],
            detailConfirm: false,
            acc: null,
            addr: '',
            isRotate: false,
            assignRateMap: {},
            tokenMap: {},
            fetchTokenMapIds: []
        };
    },
    computed: {
        detailList() {
            return Object.keys(this.detailData).map(k => {
                const o = this.detailData[k];

                return [
                    d.unix(o.optime).format('YYYY-MM-DD HH:mm'),
                    o.tokenName,
                    this.$t('tradeAssets.table.rowMap.sideMap')[o.optype],
                    o.amount
                ];
            });
        },
        baseRateMap() {
            return this.$store.state.exchangeRate.rateMap || {};
        },
        rateMap() {
            return Object.assign({}, this.baseRateMap, this.assignRateMap);
        },
        balance() {
            const exB = this.$store.getters.exBalanceList;
            const walletB = this.$store.getters.tokenBalanceList;

            const res = {};
            Object.keys(exB).forEach(t => {
                res[t] = {
                    available: exB[t].available,
                    lock: exB[t].lock,
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
                    res[t].balance = walletB[t].balance;
                    return;
                }
                res[t] = {
                    available: 0,
                    lock: 0,
                    balance: walletB[t].balance,
                    icon: walletB[t].icon,
                    id: t,
                    symbol: walletB[t].symbol,
                    decimals: walletB[t].decimals
                };
            });

            Object.keys(res).forEach(t => {
                res[t].icon = this.getTokenIcon(res[t].id);
                res[t].total = BigNumber.plus(res[t].available, res[t].lock, 8, 'nofix');

                const rate = this.getRate(t);

                if (!rate) {
                    res[t].worth = '-';
                    return;
                }

                const pre = this.$i18n.locale === 'zh' ? '¥' : '$';
                const realPrice = BigNumber.multi(rate, res[t].total, 2);
                res[t].worth = `${ pre }${ realPrice }`;
            });

            return res;
        },
        list() {
            return Object.keys(this.balance)
                .map(k => this.balance[k])
                .filter(v => {
                    const NOTnoZero = this.filter.hideZero && +v.total === 0;
                    const NOTmatchKey = this.filter.filterKey
                        && !v.symbol.match(new RegExp(this.filter.filterKey, 'i'));

                    return !(NOTnoZero || NOTmatchKey);
                });
        }
    },
    watch: {
        balance: function () {
            for (const tokenId in this.balance) {
                if (this.fetchTokenIds.indexOf(tokenId) === -1) {
                    this.fetchTokenIds.push(tokenId);
                }
                if (this.fetchTokenMapIds.indexOf(tokenId) === -1) {
                    this.fetchTokenMapIds.push(tokenId);
                }
            }
        },
        fetchTokenIds: function () {
            this.startLoophRate();
        },
        fetchTokenMapIds: function () {
            this.fetchTokenDetails();
        }
    },
    methods: {
        startLoophRate() {
            this.stopLoopRate();

            rateTimer = new timer(() => rateToken({ tokenIdList: this.fetchTokenIds }).then(data => {
                if (!data) {
                    return;
                }
                this.assignRateMap = data;
            }), loopTime);

            rateTimer.start();
        },
        stopLoopRate() {
            rateTimer && rateTimer.stop();
            rateTimer = null;
        },
        getRate(tokenId) {
            const coin = this.$store.state.exchangeRate.coins[this.$i18n.locale || 'zh'];
            if (!tokenId || !this.rateMap[tokenId]) {
                return null;
            }
            return this.rateMap[tokenId][coin] || null;
        },
        fetchTokenDetails() {
            if (!this.fetchTokenMapIds || !this.fetchTokenMapIds.length) {
                return;
            }

            const repList = [];
            this.fetchTokenMapIds.forEach(tokenId => {
                repList.push(tokenDetail({ tokenId }));
            });

            Promise.all(repList).then(data => {
                if (!data || !data.length) {
                    return;
                }

                data.forEach(tokenDetail => {
                    this.tokenMap[tokenDetail.tokenId] = tokenDetail;
                });
            }).catch(err => {
                console.warn(err);
            });
        },
        getTokenIcon(tokenId) {
            if (this.tokenMap && this.tokenMap[tokenId] && this.tokenMap[tokenId].urlIcon) {
                return this.tokenMap[tokenId].urlIcon;
            }

            const defaultToken = this.$store.state.ledger.tokenInfoMaps[tokenId];
            if (defaultToken && defaultToken.icon) {
                return defaultToken.icon;
            }

            return getTokenIcon(tokenId);
        },
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
            const t = Object.assign({}, this.$t(`tradeAssets.confirm${ type }`));
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
                this.$toast(this.$t(`tradeAssets.confirm${ c.type }.failToast`), e);
            };

            const successSubmit = () => {
                this.$toast(this.$t(`tradeAssets.confirm${ c.type }.successToast`));
            };

            const config = {
                pow: true,
                powConfig: { difficulty: VoteDifficulty }
            };

            this.closeNumConfirm();
            this.acc.initPwd({
                submitTxt: this.$t(`tradeAssets.table.rowMap.${ c.type }`),
                cancelTxt: this.$t('tradeAssets.pwdConfirm.cancelTxt'),
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
