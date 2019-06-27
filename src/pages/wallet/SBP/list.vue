<template>
    <div class="tb-list">
        <wallet-table class="wallet-sbp-table" :headList="[{
            class: 'name __ellipsis',
            text: $t('walletSBP.section1.nodeName'),
            cell: 'name'
        },{
            class: 'addr',
            text: $t('walletSBP.section1.producerAddr'),
            cell: 'addr'
        },{
            class: 'amount',
            text: $t('stakingAmount'),
            cell: 'amount'
        },{
            class: 'height',
            text: $t('withdrawHeight'),
            cell: 'height'
        },{
            class: 'operate',
            text: $t('action'),
            cell: 'operate'
        }]" :contentList="list">

            <span v-for="(item, i) in list" :key="i"
                  :slot="`${i}heightBefore`">
                {{ item.isCancel ? '--' : item.withdrawHeight }}
                <i v-if="!item.isCancel" @click.self.stop="showTime(i)" class="tipsicon __pointer">
                    <tooltips v-show="showTimeTips === i" v-click-outside="hideTime" class="sbp-tooltips"
                              :content="$t('walletSBP.section2.expireDate', { time: item.time })"></tooltips>
                </i>
            </span>

            <span v-for="(item, i) in list" :key="i"
                  :slot="`${i}operateBefore`">
                <span v-if="!item.isCancel" class="btn __pointer"
                      @click="edit(item)">{{ $t('btn.edit') }}</span>
                <span v-if="item.isCancel" class="btn" :class="{
                    '__pointer': item.isReReg,
                    'unuse': !item.isReReg
                }" @click="reg(item, true)">{{ $t('btn.reReg') }}</span>
                <span v-if="!item.isCancel" class="btn" :class="{
                    '__pointer': item.isMaturity,
                    'unuse': !item.isMaturity
                }" @click="cancel(item)">{{ $t('walletSBP.cancelBtn') }}</span>
                <span class="btn __pointer"
                      @click="reward(item)">{{ $t('walletSBP.rewardBtn') }}</span>
            </span>
        </wallet-table>

        <password v-show="isShowReward"
                  :title="$t('walletSBP.rewardConfirm.title')"
                  :submitTxt="$t('walletSBP.rewardConfirm.rightBtn')"
                  :cancelTxt="$t('walletSBP.rewardConfirm.leftBtn')"
                  :isShowPWD="isShowPWD" :cancel="hideReward" :submit="sendReward">
            <div class="reward-confirm-wrapper">
                {{ $t('walletSBP.rewardConfirm.describe1', { time: this.getTime(new Date().getTime()) }) }}
                <div class="reward-amount">VITE
                    <span>{{ totalReward || '--' }}</span>
                </div>
                <div class="reward-des">
                    {{ $t('walletSBP.rewardConfirm.describe2') }}
                    <a class="link" target="_blank"
                       :href="getUrl(rewardItem && rewardItem.rawData.name)">
                        {{ $t('walletSBP.rewardConfirm.describe3') }}
                    </a>
                    {{ $t('walletSBP.rewardConfirm.describe4') }}
                </div>
            </div>
        </password>
    </div>
</template>

<script>
import date from 'utils/date.js';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import BigNumber from 'utils/bigNumber';
import sendTx from 'utils/sendTx';
import $Vite from 'utils/viteClient';
import { constant } from 'utils/store';
import tooltips from 'components/tooltips';
import walletTable from 'components/table/index.vue';
import { initPwd } from 'components/password/index.js';
import password from 'components/password/password.vue';
import { execWithValid } from '../../../utils/execWithValid';

const amount = 500000;

export default {
    components: { tooltips, password, walletTable },
    props: {
        showConfirm: {
            type: Function,
            default: () => {}
        },
        tokenInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        getParams: {
            type: Function,
            default: () => {}
        }
    },
    created() {
        this.fetchList();
    },
    data() {
        return {
            showTimeTips: -1,
            totalReward: null,
            isShowReward: false,
            rewardItem: null
        };
    },
    computed: {
        isShowPWD() {
            const currHDAcc = this.$store.state.wallet.currHDAcc;
            const accInfo = currHDAcc ? currHDAcc.getAccInfo() : null;
            const isHoldPWD = accInfo ? !!accInfo[constant.HoldPwdKey] : false;
            return !isHoldPWD;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        amountErr() {
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return '';
            }
            const balance = this.tokenBalList[this.tokenInfo.tokenId] ? this.tokenBalList[this.tokenInfo.tokenId].totalAmount : 0;
            const minAmount = BigNumber.toMin(amount, this.tokenInfo.decimals);
            if (BigNumber.compared(balance, minAmount) < 0) {
                return this.$t('hint.insufficientBalance');
            }

            return '';
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        },
        currentHeight() {
            return this.$store.state.ledger.currentHeight || 0;
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        list() {
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return [];
            }

            const decimals = this.tokenInfo.decimals;

            const registrationList = this.$store.state.SBP.registrationList || [];
            const list = [];

            registrationList.forEach(item => {
                const isMaturity = BigNumber.compared(item.withdrawHeight, this.currentHeight) <= 0;
                const isCancel = item.cancelTime && !BigNumber.isEqual(item.cancelTime, 0);
                const isReReg = isCancel
                    ? (new Date().getTime() - item.cancelTime * 1000) > 75000
                    : false;
                const addr = ellipsisAddr(item.nodeAddr, 6);

                const day = date(item.withdrawTime * 1000, this.$i18n.locale);
                list.push({
                    name: item.name,
                    addr,
                    amount: item.isCancel ? '--' : `${ BigNumber.toBasic(item.pledgeAmount, decimals) } ${ this.tokenInfo.tokenSymbol }`,

                    isMaturity,
                    isCancel,
                    isReReg,
                    withdrawHeight: item.withdrawHeight,
                    time: day,
                    rawData: item
                });
            });

            return list;
        }
    },
    watch: {
        address() {
            this.fetchList();
        }
    },
    methods: {
        fetchList() {
            return this.$store.dispatch('fetchRegistrationList');
        },
        showTime(index) {
            this.showTimeTips = index;
        },
        hideTime() {
            this.showTimeTips = -1;
        },
        getTime(time) {
            return date(time, 'zh');
        },
        getUrl(name) {
            return `${ process.env.viteNet }${ this.$i18n.locale === 'zh' ? 'zh/' : '' }SBPDetail/${ name }`;
        },

        sendRegisterTx(item) {
            const rawData = item.rawData;
            const nodeName = rawData.name;
            const producerAddr = rawData.nodeAddr;

            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            sendTx('SBPreg', this.getParams({ producerAddr, amount, nodeName }), {
                pow: false,
                confirm: {
                    showMask: true,
                    operate: this.$t('walletSBP.register')
                }
            }).then(() => {
                this.$toast(this.$t('walletSBP.section1.registerSuccess'));
                this.$store.dispatch('loopRegList', {
                    nodeName,
                    operate: 1,
                    producer: producerAddr
                });
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('walletSBP.section1.registerFail'), err);
            });
        },
        reg: execWithValid(function (item, isReReg) {
            if (isReReg && !item.isReReg) {
                return;
            }

            if (this.amountErr) {
                this.$toast(this.amountErr);
                return;
            }

            initPwd({
                title: this.$t('walletSBP.confirm.title'),
                submitTxt: this.$t('walletSBP.confirm.rightBtn'),
                cancelTxt: this.$t('walletSBP.confirm.leftBtn'),
                content: this.$t('walletSBP.confirm.describe', { amount }),
                submit: () => {
                    this.sendRegisterTx(item);
                }
            }, true);
        }),
        cancel: execWithValid(function (item) {
            if (!item.isMaturity || item.isCancel) {
                return;
            }

            initPwd({
                title: this.$t('walletSBP.section2.cancelConfirm.title'),
                content: this.$t('walletSBP.section2.cancelConfirm.describe', { amount: item.amount }),
                submit: () => {
                    const nodeName = item.rawData.name;
                    const producer = item.rawData.nodeAddr;

                    sendTx('revokeReg', this.getParams({ nodeName }), {
                        pow: false,
                        confirm: {
                            showMask: true,
                            operate: this.$t('walletSBP.cancel')
                        }
                    }).then(() => {
                        this.$toast(this.$t('hint.request', { name: this.$t('walletSBP.section2.cancel') }));
                        this.$store.dispatch('loopRegList', {
                            nodeName,
                            operate: 0,
                            producer
                        });
                    }).catch(err => {
                        this.$toast(this.$t('walletSBP.section2.cancelFail'), err);
                    });
                }
            }, true);
        }),
        edit: execWithValid(function (item) {
            if (item.isCancel) {
                return;
            }
            this.showConfirm('edit', item.rawData);
        }),
        sendReward() {
            sendTx('retrieveReward', {
                nodeName: this.rewardItem.rawData.name,
                toAddress: this.address
            }, {
                pow: false,
                confirm: {
                    showMask: true,
                    operate: this.$t('walletSBP.rewardBtn')
                }
            }).then(() => {
                this.$toast(this.$t('hint.request', { name: this.$t('walletSBP.rewardBtn') }));
                this.hideReward();
            }).catch(err => {
                this.$toast('Claim Failed', err);
            });
        },
        showReward(item) {
            this.isShowReward = true;
            this.rewardItem = item;
        },
        hideReward() {
            this.isShowReward = false;
            this.rewardItem = null;
        },
        reward: execWithValid(function (item) {
            this.totalReward = null;
            $Vite.request('register_getAvailableReward', '00000000000000000001', item.rawData.name).then(data => {
                if (!data || data.drained || !+data.totalReward) {
                    this.$toast(this.$t('walletSBP.noReward'));
                    return;
                }

                const decimals = this.tokenInfo.decimals;
                this.totalReward = BigNumber.toBasic(data.totalReward, decimals);
                this.showReward(item);
            }).catch(err => {
                console.warn(err);
                this.$toast('Get Reward Failed', err);
            });
        })
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.reward-confirm-wrapper {
    font-size: 14px;
    margin-bottom: 10px;
    .reward-amount {
        padding: 10px 15px;
        box-sizing: border-box;
        height: 40px;
        line-height: 20px;
        background: rgba(243,246,249,1);
        border-radius: 2px;
        border: 1px solid rgba(212,222,231,1);
        margin: 15px 0;
        span {
            color: rgba(0,122,255,1);
            float: right;
        }
    }
    .reward-des {
        @include font-family-normal();
        font-weight: 400;
        color: rgba(94,104,117,1);
        line-height: 18px;
        &:before {
            display: inline-block;
            content: ' ';
            width: 6px;
            height: 6px;
            background: rgba(0,122,255,1);
            display: inline-block;
            margin-right: 4px;
            border-radius: 6px;
        }
        .link {
            color: #007AFF;
        }
    }
}

.tipsicon {
    position: relative;
    display: inline-block;
    background: url(~assets/imgs/hover_help.svg);
    overflow: visible;
    width: 16px;
    height: 16px;
    vertical-align: sub;
    .sbp-tooltips {
        min-width: 300px;
    }
}

.btn {
    font-size: 14px;
    color: #007aff;
    margin-right: 18px;
    &.unuse {
        color: #ced1d5;
    }
}
</style>
