<template>
    <div class="import-account-wrapper">
        <div class="__title">记录助记词</div>
        <div class="note">
            助记词是您恢复账户的重要手段，如给予他人，
            <br />
            您的资产会被他人获取。请谨慎记录，以防丢失。
        </div>
        <div class="input-wrapper">{{ this.mnemonic }}</div>
        <div class="btn_list">
            <span class="__btn __btn_border __pointer" @click="back">返回</span>
            <span class="__btn __btn_all_in __pointer" @click="login">确定</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        let entropy = this.$route.params.entropy;
        let mnemonic = $ViteJS.Wallet.Address.getMnemonicFromEntropy(entropy);

        return {
            mnemonic
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        login() {
            this.$router.push({
                name: 'login'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.note {
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    line-height: 20px;
    margin-bottom: 30px;
}
.input-wrapper {
    box-sizing: border-box;
    position: relative;
    padding: 20px;
    background: #F3F6F9;
    border: 1px solid #D4DEE7;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    color: #1D2024;
}

.btn_list {
    margin-top: 20px;
    .__btn {
        display: inline-block;
        width: 167px;
    }
    .__btn_border {
        margin-right: 20px;
    }
}
</style>

