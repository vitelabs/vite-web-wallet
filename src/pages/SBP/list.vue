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
            <div class="__tb_row __tb_content_row" v-for="(item, index) in list" :key="item.name">
                <div class="__tb_cell name">{{ item.name }}</div>
                <div class="__tb_cell addr">{{ item.nodeAddr }}</div>
                <div class="__tb_cell amount">{{ item.pledgeAmount }}</div>
                <div class="__tb_cell height">
                    {{ item.withdrawHeight }}
                    <i @click.self.stop="showTime(index)" class="tipsicon __pointer">
                        <tooltips v-show="showTimeTips === index" class="sbp-tooltips"
                                  v-click-outside @clickoutside="hideTime"
                                  :content="$t('SBP.section2.expireDate', { time: item.time })"></tooltips>
                    </i>
                </div>
                <div class="__tb_cell operate">
                    <span class="btn" :class="{
                        '__pointer': !item.isCancel,
                        'unuse': item.isCancel    
                    }" @click="edit(item)">edit</span>
                    <span class="btn" :class="{
                        '__pointer': item.isMaturity && !item.isCancel,
                        'unuse': !item.isMaturity || item.isCancel    
                    }" @click="cancel(item)">cancel</span>
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
        list() {
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return [];
            }

            let decimals = this.tokenInfo.decimals;
            let currentHeight = viteWallet.Ledger.getHeight() || 0;

            let registrationList = this.$store.state.SBP.registrationList || [];  
            let list = [];

            registrationList.forEach(item => {
                let isMaturity = viteWallet.BigNumber.compared(item.withdrawHeight, currentHeight) <= 0;
                let isCancel = item.cancelHeight && !viteWallet.BigNumber.isEqual(item.cancelHeight, 0);
                let isReward = !viteWallet.BigNumber.isEqual(item.availableReward, 0);
                
                let day = date(item.withdrawTime * 1000, this.$i18n.locale);
                list.push({
                    isMaturity,
                    isCancel,
                    isReward,
                    name: item.name,
                    nodeAddr: item.nodeAddr,
                    pledgeAmount: viteWallet.BigNumber.toBasic(item.pledgeAmount, decimals) + ' ' +  this.tokenInfo.tokenSymbol,
                    withdrawHeight: item.withdrawHeight,
                    time: day,
                    availableReward: viteWallet.BigNumber.toBasic(item.availableReward, decimals) + ' ' +  this.tokenInfo.tokenSymbol,
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
                    this.sendTx({
                        nodeName: item.rawData.name
                    }, 'cancelRegisterBlock').then(()=>{
                        this.$toast(this.$t('SBP.section2.cancelSuccess'));
                    }).catch((err)=>{
                        if (err && err.error && err.error.code && err.error.code === -35002) {
                            quotaConfirm({
                                operate: this.$t('SBP.cancel')
                            });
                            return;
                        }
                        this.$toast(this.$t('SBP.section2.cancelFail'));
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
    min-width: 1150px;
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
.name {
    width: 5%;
    min-width: 140px;
}
.addr {
    min-width: 470px;
    width: 25%;
}
.amount {
    width: 17%;
    min-width: 150px;
}
.height {
    min-width: 185px;
    width: 20%;
}
.operate {
    min-width: 205px;
}
</style>
