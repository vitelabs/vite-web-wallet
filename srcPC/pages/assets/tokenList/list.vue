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
            <!-- <div class="col">
                {{$t('tokenCard.heads.gate')}}
                <tips :content="$t('tokenCard.heads.gateTips')"></tips>
            </div> -->
            <div class="col">{{$t('tokenCard.heads.totalExAmount')}}</div>
            <div class="col">
                {{$t('tokenCard.heads.availableExAmount')}}
                <tips :content="$t('tokenCard.heads.availableExAmountTips')"></tips>
            </div>
            <!-- <div class="col">
                <AssetSwitch v-model="assetType" class="asset-switch" />
            </div> -->
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
import tokenCard from '../tokenCard/index.vue';
import AssetSwitch from '../assetSwitch.vue';
import tips from './tips.vue';
import unreceiveTips from './unreceiveTips.vue';

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
@use "@assets/scss/theme.scss" as *;
@use "../tokenCard/colWidth.scss" as *;

.token-list {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 2px;
    flex-grow: 1;
    @include box_shadow();
    @include bg_color_2();
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
            background: url("@assets/imgs/dexEmpty.svg") 100% 100%;
        }
    }
    .token__head {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        font-size: 12px;
        @include font_color_2();
        @include common_border_one(bottom);
        .col {
            @include colWidth;
            padding: 9px;
            overflow: visible;
            .asset-switch {
                @include font-family-normal();
                color: rgba(94, 104, 117, 0.58);
                font-size: 12px;
                border: none;
                margin-left: -10px;
                .list-title {
                    padding: 0 10px;
                }
                .list {
                    overflow: visible;
                    border-radius: 2px;
                    margin-top: 8px;
                    @include font-family-normal();
                    [data-theme="0"] & {
                        color: rgba(94,104,117,0.58);
                    }
                    [data-theme="1"] & {
                        color: #C0C6D3;
                    }
                    // .item:hover {
                    //     [data-theme="0"] & {
                    //         background: #151C32;
                    //     }
                    //     [data-theme="1"] & {
                    //         background: #1E2745;
                    //     }
                    // }
                }
            }
        }
    }
}
</style>
