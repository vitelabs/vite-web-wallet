<template>
    <div class="list-content __tb">
        <div class="__tb_row __tb_head __pointer">
            <div class="__tb_cell" v-for="v in $t('SBP.section1.headList')" :key="v"> {{v}}</div>
        </div>
        
        <div v-show="!list || !list.length" class="__tb_content">
            <div class="__tb_row __tb_content_row" v-for="item in list" :key="item.name">
                <div class="__tb_cell">{{ item.name }}</div>
                <div class="__tb_cell">{{ item.nodeAddr }} 
                    <!-- <i v-if="v.nodeStatus === 'cancelRegister'" class="tipsicon hoveraction">
                        <tooltips :content="$t('vote.section1.hoverHelp')"></tooltips>
                    </i> -->
                </div>
                <div class="__tb_cell">{{ item.pledgeAddr }}</div>
                <div class="__tb_cell">{{ item.pledgeAmount }}</div>
                <div class="__tb_cell">{{ item.withdrawHeight }}</div>
                <div class="__tb_cell">{{ item.availableReward }}</div>
                <div class="__tb_cell">
                    <span class="edit">edit</span>
                    <span class="cancel">cancel</span>
                    <span class="reward">reward</span>
                </div>
                <!-- <div class="cell" @click="cancelVote(v)"
                     :class="v.voteStatus === 'voting' ? 'unclickable' : 'clickable'">
                    {{ v.operate }}
                </div> -->
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
            address,
            head: ['name', 'nodeAddr', 'pledgeAddr', 'pledgeAmount', 'withdrawHeight', 'availableReward', 'operate']
        };
    },
    computed: {
        list() {
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return [];
            }

            let decimals = this.tokenInfo.decimals;
            let registrationList = this.$store.state.SBP.registrationList || [];
            let list = [];

            registrationList.forEach(item => {
                list.push({
                    name: item.name,
                    nodeAddr: ellipsisAddr(item.nodeAddr),
                    pledgeAddr: ellipsisAddr(item.pledgeAddr),
                    pledgeAmount: viteWallet.BigNumber.toBasic(item.pledgeAmount, decimals) + ' ' +  this.tokenInfo.symbol,
                    withdrawHeight: item.withdrawHeight,
                    time: '?',
                    availableReward: viteWallet.BigNumber.toBasic(item.availableReward, decimals) + ' ' +  this.tokenInfo.symbol
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/table.scss';

</style>
