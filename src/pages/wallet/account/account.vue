<template>
    <div class="account-wrapper __wrapper">
        <div class="head">
            <sync-block class="sync-block"></sync-block>
        </div>
        <account-head class="item"></account-head>
        <div class="token-list item">
            <div class="token-class">{{$t('tokenCard.type.native')}}</div>
            <tokenCard
                v-for="token in nativeTokenList"
                :key="token.tokenId"
                :token="token"
            ></tokenCard>
            <div class="token-class">{{$t('tokenCard.type.crossGate')}}</div>
            <tokenCard
                v-for="token in crossChainTokenList"
                :key="`_${token.tokenId}`"
                :token="token"
            ></tokenCard>
            <div class="add-card" @click="addToken">
                <img src="~/assets/imgs/add_token.png"/>
            </div>
        </div>

    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import tokenCard from './tokenCard';
import accountHead from './head';
import { addTokenDialog } from './dialog';
import { gateStorage } from 'services/gate';

export default {
    components: { accountHead, syncBlock, tokenCard },
    data() {
        return {
            isShowTrans: false,
            activeToken: null
        };
    },
    watch: {
        otherWhithBalance(val) {
            gateStorage.bindTokens(val.map(t => {
                return { tokenId: t.tokenId, gateInfo: {} };
            }));
        }
    },

    computed: {
        nativeTokenList() {
            return [ ...this.defaultTokenList, ...this.userStorageTokenList.filter(t => !t.gateInfo.url), ...this.otherWhithBalance ];
        },
        crossChainTokenList() {
            return [ ...this.officalGateTokenList, ...this.userStorageTokenList.filter(t => t.gateInfo.url) ];
        },
        defaultTokenList() {
            return this.$store.getters.defaultTokenList;
        },
        officalGateTokenList() {
            return this.$store.getters.officalGateTokenList;
        },
        userStorageTokenList() {
            return this.$store.getters.userStorageTokenList;
        },
        otherWhithBalance() {
            return this.$store.getters.otherWhithBalance;
        }
    },
    methods: {
        addToken() {
            addTokenDialog();
        }

    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
@import "assets/scss/vars.scss";
.page-content .account-wrapper.__wrapper {
    padding-top: 0;
}

.account-wrapper {
    position: relative;
    box-sizing: border-box;
    overflow: auto;
    height: 100%;

    .head {
        position: relative;
        text-align: center;
        margin-top: 20px;
        line-height: 40px;
    }

    .sync-block {
        display: inline-block;
    }

    .net-btn {
        position: absolute;
        right: 0;
    }
}

.item {
    margin-top: 20px;
}

.token-list {
    display: flex;
    flex-wrap: wrap;
    .token-class{
        border-left: 1px solid #007AFF;
        padding-left: 9px;
        width: 100%;
        box-sizing: border-box;
        font-family: $font-bold;
        margin: 20px 0 24px;
    }
    .add-card{
        box-sizing: border-box;
        position: relative;
        min-width: 300px;
        background: #fff;
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
        margin: 0 40px 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img{
            height: 50px;
            width: 50px;
        }
    }
}

@media only screen and (max-width: 550px) {
    .account-wrapper .head {
        margin-bottom: 0;
    }

    .token-list {
        display: block;
    }
}
</style>
