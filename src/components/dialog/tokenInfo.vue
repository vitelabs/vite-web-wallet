<template lang="pug">
extends ./base.pug
block content
    .body
        .head
            .head__name
                .head__name__gate
            .head__symbol
        .content
            .tab
                .tab__item(@click="tapClick('tokenInfo')") 详情
                .tap__item(v-if="token.type!=='NATIVE'" @click="tapClick('gate')") gate_way详情
            .tab-content(v-if="tapName==='tokenInfo'")
                .content__item.click-able-color
                    .lable Token_Id
                    .
                    {{token.tokenId}}
                .content__item
                    .lable 铸币地址
                    .
                    {{token.owner}}
                .content__item
                    .lable 代币名称
                    .
                    {{token.tokenName}}
                .content__item
                    .lable 发行总量
                    .
                    {{token.totalSupply}}
                .content__item
                    .lable 小数点
                    .
                    {{token.decimals}}
                .content__item
                    .lable 可增发
                    .
                    {{token.isReIssuable}}
                .content__item
                    .lable 发行日期
                    .
                    {{token.tokenId}}
            .tab-content(v-if="tapName==='gate'&&token.type==='OFFICAL_GATE'")
                .content__item
                    .lable
                .content__item
                    .lable
                .content__item
                    .lable
            .tab-content(v-if="tapName==='gate'&&token.type==='THIRD_GATE'")
                .content__item
                    .lable
                .content__item
                    .lable
</template>

<script>
import { utils } from '@vite/vitejs';

const tokenEnum = {
    GATE: 'gate',
    TOKEN_INFO: 'tokenInfo',
    RECORD: 'record'
};
export default {
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    data() {
        return { tapName: tokenEnum.TOKEN_INFO };
    },
    methods: {
        tapClick(name) {
            this.tapName = name;
        }
    },
    computed: {
        addressQrcode() {
            return utils.tools.uriStringify({
                target_address: this.address,
                params: { amount: this.amount }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.body {
    .head {
        box-sizing: border-box;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: rgba(0,122,255,0.05);
        .icon {
            width: 40px;
            height: 40px;
        }
        &__name {
            font-family: $font-bold;
            color: rgba(29, 32, 36, 1);
            font-size: 14px;
            &__gate{
                color: #007AFF;
                background-color: rgba(0,122,255,1);
                font-family: $font-normal;
                font-size: 12px;
                height: 20px;
                padding: 0 4px;
                margin-left: 6px;
                line-height: 20px;
            }
        }
        &__symbol {
            font-size: 12px;
            color: rgba(94, 104, 117, 1);
        }

    }
    .content{
        .tap{
            padding-left: 30px;
            height: 50px;
            display: flex;
            border: 1px solid #D4DEE7;
            &__item{
                height: 100%;
                box-sizing: border-box;
                margin-right: 40px;
                color: #5E6875;
                &.active{
                    border-bottom: 2px solid #007AFF;
                }
            }
        }
        .tap__content{
            padding: 20px 30px 30px;
            .content__item{
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid rgba(198,203,212,0.3);
                .label{
                    color: #5E6875;
                    margin-right: 6px;
                }
                .click-able-color{
                    color: #007AFF;
                }
            }
        }
    }
}
</style>

