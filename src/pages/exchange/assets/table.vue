<template>
    <div class="ex_tb">
        <div class="head-row">
            <div
                v-for="(h) in $t('exchangeAssets.table.heads')"
                :key="h"
            >{{h.replace("#tokenSymbol#","vite")}}
            </div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div class="row-container">
            <div
                class="row"
                v-for="token in list"
                :key="token.id"
            >
                <div>{{token.symbol}}</div>
                <div>{{Number((token.available+token.lock).toFixed(8))}}</div>
                <div>{{token.available}}</div>
                <div>{{token.lock||0}}</div>
                <div>{{token.worth}}</div>
                <div
                    @click="recharge(token.id)"
                    class="click-able"
                >{{$t("exchangeAssets.table.rowMap.recharge")}}</div>
                <div
                    @click="withdraw(token.id)"
                    class="click-able"
                >{{$t("exchangeAssets.table.rowMap.withdraw")}}</div>
                <div
                    @click="detail(token.id)"
                    class="click-able"
                >{{$t("exchangeAssets.table.rowMap.detail")}}</div>
            </div>
        </div>

        <img @click="update" class="refresh" :class="{rotate:isRotate}" src="~assets/imgs/exchange/refresh.svg" />

        <confirm :title="c.title" :singleBtn="true"
                 :leftBtnTxt="c.btn" :leftBtnClick="confirmClick"
                 :closeIcon="true" :close="closeNumConfirm"
                 v-if="confirmShow">
            <div class="confirm">
                <div class="lable">{{ c.lable1 }}</div>
                <div class="input un-click-able">
                    <img :src="c.icon" />
                    {{balance[c.tokenId].symbol}} 
                    <div class="num">
                        {{ c.type.toLowerCase()==="recharge" ? balance[c.tokenId].balance : balance[c.tokenId].available }}
                    </div>
                </div>
                <div class="lable">{{ c.lable2 }} 
                    <div class="errtips">{{ c.errTips }}</div>
                </div>
                <div class="input">
                    <input type="text" :placeholder="c.placeholder" v-model="opNumber">
                </div>
            </div>
        </confirm>

        <alert v-show="detailConfirm" :list="detailList"
               :heads="$t('exchangeAssets.confirmTable.heads')"
               :title="$t('exchangeAssets.confirmTable.title')"
               :close="close"></alert>

        <powProcess ref="pow"></powProcess>
    </div>
</template>

<script>
import alert from '../components/alert.vue';
import BigNumber from 'utils/bigNumber';
import getTokenIcon from 'utils/getTokenIcon';
import confirm from 'components/confirm.vue';
import powProcess from 'components/powProcess';
import debounce from 'lodash/debounce';
import d from 'dayjs';

import { deposit, withdraw, chargeDetail } from 'services/exchange';

const VoteDifficulty = '201564160';

export default {
    components: {
        confirm, alert, powProcess
    },
    props: {
        filter: { type: Object }
    },
    beforeMount() {
        this.acc = this.$wallet.getActiveAccount();
        if (!this.acc) {
            return;
        }
        this.acc && (this.addr = this.acc.getDefaultAddr());
        this.addr&&this.$store.dispatch('updateExBalance',this.addr);
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
            isRotate:false
        };
    },
    methods: {
        update: debounce(function (){
            this.isRotate=true;
            setTimeout(()=>{
                this.isRotate=false;
            },2000);
            this.addr && this.$store.dispatch('updateExBalance', this.addr);
        }, 0.1),
        withdraw(tokenId) {
            this.showConfirm({ 
                tokenId, type: 'withdraw' 
            });
        },
        recharge(tokenId) {
            this.showConfirm({ tokenId, type: 'recharge' });
        },
        detail(tokenId) {
            this.detailConfirm = true;
            chargeDetail({ address: this.addr, tokenId }).then(data => {
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
            const t = Object.assign(
                {},
                this.$t(`exchangeAssets.confirm${type}`)
            );
            t.tokenId = tokenId;
            t.type = type;
            t.icon = this.balance[tokenId].icon;
            this.c = t;
            this.confirmShow = true;
        },
        confirmClick() {
            if (!this.testAmount()) return;
            const tokenId = this.c.tokenId;
            const amount = BigNumber.toMin(
                this.opNumber,
                this.balance[tokenId].decimals
            );
            const c = this.c;
            const failSubmit = e => {
                const code =
                    e && e.error ? e.error.code || -1 : e ? e.code : -1;
                if (code === -35002) {
                    let startTime = new Date().getTime();
                    const powTxt = Object.assign(
                        {},
                        this.$t('quotaConfirmPoW')
                    );
                    powTxt.leftBtn.click = () => {
                        this.$router.push({
                            name: 'walletQuota'
                        });
                    };
                    (powTxt.rightBtn.click = () => {
                        this.$refs.pow
                            .startPowTx(
                                e.accountBlock,
                                startTime,
                                VoteDifficulty
                            )
                            .then(successSubmit)
                            .catch(failSubmit);
                    }),
                    (powTxt.closeBtn = { show: true });
                    this.$confirm(powTxt);
                } else {
                    this.$toast(
                        this.$t(`exchangeAssets.confirm${c.type}.failToast`)
                    );
                }
            };
            const successSubmit = () => {
                this.$toast(
                    this.$t(`exchangeAssets.confirm${c.type}.successToast`)
                );
            };

            this.closeNumConfirm();
            this.acc.initPwd({
                submitTxt: this.$t(`exchangeAssets.table.rowMap.${c.type}`),
                cancelTxt: this.$t('exchangeAssets.pwdConfirm.cancelTxt'),
                submit: () => {
                    c.type === 'recharge'
                        ? deposit({ tokenId, amount })
                            .then(successSubmit)
                            .catch(e => {
                                failSubmit(e);
                            })
                        : withdraw({ tokenId, amount })
                            .then(successSubmit)
                            .catch(e => {
                                failSubmit(e);
                            });
                }
            });
        },
        testAmount() {
            const amountBalance =
                this.c.type.toLowerCase() === 'recharge'
                    ? this.balance[this.c.tokenId].balance
                    : this.balance[this.c.tokenId].available;
            const decimals = this.balance[this.c.tokenId].decimals;
            const result = this.$validAmount(this.opNumber, decimals);
            if (!result) {
                this.c.errTips = this.$t('hint.amtFormat');
                return false;
            }

            if (BigNumber.isEqual(this.opNumber, 0)) {
                this.c.errTips = this.$t('wallet.hint.amount');
                return false;
            }

            // const amount = BigNumber.toMin(this.opNumber, decimals);
            if (BigNumber.compared(amountBalance, this.opNumber) < 0) {
                this.c.errTips = this.$t('hint.insufficientBalance');
                return false;
            }

            this.c.errTips = '';
            return true;
        }
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
                res[t].worth = `${this.$i18n.locale === 'zh' ? '¥' : '$'}${(
                    this.$store.state.exchangeRate.rateMap[t][
                        this.$i18n.locale === 'zh' ? 'cny' : 'usd'
                    ] *
                    (res[t].available + res[t].lock)
                ).toFixed(2)}`;
            });
            return res;
        },
        list() {
            return Object.keys(this.balance)
                .map(k => this.balance[k])
                .filter(v => {
                    const NOTnoZero = this.filter.hideZero && (v.available+v.lock) === 0;
                    const NOTmatchKey =
                        this.filter.filterKey &&
                        !v.symbol.match(new RegExp(this.filter.filterKey, 'i'));
                    return !(NOTnoZero || NOTmatchKey);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../components/table.scss";
.ex_tb {
    height: calc(100% - 60px);
    margin-bottom: 10px;
    flex: 1;
    box-shadow: 0px 2px 48px 1px rgba(176, 192, 237, 0.42);
    .refresh{
        position: absolute;
        height: 20px;
        width: 20px;
        cursor: pointer;
        top: 10px;
        right: 6px;
        &.rotate{
            transform: rotate(360deg);
            transition: all ease-in-out 1s;
        }
    }
}
@include rowWith {
    width: 8%;
    &:first-child,
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
        width: 15%;
    }
}
.confirm {
    display: flex;
    flex-direction: column;
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
        }
        input {
            width: 100%;
            height: 100%;
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
}
</style>
