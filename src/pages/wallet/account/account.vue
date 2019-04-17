<template>
    <div class="account-wrapper __wrapper">
        <div class="head">
            <sync-block class="sync-block"></sync-block>
        </div>
        <account-head class="item"></account-head>
        <div class="token-list item">
            <tokenCard
                v-for="token in tokenList"
                :key="token.id"
                :opt="token"
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

export default {
    components: { accountHead, syncBlock, tokenCard, transaction },
    data() {
        return {
            isShowTrans: false,
            activeToken: null
        };
    },
    computed: {
        tokenList() {
            const balanceInfo = JSON.parse(JSON.stringify(this.$store.getters.balanceInfo));
            // ------------------- update tokenInfo from total token map,force default token show
            for (const tokenId in this.$store.state.ledger.defaultTokenIds) {
                //
                const token
                    = this.$store.state.ledger.tokenInfoMaps[tokenId]
                    || balanceInfo[tokenId];
                if (!token) break;
                const defaultToken = this.$store.state.ledger.defaultTokenIds[tokenId];
                const symbol = token.tokenSymbol || defaultToken.tokenSymbol;

                balanceInfo[tokenId] = balanceInfo[tokenId] || {
                    balance: '0',
                    fundFloat: '0',
                    symbol,
                    decimals: '0'
                };
                balanceInfo[tokenId].icon = defaultToken.icon;
            }
            const viteTokenInfo = this.$store.state.viteTokenInfo;
            const list = [];
            const viteId = viteTokenInfo.tokenId;
            if (balanceInfo[viteId]) {
                list.push(balanceInfo[viteId]);
                delete balanceInfo[viteId];
            }
            Object.keys(balanceInfo).forEach(k => {
                list.push(balanceInfo[k]);
            });
            return list;
            // -------------
        }
    },
    methods: {
        // action(actionType, tokenId) {
        //     console.log(actionType, tokenId);
        // },
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
