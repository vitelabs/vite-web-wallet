<template>
    <div class="__tb tb-list">
        <div class="__tb_row __tb_head __pointer">
            <div class="__tb_cell name">{{ $t('SBP.section1.nodeName') }}</div>
            <div class="__tb_cell addr">{{ $t('SBP.section1.producerAddr') }}</div>
            <div class="__tb_cell amount">{{ $t('SBP.section1.quotaAmount') }}</div>
            <div class="__tb_cell height">{{ $t('quota.list.withdrawHeight') }}</div>
            <div class="__tb_cell operate">{{ $t('quota.list.operate') }}</div>
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
                                  :content="$t('SBP.section2.expireDate', { time: item.time })"></tooltips>
                    </i>
                </div>
                <div class="__tb_cell operate">
                    <span v-if="!item.isCancel" class="btn __pointer" @click="edit(item)">{{ $t('btn.edit') }}</span>
                    <span v-if="!item.isCancel" class="btn" :class="{
                        '__pointer': item.isMaturity,
                        'unuse': !item.isMaturity   
                    }" @click="cancel(item)">{{ $t('SBP.cancelBtn') }}</span>
                    <span v-if="item.isCancel" class="btn __pointer" @click="reg(item)">{{ $t('btn.reReg') }}</span>
                    <!-- <span class="btn" :class="{
                        '__pointer': item.isReward,
                        'unuse': !item.isReward
                    }" @click="reward(item)">reward</span> -->
                </div>
            </div>
        </div>

        <div class="__tb_content __tb_no_data" v-show="!list || !list.length">
            {{ $t('hint.noData') }}
        </div>
    </div>
</template>

<script>
import { quotaConfirm } from 'components/quota/index';
import tooltips from 'components/tooltips';
import date from 'utils/date.js';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import BigNumber from 'utils/BigNumber';

const amount = 500000;

export default {
    components: {
        tooltips
    },
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
        let activeAccount = this.$wallet.getActiveAccount();
        let address = activeAccount.getDefaultAddr();

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
            let balance = this.tokenBalList[this.tokenInfo.tokenId] ? this.tokenBalList[this.tokenInfo.tokenId].totalAmount : 0;
            let minAmount = BigNumber.toMin(amount, this.tokenInfo.decimals);
            if (BigNumber.compared(balance, minAmount) < 0) {
                return this.$t('transList.valid.bal');
            }
            return '';
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        },
        list() {
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return [];
            }

            let decimals = this.tokenInfo.decimals;
            let currentHeight = viteWallet.Ledger.getHeight() || 0;

            let registrationList = this.$store.state.SBP.registrationList || [];  
            let list = [];

            registrationList.forEach(item => {
                let isMaturity = BigNumber.compared(item.withdrawHeight, currentHeight) <= 0;
                let isCancel = item.cancelHeight && !BigNumber.isEqual(item.cancelHeight, 0);
                let isReward = !BigNumber.isEqual(item.availableReward, 0);
                let addr = ellipsisAddr(item.nodeAddr, 6);
                
                let day = date(item.withdrawTime * 1000, this.$i18n.locale);
                list.push({
                    isMaturity,
                    isCancel,
                    isReward,
                    name: item.name,
                    nodeAddr: addr,
                    pledgeAmount: BigNumber.toBasic(item.pledgeAmount, decimals) + ' ' +  this.tokenInfo.tokenSymbol,
                    withdrawHeight: item.withdrawHeight,
                    time: day,
                    availableReward: BigNumber.toBasic(item.availableReward, decimals) + ' ' +  this.tokenInfo.tokenSymbol,
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
            let rawData = item.rawData;
            let nodeName = rawData.name;
            let producerAddr = rawData.nodeAddr;

            this.sendTx({
                producerAddr, amount, nodeName
            }, 'SBPreg').then(() => {
                this.$toast(this.$t('SBP.section1.registerSuccess'));
                this.$store.dispatch('loopRegList', {
                    address: this.address,
                    nodeName, 
                    operate: 1, 
                    producer: producerAddr
                });
            }).catch((err) => {
                console.warn(err);
                if (err && err.error && err.error.code && err.error.code === -35002) {
                    quotaConfirm({
                        operate: this.$t('SBP.register')
                    });
                    return;
                }
                this.$toast(this.$t('SBP.section1.registerFail'), err);
            });
        },
        reg(item) {
            if (this.amountErr) {
                this.$toast(this.amountErr);
                return;
            }

            this.activeAccount.initPwd({
                title: this.$t('SBP.confirm.title'),
                submitTxt: this.$t('SBP.confirm.rightBtn'),
                cancelTxt: this.$t('SBP.confirm.leftBtn'),
                content: this.$t('SBP.confirm.describe', { amount }),
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
                title: this.$t('SBP.section2.cancelConfirm.title'),
                content: this.$t('SBP.section2.cancelConfirm.describe', {
                    amount: item.pledgeAmount
                }),
                submit: () => {
                    let nodeName = item.rawData.name;
                    let producer = item.rawData.nodeAddr;

                    this.sendTx({
                        nodeName
                    }, 'revokeReg').then(()=>{
                        this.$toast(this.$t('SBP.section2.cancelSuccess'));
                        this.$store.dispatch('loopRegList', {
                            address: this.address,
                            nodeName, 
                            operate: 0, 
                            producer
                        });
                    }).catch((err)=>{
                        if (err && err.error && err.error.code && err.error.code === -35002) {
                            quotaConfirm({
                                operate: this.$t('SBP.cancel')
                            });
                            return;
                        }
                        this.$toast(this.$t('SBP.section2.cancelFail'), err);
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
        reward(item) {
            if (!item.isReward) {
                return;
            }
            this.showConfirm('reward', item.rawData);
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
    color: #007AFF;
    margin-right: 18px;
    &.unuse {
        color: #CED1D5;
    }
}
.__tb_row.__tb_content_row.unuse {
    color: #CED1D5;
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
