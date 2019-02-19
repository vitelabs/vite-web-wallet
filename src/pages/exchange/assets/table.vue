<template>
    <div class="ex_tb">
        <div class="head-row">
            <div
                v-for="(h) in $t('exchangeAssets.table.heads')"
                :key="h"
            >{{h.replace("#tokenSymbol#","vite")}}
            </div>
            <div></div>
        </div>
        <div class="row-container">
            <div
                class="row"
                v-for="token in list"
                :key="token.id"
            >
                <div>{{token.symbol}}</div>
                <div>{{token.balance}}</div>
                <div>{{token.available}}</div>
                <div>{{token.lock}}</div>
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

        <confirm
            :title="c.title"
            :singleBtn="true"
            :leftBtnTxt="c.btn"
            :leftBtnClick="confirmClick"
            v-if="confirmShow"
        >
            <div class="confirm">
                <div class="lable">{{c.lable1}}</div>
                <div class="input un-click-able"><img :src="c.icon" />{{balance[c.tokenId].symbol}} <div class="num">{{c.type.toLowerCase()==="charge"?balance[c.tokenId].balance:balance[c.tokenId].available}}</div>
                </div>
                <div class="lable">{{c.lable2}} <div class="tips">{{c.errTips}}</div>
                </div>
                <div class="input"><input
                    type="text"
                    :placeholder="c.placeholder"
                    v-model="opNumber"
                ></div>
            </div>
        </confirm>
        <alert
            v-show="detailConfirm"
            :list="detailList"
            :heads="$t('exchangeAssets.confirmTable.heads')"
            :title="'成交记录'"
            :close="close"
        >

        </alert>

    </div>
</template>
<script>
import alert from '../components/alert.vue';
import confirm from 'components/confirm.vue';
import { deposit, withdraw, chargeDetail } from 'services/exchange';
import BigNumber from 'utils/bigNumber';
const VoteDifficulty = '201564160';
export default {
    props: {
        filter: { type: Object }
    },
    components: {
        confirm,
        alert
    },
    beforeMount() {
        this.acc = this.$wallet.getActiveAccount();
        if (!this.acc) return;
        this.acc && (this.addr = this.acc.getDefaultAddr());
    },
    data() {
        return {
            detailConifrm: false,
            c: {},
            opNumber: '',
            confirmShow: false,
            detailList: [],
            detailConfirm: false,
            acc:null,
            addr:''
        };
    },
    methods: {
        withdraw(tokenId) {
            this.showConfirm({ tokenId, type: 'Withdraw' });
        },
        recharge(tokenId) {
            this.showConfirm({ tokenId, type: 'Charge' });
        },
        detail(tokenId) {
            this.detailConfirm = true;
            chargeDetail({ address: this.addr, tokenId }).then(data => {
                this.detailList = data.records;
            });
        },
        close() {
            this.detailList = [];
            this.detailConfirm = false;
        },
        showConfirm({ tokenId, type }) {
            const t = this.$t(`exchangeAssets.confirm${type}`);
            t.tokenId = tokenId;
            t.type = type;
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
            const failSubmit=e => {
                const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;
                if (code === -35002) {
                    let startTime = new Date().getTime();
                    const c = Object.assign({}, this.$t('quotaConfirmPoW'));
                    c.leftBtn.click = () => {
                        this.$router.push({
                            name: 'walletQuota'
                        });
                    };
                    (c.rightBtn.click = () => {
                        this.$refs.pow.startPowTx(e.accountBlock, startTime, VoteDifficulty)
                            .then(successSubmit)
                            .catch(failSubmit);
                    }),
                    (c.closeBtn = { show: true });
                    this.$confirm(c);
                } else {
                    this.$toast(this.$t('walletVote.section1.cancelVoteErr'), e);
                }
            };
            const successSubmit=()=>{
                this.$toast('提现成功');
            };
            this.acc.initPwd(
                {
                    submitTxt: this.$t(
                        'walletVote.section1.confirm.submitText'
                    ),
                    cancelTxt: this.$t(
                        'walletVote.section1.confirm.cancelText'
                    ),
                    submit: () => {
                        this.c.type.toLowerCase() === 'charge'
                            ? deposit({ tokenId, amount }).catch(e=>{
                                failSubmit(e);
                            })
                            : withdraw({ tokenId, amount }).catch(e=>{
                                failSubmit(e);
                            });
                    }
                },
                true
            );
        },
        testAmount() {
            const amountBalance =
                this.c.type.toLowerCase() === 'charge'
                    ? this.balance[this.c.tokenId].balance
                    : this.balance[this.c.tokenId].balance;
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
                if (!this.$store.state.exchangeRate.rateMap[t]) {
                    res[t].worth = '-';
                    return;
                }
                res[t].worth = `${this.$i18n.locale === 'zh' ? '¥' : '$'}${
                    this.$store.state.exchangeRate.rateMap[t][
                        this.$i18n.locale === 'zh' ? 'cny' : 'usd'
                    ]
                }`;
            });
            return res;
        },
        list() {
            return Object.keys(this.balance)
                .map(k => this.balance[k])
                .filter(v => {
                    const NOTnoZero = this.filter.hideZero && v.balance === '0';
                    const NOTmatchKey =
                        this.filter.filterKey &&
                        !v.symbol.match(new RegExp(this.filter.filterKey));
                    return !(NOTnoZero || NOTmatchKey);
                });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../components/table.scss";
.ex_tb {
    height: 100%;
    padding-bottom: 10px;
    flex: 1;
    box-shadow: 0px 2px 48px 1px rgba(176, 192, 237, 0.42);

}
@include rowWith {
    width: 8%;
    &:first-child,
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
        .tips {
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
