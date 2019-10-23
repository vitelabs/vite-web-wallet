<template>
    <div class="token-list">
        <div class="token__head">
            <div class="col" >{{$t('tokenCard.heads.name')}}</div>
            <div class="col">
                {{$t('tokenCard.heads.balance')}}
                <tips :content="$t('tokenCard.heads.balanceTips')"></tips>
            </div>
            <div class="col">
                {{$t('tokenCard.heads.onroad')}}
                <unreceive-tips :unreceivedNum="unreceivedNum"></unreceive-tips>
                <tips v-show="unreceivedNum === 0" :content="$t('tokenCard.heads.unreceivedTips')"></tips>
            </div>
            <div class="col">
                {{$t('tokenCard.heads.gate')}}
                <tips :content="$t('tokenCard.heads.gateTips')"></tips>
            </div>
            <div class="col">{{$t('tokenCard.heads.totalExAmount')}}</div>
            <div class="col">
                {{$t('tokenCard.heads.availableExAmount')}}
                <tips :content="$t('tokenCard.heads.availableExAmountTips')"></tips>
            </div>
            <div class="col">
                <AssetSwitch v-model="assetType" class="asset-switch" />
            </div>
        </div>
        <div v-show="!tokenList || !tokenList.length" class="no-data"><div>{{ $t('hint.noData') }}</div></div>
        <tokenCard v-show="tokenList && tokenList.length"
                   v-for="token in tokenList"
                   :key="token.tokenId"
                   :token="token"
                   :assetType="assetType"
        ></tokenCard>
    </div>
</template>

<script>
import tokenCard from '../tokenCard';
import AssetSwitch from '../assetSwitch';
import tips from './tips';
import unreceiveTips from './unreceiveTips';

export default {
    components: { AssetSwitch, tokenCard, tips, unreceiveTips },
    props: {
        tokenList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return { assetType: 'TOTAL' };
    },
    computed: {
        balanceInfo() {
            return this.$store.getters.balanceInfo;
        },
        unreceivedNum() {
            if (!this.balanceInfo) {
                return 0;
            }

            let unreceivedNum = 0;
            for (const tokenId in this.balanceInfo) {
                unreceivedNum += (+this.balanceInfo[tokenId].onroadNum || 0);
            }
            return unreceivedNum;
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "assets/scss/vars.scss";
@import "../tokenCard/colWidth.scss";

.token-list {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.32);
    border-radius: 2px;
    flex-grow: 1;
    background-color: #fff;
    .no-data {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        font-size: 12px;
        @include font-family-normal();
        color: rgba(94,104,117,0.58);
        line-height: 16px;
        text-align: center;
        &:before {
            display: inline-block;
            margin-bottom: 16px;
            content: ' ';
            width: 60px;
            height: 60px;
            background: url('~assets/imgs/dexEmpty.svg') 100% 100%;
        }
    }
    .token__head {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        color: #5e6875;
        border-bottom: 1px solid rgba(198,203,212,1);
        background-color: #fff;
        font-size: 12px;
        .col {
            @include colWidth;
            padding: 9px;
            color: rgba(94, 104, 117, 0.58);
            overflow: visible;
            .asset-switch {
                color: rgba(94, 104, 117, 0.58);;
                font-size: 12px;
                @include font-family-normal();
                border: none;
                margin-left: -10px;
                /deep/.list-title {
                    padding: 0 10px;
                }
                /deep/.list {
                    overflow: visible;
                    border-radius: 2px;
                    margin-top: 8px;
                    @include font-family-normal();
                    color: rgba(94,104,117,0.58);
                    .item:hover {
                        background: rgba(75,116,255,0.1);
                    }
                }
            }
        }
    }
}
</style>
