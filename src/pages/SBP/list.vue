<template>
    <div class="list-content __tb">
        <div class="__tb_row __tb_head __pointer">
            <div class="__tb_cell name">{{ $t('SBP.section1.nodeName') }}</div>
            <div class="__tb_cell addr">{{ $t('SBP.section1.producerAddr') }}</div>
            <div class="__tb_cell amount">{{ $t('SBP.section1.quotaAmount') }}</div>
            <div class="__tb_cell height">{{ $t('quota.list.withdrawHeight') }}</div>
            <div class="__tb_cell reward">{{ $t('SBP.section1.allReward') }}</div>
            <div class="__tb_cell operate">{{ $t('quota.list.operate') }}</div>
        </div>
        
        <div v-show="list && list.length" class="__tb_content">
            <div class="__tb_row __tb_content_row" v-for="item in list" :key="item.name">
                <div class="__tb_cell name">{{ item.name }}</div>
                <div class="__tb_cell addr">{{ item.nodeAddr }}</div>
                <div class="__tb_cell amount">{{ item.pledgeAmount }}</div>
                <div class="__tb_cell height">{{ item.withdrawHeight }}</div>
                <div class="__tb_cell reward">{{ item.availableReward }}</div>
                <div class="__tb_cell operate">
                    <span class="btn __pointer" :class="{
                        'unuse': item.isCancel    
                    }" @click="edit(item)">edit</span>
                    <span class="btn __pointer" :class="{
                        'unuse': !item.isMaturity || item.isCancel    
                    }" @click="cancel(item)">cancel</span>
                    <span class="btn __pointer" @click="reward(item)">reward</span>
                </div>
            </div>
        </div>

        <div class="__tb_content __tb_no_data" v-show="!list || !list.length">
            {{ $t('hint.noData') }}
        </div>
    </div>
</template>

<script>
import timer from 'utils/asyncFlow';
import ellipsisAddr from 'utils/ellipsisAddr.js';

let listInst;

export default {
    props: {
        tokenInfo: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    created() {
        this.startLoopList();
    },
    destroyed() {
        this.stopLoopList();
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();
        let address = activeAccount.getDefaultAddr();

        return {
            activeAccount,
            address
        };
    },
    computed: {
        list() {
            console.log(this.tokenInfo);
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return [];
            }

            let decimals = this.tokenInfo.decimals;
            let currentHeight = viteWallet.Ledger.getHeight() || 0;

            // this.$store.state.SBP.registrationList || 
            let registrationList = [{
                'name': 'super',
                'nodeAddr': 'vite_8b3c663cdfa1e4e75fa30d1b2ec341de016570cf986a4ff157',
                'pledgeAddr': 'vite_8b3c663cdfa1e4e75fa30d1b2ec341de016570cf986a4ff157',
                'pledgeAmount': 500000000000000000000000,
                'withdrawHeight': 100,
                'withdrawTime': 23232323,
                'cancelHeight': 0,
                'availableReward': 1051200000,
                'availableRewardOneTx': 1051200000,
                'rewardStartHeight': 1,
                'rewardEndHeight': 100
            }];
  
            let list = [];

            registrationList.forEach(item => {
                let isMaturity = viteWallet.BigNumber.compared(item.withdrawHeight, currentHeight) <= 0;
                let isCancel = !!item.cancelHeight;

                list.push({
                    isMaturity,
                    isCancel,
                    name: item.name,
                    nodeAddr: ellipsisAddr(item.nodeAddr),
                    pledgeAmount: viteWallet.BigNumber.toBasic(item.pledgeAmount, decimals) + ' ' +  this.tokenInfo.tokenSymbol,
                    withdrawHeight: item.withdrawHeight,
                    time: '?',
                    availableReward: viteWallet.BigNumber.toBasic(item.availableReward, decimals) + ' ' +  this.tokenInfo.tokenSymbol,
                    rawData: item
                });
            });

            return list;
        }
    },
    methods: {
        startLoopList() {
            this.stopLoopList();
            listInst = new timer(()=>{
                return this.fetchList();
            }, 2000);
            listInst.start();
        },
        stopLoopList() {
            listInst && listInst.stop();
            listInst = null;
        },
        fetchList() {
            return this.$store.dispatch('fetchRegistrationList', this.address);
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
                    this._sendTx('cancelRegisterBlock', item.rawData);
                }
            }, true);
            console.log(item.rawData);
        },
        edit(item) {
            if (item.isCancel) {
                return;
            }
            console.log(item);
            console.log(item.rawData);
        },
        reward(item) {
            console.log(item);
            console.log(item.rawData);
        },

        _sendTx(type, item) {
            console.log(type);
            console.log(item);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/table.scss';

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
    min-width: 240px;
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
.reward {
    width: 14%;
    min-width: 150px;
}
.operate {
    min-width: 205px;
}
</style>
