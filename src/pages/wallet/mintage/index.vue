<template>
    <div class="mintage-wrapper">
        <div class="mintage">
            <div class="order-row-title">activeAddr</div>
            <div>{{ activeAddr }}</div>

            <div class="order-row-title">tokenName</div>
            <vite-input v-model="tokenName"></vite-input>

            <div class="order-row-title">tokenSymbol</div>
            <vite-input v-model="tokenSymbol"></vite-input>

            <div class="order-row-title">totalSupply</div>
            <vite-input v-model="totalSupply"></vite-input>

            <div class="order-row-title">decimals</div>
            <vite-input v-model="decimals"></vite-input>

            <div class="order-row-title">isReIssuable</div>
            <div class="select-icon-wrapper __pointer" @click="toogleIsReIssuable(true)">
                <span class="select-icon" :class="{
                    active: isReIssuable
                }"></span>true
            </div>
            <div class="select-icon-wrapper __pointer" @click="toogleIsReIssuable(false)">
                <span class="select-icon" :class="{
                    active: !isReIssuable
                }"></span>false
            </div>

            <div v-show="isReIssuable">
                <div class="order-row-title">maxSupply</div>
                <vite-input v-model="maxSupply"></vite-input>

                <div class="order-row-title">ownerBurnOnly</div>
                <div class="select-icon-wrapper __pointer" @click="toogleOwnerBurnOnly(true)">
                    <span class="select-icon" :class="{
                        active: ownerBurnOnly
                    }"></span>true
                </div>
                <div class="select-icon-wrapper __pointer" @click="toogleOwnerBurnOnly(false)">
                    <span class="select-icon" :class="{
                        active: !ownerBurnOnly
                    }"></span>false
                </div>
            </div>

            <div class="__btn_all_in btn" :class="{
                'unuse': !canMintage
            }" @click="mintage">mintage</div>
        </div>
        <tokenList></tokenList>
    </div>
</template>

<script>
import tokenList from './tokenList';
import viteInput from 'components/viteInput';
import sendTx from 'utils/sendTx';

export default {
    components: { viteInput, tokenList },
    created() {
        this.getOwnerToken();
    },
    data() {
        return {
            decimals: '0',
            isReIssuable: false,
            maxSupply: '0',
            ownerBurnOnly: true,
            totalSupply: '',
            tokenName: '',
            tokenSymbol: ''
        };
    },
    computed: {
        activeAddr() {
            return this.$store.getters.activeAddr;
        },
        canMintage() {
            return this.decimals && this.maxSupply && this.totalSupply && this.tokenName && this.tokenSymbol;
        }
    },
    methods: {
        toogleIsReIssuable(isReIssuable) {
            this.isReIssuable = isReIssuable;
            if (!isReIssuable) {
                this.ownerBurnOnly = true;
                this.maxSupply = '';
            }
        },
        toogleOwnerBurnOnly(ownerBurnOnly) {
            this.ownerBurnOnly = ownerBurnOnly;
        },

        mintage() {
            sendTx('mintage', {
                decimals: this.decimals,
                isReIssuable: this.isReIssuable,
                maxSupply: this.maxSupply,
                ownerBurnOnly: this.ownerBurnOnly,
                totalSupply: this.totalSupply,
                tokenName: this.tokenName,
                tokenSymbol: this.tokenSymbol
            }).then(() => {
                this.$toast('Mintage success');
            }).catch(err => {
                this.$toast(`Mintage fail. ${ err.error.message || err.error.msg }`, err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.mintage-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    overflow: auto;
    .mintage {
        width: 600px;
    }
    .order-row-title {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        @include font-family-normal();
        font-weight: 400;
        color: #333;
        margin-top: 5px;
    }
    .btn {
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 20px;
        text-align: center;

        &.unuse {
            background: #efefef;
            color: #666;
        }
    }
    .select-icon-wrapper {
        font-size: 11px;
        @include font-family-normal();
        font-weight: 400;
        color: rgba(94, 104, 117, 1);
        margin-left: 12px;

        .select-icon {
            position: relative;
            display: inline-block;
            box-sizing: border-box;
            width: 12px;
            height: 12px;
            border-radius: 10px;
            border: 1px solid rgba(188, 196, 201, 1);
            margin-right: 4px;
            margin-bottom: -2px;

            &.active {
                &::after {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -2px;
                    margin-left: -2px;
                    content: ' ';
                    display: inline-block;
                    width: 4px;
                    height: 4px;
                    background: #007aff;
                    border-radius: 5px;
                }
            }
        }
    }
}

.list-wrapper {
    margin-top: 20px;
}
</style>
