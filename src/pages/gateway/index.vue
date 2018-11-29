<template>
    <div class="gateway-wrapper __wrapper">
        <sec-title></sec-title>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';
import ethWallet from 'utils/ethWallet/index.js';

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

        this.ethWallet.getBalance();
        console.log(this.ethWallet);
    },
    data() {
        return {
            ethWallet: null
        };
    }
};
</script>
    
<style lang="scss" scoped>

</style>
