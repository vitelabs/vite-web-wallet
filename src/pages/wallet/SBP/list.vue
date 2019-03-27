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
                    <span v-if="!item.isCancel" class="btn" :class="{
                        '__pointer': item.isMaturity,
                        'unuse': !item.isMaturity
                    }" v-unlock-account @unlocked="cancel(item)">{{ $t('walletSBP.cancelBtn') }}</span>
                    <span v-if="item.isCancel" class="btn __pointer"
                          v-unlock-account @unlocked="reg(item)">{{ $t('btn.reReg') }}</span>
                </div>
            </div>
        </div>

        <div class="__tb_content __tb_no_data" v-show="!list || !list.length">
            {{ $t('hint.noData') }}
        </div>
    </div>
</template>

<script>
import tooltips from 'components/tooltips';
import date from 'utils/date.js';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import BigNumber from 'utils/bigNumber';
import sendTx from 'utils/sendTx';

const amount = 500000;

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
        sendTx: {
            type: Function,
            default: () => {}
        }
    },
    created() {
        this.fetchList();
    },
    data() {
        const activeAccount = this.$wallet.getActiveAccount();
        const address = activeAccount.getDefaultAddr();

        return {
            activeAccount,
            address,
            showTimeTips: -1
        };
    },
    computed: {
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
        list() {
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return [];
            }

            const decimals = this.tokenInfo.decimals;

            const registrationList = this.$store.state.SBP.registrationList || [];
            const list = [];

            registrationList.forEach(item => {
                const isMaturity = BigNumber.compared(item.withdrawHeight, this.currentHeight) <= 0;
                const isCancel = item.cancelHeight && !BigNumber.isEqual(item.cancelHeight, 0);
                const addr = ellipsisAddr(item.nodeAddr, 6);

                const day = date(item.withdrawTime * 1000, this.$i18n.locale);
                list.push({
                    isMaturity,
                    isCancel,
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

            sendTx(this.sendTx, { producerAddr, amount, nodeName, type: 'SBPreg' }, {
                pow: false,
                confirm: {
                    showMask: true,
                    operate: this.$t('walletSBP.register')
                }
            }).then(() => {
                this.$toast(this.$t('walletSBP.section1.registerSuccess'));
                this.$store.dispatch('loopRegList', {
                    address: this.address,
                    nodeName,
                    operate: 1,
                    producer: producerAddr
                });
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('walletSBP.section1.registerFail'), err);
            });
        },
        reg(item) {
            if (this.amountErr) {
                this.$toast(this.amountErr);
                return;
            }

            this.activeAccount.initPwd({
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

            this.activeAccount.initPwd({
                title: this.$t('walletSBP.section2.cancelConfirm.title'),
                content: this.$t('walletSBP.section2.cancelConfirm.describe', { amount: item.pledgeAmount }),
                submit: () => {
                    const nodeName = item.rawData.name;
                    const producer = item.rawData.nodeAddr;

                    sendTx(this.sendTx, { nodeName, type: 'revokeReg' }, {
                        pow: false,
                        confirm: {
                            showMask: true,
                            operate: this.$t('walletSBP.cancel')
                        }
                    }).then(() => {
                        this.$toast(this.$t('hint.request', { name: this.$t('walletSBP.section2.cancel') }));
                        this.$store.dispatch('loopRegList', {
                            address: this.address,
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
}
</style>
