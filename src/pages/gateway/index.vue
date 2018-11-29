<template>
    <div class="gateway-wrapper __wrapper">
        <sec-title></sec-title>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';
import ethWallet from 'utils/ethWallet/index.js';
import { timer } from 'utils/asyncFlow';

const minGwei = 3;
const maxGwei = 99;
const defaultGwei = 41;
const balanceTime = 5000;

let balanceInfoInst = null;

export default {
    components: {
        secTitle
    },
    created() {
        let activeAccount = this.$wallet.getActiveAccount();
        let mnemonic = activeAccount.getMnemonic();
        this.ethWallet = new ethWallet({
            mnemonic
        });

        this.startLoopBalance();
    },
    destroyed() {
        this.stopLoopBalance();
    },
    data() {
        return {
            ethWallet: null,
            balance: null
        };
    },
    methods: {        
        startLoopBalance() {
            this.stopLoopBalance();
            balanceInfoInst = new timer(()=>{
                return this.ethWallet.getBalance((res) => {
                    this.balance = res;
                });
            }, balanceTime);
            balanceInfoInst.start();
        },
        stopLoopBalance() {
            balanceInfoInst && balanceInfoInst.stop();
            balanceInfoInst = null;
        }
    }
};
</script>
    
<style lang="scss" scoped>

</style>
