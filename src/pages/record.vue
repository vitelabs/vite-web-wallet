<template>
    <div>
        <mnemonic :title="'mnemonic.record'" :submit="login">
            <div class="wrapper">
                {{ mnemonic }}
                <!-- <div v-for="(item, index) in mnemonic" :key="index">
                    {{ item }}
                </div> -->
            </div>
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
    mounted() {
        this.activeAccount = viteWallet.Wallet.getActiveAccount();
        this.mnemonic = this.activeAccount.getMnemonic() || '';

        // let list = mnemonic.split(/\s/);

        // let mnemonicList = [];
        // let str = '';
        // list.forEach((element, index) => {
        //     if (index !== 0 && index < list.length - 1 && index%6 === 0) {
        //         mnemonicList.push(str);
        //         str = '';
        //     } else if (index !== 0) {
        //         str += ' ';
        //     }
        //     str += element;
        // });
        // mnemonicList.push(str);
    },
    data() {
        let activeAccount = viteWallet.Wallet.getActiveAccount();
        let mnemonic = activeAccount.getMnemonic() || '';

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
