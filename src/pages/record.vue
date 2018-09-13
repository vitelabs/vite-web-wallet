<template>
    <mnemonic :title="'title.record'" :submit="login">
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
        let entropy = this.$route.params.entropy;
        let mnemonic = $ViteJS.Wallet.Address.getMnemonicFromEntropy(entropy);
        return {
            mnemonic
        };
    },
    methods: {
        login() {
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

