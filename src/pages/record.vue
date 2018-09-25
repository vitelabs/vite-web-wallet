<template>
    <mnemonic :title="'mnemonic.record'" :submit="login">
        <div class="wrapper">{{ this.mnemonic }}</div>
    </mnemonic>
</template>

<script>
import mnemonic from 'components/mnemonic.vue';

export default {
    components: {
        mnemonic
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
</style>
