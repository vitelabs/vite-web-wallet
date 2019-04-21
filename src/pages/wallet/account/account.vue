<template>
    <div class="account-wrapper __wrapper">
        <div class="head">
            <sync-block class="sync-block"></sync-block>
        </div>
        <account-head class="item"></account-head>
        <div class="token-list item">
            <tokenCard
                v-for="token in default2ndOfficaltokenList"
                :key="token.tokenId"
                :token="token"
            ></tokenCard>
            <tokenCard
                v-for="token in userStorageTokenList"
                :key="token.tokenId"
                :token="token"
            ></tokenCard>
        </div>
        <transaction
            v-if="isShowTrans"
            :token="activeToken"
            :closeTrans="closeTrans"
        ></transaction>
    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import tokenCard from './tokenCard';
import accountHead from './head';
import transaction from './transaction';
import { constant } from '@vite/vitejs';
import { defaultTokenMap } from 'utils/defaultToken';
import { gateStorage } from 'services/gate';

export default {
    components: { accountHead, syncBlock, tokenCard, transaction },
    data() {
        return {
            isShowTrans: false,
            activeToken: null
        };
    },
    computed: {
        default2ndOfficaltokenList() {
            const balanceInfo = this.$store.getters.balanceInfo;
            const allToken = this.$store.state.ledger.tokenInfoMaps;
            const officalGateTokenMap = this.$store.getters.officalGateTokenMap;
            // ------------------- show default token
            const defaultTokenList = Object.keys(defaultTokenMap).map(i => {
                const { tokenName = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'NATIVE', gateInfo = {} } = Object.assign({}, defaultTokenMap[i], balanceInfo[i] || {}, allToken[i] || {});
                return { tokenName, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
            });
            // ------ show offical gate token
            const officalTokenList = Object.keys(officalGateTokenMap).map(i => {
                const { tokenName = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'OFFICAL_GATE', gateInfo = {} } = Object.assign({}, officalGateTokenMap[i], balanceInfo[i] || {}, allToken[i] || {});
                return { tokenName, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
            });
            const list = [ ...defaultTokenList, ...officalTokenList ];
            // force vite first
            const viteId = constant.Vite_TokenId;
            return list.splice(list.findIndex(v => v.tokenId === viteId), 1).concat(list);
            // -------------
        },
        userStorageTokenList() {
            const balanceInfo = this.$store.getters.balanceInfo;
            const allToken = this.$store.state.ledger.tokenInfoMaps;
            const userStorageTokenMap = gateStorage.data;
            // ------- show user defined gate
            const userStorageTokenList = Object.keys(userStorageTokenMap).map(i => {
                const { tokenName = '', totalSupply = '', isReIssuable = '', tokenSymbol, balance = '', fundFloat = '', decimals = '', owner = '', tokenId = i, icon, type = 'THRID_GATE', gateInfo = {} } = Object.assign({}, userStorageTokenMap[i], balanceInfo[i] || {}, allToken[i] || {});
                return { tokenName, totalSupply, isReIssuable, tokenSymbol, balance, fundFloat, decimals, owner, tokenId, icon, type, gateInfo };
            });
            return userStorageTokenList;
        }
    },
    methods: {
        showTrans(token) {
            if (!token.id) {
                return;
            }
            this.isShowTrans = true;
            this.activeToken = token;
        },
        closeTrans() {
            this.isShowTrans = false;
            this.activeToken = null;
        },
        charge() {},
        withdraw() {}
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
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
