<template>
    <div>
        <mnemonic :title="'mnemonic.record'" :submit="login">
            <div class="wrapper">{{ this.mnemonic }}</div>
        </mnemonic>
        <process class="process" active="record"></process>
    </div>
</template>

<script>
import mnemonic from 'components/mnemonic.vue';
import process from 'components/process';

export default {
    components: {
        mnemonic, process
    },
    data() {
        let activeAccount = viteWallet.Wallet.getActiveAccount();
        let mnemonic = activeAccount.getMnemonic();
        return {
            activeAccount,
            mnemonic
        };
    },
    methods: {
        login() {
            this.activeAccount.save();
            this.$router.push({
                name: 'login'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    box-sizing: border-box;
    padding: 20px;
}
.process {
    margin-top: 60px;
}
</style>
