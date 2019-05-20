<template>
    <div class="__tb tb-list">
        <div class="__tb_row __tb_head __pointer">
            <div class="__tb_cell name">{{ $t('walletSBP.section1.nodeName') }}</div>
            <div class="__tb_cell addr">{{ $t('walletSBP.section1.producerAddr') }}</div>
            <div class="__tb_cell amount">{{ $t('stakingAmount') }}</div>
            <div class="__tb_cell height">{{ $t('withdrawHeight') }}</div>
            <div class="__tb_cell operate">{{ $t('action') }}</div>
        </div>

        <div v-show="list && list.length" class="__tb_content">
            <div class="__tb_row __tb_content_row" :class="{
                'unuse': !!item.isCancel
            }" v-for="(item, index) in list" :key="item.name">
                <div class="__tb_cell name __ellipsis">{{ item.name }}</div>
                <div class="__tb_cell addr">{{ item.nodeAddr }}</div>
                <div class="__tb_cell amount">{{ item.isCancel ? '--' : item.pledgeAmount }}</div>
                <div class="__tb_cell height">
                    {{ item.isCancel ? '--' : item.withdrawHeight }}
                    <i v-if="!item.isCancel" @click.self.stop="showTime(index)" class="tipsicon __pointer">
                        <tooltips v-show="showTimeTips === index" v-click-outside="hideTime" class="sbp-tooltips"
                                  :content="$t('walletSBP.section2.expireDate', { time: item.time })"></tooltips>
                    </i>
                </div>
                <div class="__tb_cell operate">
                    <span v-if="!item.isCancel" class="btn __pointer"
                          v-unlock-account @unlocked="edit(item)">{{ $t('btn.edit') }}</span>
                    <span v-if="item.isCancel" class="btn" :class="{
                        '__pointer': item.isReReg,
                        'unuse': !item.isReReg
                    }" v-unlock-account @unlocked="reg(item, true)">{{ $t('btn.reReg') }}</span>
                    <span v-if="!item.isCancel" class="btn" :class="{
                        '__pointer': item.isMaturity,
                        'unuse': !item.isMaturity
                    }" v-unlock-account @unlocked="cancel(item)">{{ $t('walletSBP.cancelBtn') }}</span>
                    <span class="btn __pointer"
                          v-unlock-account @unlocked="reward(item)">{{ $t('walletSBP.rewardBtn') }}</span>
                </div>
            </div>
        </div>

        <div class="__tb_content __tb_no_data" v-show="!list || !list.length">
            {{ $t('hint.noData') }}
        </div>
    </div>
</template>

<script>
import date from 'utils/date.js';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import BigNumber from 'utils/bigNumber';
import sendTx from 'utils/sendTx';
import $Vite from 'utils/viteClient';
import tooltips from 'components/tooltips';
import { initPwd } from 'components/password/index.js';

const amount = 100000;

export default {
    components: { tooltips },
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
            totalReward: null
        };
    },
    computed: {
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
                    isMaturity,
                    isCancel,
                    isReReg,
                    name: item.name,
                    nodeAddr: addr,
                    pledgeAmount: `${ BigNumber.toBasic(item.pledgeAmount, decimals) } ${ this.tokenInfo.tokenSymbol }`,
                    withdrawHeight: item.withdrawHeight,
                    time: day,
                    rawData: item
                });
            });

            return list;
        }
    },
    methods: {
        fetchList() {
            return this.$store.dispatch('fetchRegistrationList', this.address);
        },
        showTime(index) {
            this.showTimeTips = index;
        },
        hideTime() {
            this.showTimeTips = -1;
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
        reg(item, isReReg) {
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
        },
        cancel(item) {
            if (!item.isMaturity || item.isCancel) {
                return;
            }

            initPwd({
                title: this.$t('walletSBP.section2.cancelConfirm.title'),
                content: this.$t('walletSBP.section2.cancelConfirm.describe', { amount: item.pledgeAmount }),
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
        },
        edit(item) {
            if (item.isCancel) {
                return;
            }
            this.showConfirm('edit', item.rawData);
        },
        showReward(item) {
            initPwd({
                title: this.$t('walletSBP.rewardConfirm.title'),
                submitTxt: this.$t('walletSBP.rewardConfirm.rightBtn'),
                cancelTxt: this.$t('walletSBP.rewardConfirm.leftBtn'),
                content: `<div style="font-size: 14px;">
                    ${ this.$t('walletSBP.rewardConfirm.describe1', { time: date(new Date().getTime(), 'zh') }) }
                    <div style="
                        padding: 10px 15px;
                        box-sizing: border-box;
                        height: 40px;
                        line-height: 20px;
                        background:rgba(243,246,249,1);
                        border-radius:2px;
                        border:1px solid rgba(212,222,231,1);
                        margin: 15px 0;
                    ">VITE
                        <span style="color:rgba(0,122,255,1); float: right;">${ this.totalReward || '--' }</span>
                    </div>
                    <div style="
                        font-family: PingFang-SC-Regular;
                        font-weight: 400;
                        color: rgba(94,104,117,1);
                        line-height: 18px;
                    "><span style="
                            width: 6px;
                            height: 6px;
                            background: rgba(0,122,255,1);
                            display: inline-block;
                            margin-right: 4px;
                            border-radius: 6px;
                    "></span>
                    ${ this.$t('walletSBP.rewardConfirm.describe2') }
                    <a style="color: #007AFF" href="${ process.env.viteNet }${ this.$i18n.locale === 'zh' ? 'zh/' : '' }SBPDetail/${ item.rawData.name }"  target="_blank">${ this.$t('walletSBP.rewardConfirm.describe3') }</a>
                    ${ this.$t('walletSBP.rewardConfirm.describe4') }
                    </div>
                </div>`,
                submit: () => {
                    sendTx('retrieveReward', {
                        nodeName: item.rawData.name,
                        toAddress: this.address
                    }, {
                        pow: false,
                        confirm: {
                            showMask: true,
                            operate: this.$t('walletSBP.rewardBtn')
                        }
                    }).then(() => {
                        this.$toast(this.$t('hint.request', { name: this.$t('walletSBP.rewardBtn') }));
                    }).catch(err => {
                        this.$toast('Claim Failed', err);
                    });
                }
            }, true);
        },
        reward(item) {
            this.totalReward = null;
            $Vite.request('register_getAvailableReward', '00000000000000000001', item.rawData.name).then(data => {
                if (!data || !data.totalReward) {
                    this.totalReward = null;
                }

                const decimals = this.tokenInfo.decimals;
                this.totalReward = BigNumber.toBasic(data.totalReward, decimals);
                this.showReward(item);
            }).catch(err => {
                console.warn(err);
                this.$toast('Get Reward Failed', err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/table.scss';

.__tb.tb-list {
    min-width: 1080px;
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

.__tb_row.__tb_content_row.unuse {
    color: #ced1d5;
}

.name {
    width: 20%;
    min-width: 330px;
}

.addr {
    min-width: 200px;
    width: 20%;
}

.amount {
    width: 17%;
    min-width: 180px;
}

.height {
    min-width: 190px;
    width: 20%;
}

.operate {
    min-width: 205px;
    white-space: nowrap;
}
</style>
