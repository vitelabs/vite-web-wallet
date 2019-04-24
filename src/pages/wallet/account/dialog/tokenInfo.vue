<template lang="pug">
extends /components/dialog/base.pug
block head
    .head
        .head__name {{token.tokenName}}
            .head__name__gate(v-if="token.gateInfo.name")
        .head__symbol {{token.tokenSymbol}}
    .tab
        .tab__item(@click="tabClick('tokenInfo')" :class="{active:tabName==='tokenInfo'}") 详情
        .tab__item(v-if="token.type!=='NATIVE'" @click="tabClick('gate')" :class="{active:tabName==='gate'}") gate_way详情
block content
    .tab-content(v-if="tabName==='tokenInfo'")
        .content__item.click-able-color
            .label Token_Id
            div {{token.tokenId}}
        .content__item
            .label 铸币地址
            div {{token.owner}}
        .content__item
            .label 代币名称
            div {{token.tokenName}}
        .content__item
            .label 发行总量
            div {{token.totalSupply}}
        .content__item
            .label 小数点
            div {{token.decimals}}
        .content__item
            .label 可增发
            div {{token.isReIssuable?'是':'否'}}
    .tab-content(v-if="tabName==='gate'")
        .content__item(v-if="token.type==='THIRD_GATE'")
            .label 网关官网：
        .content__item(v-if="token.type==='THIRD_GATE'")
            .label 网关介绍：
        .content__item(v-if="token.type==='THIRD_GATE'")
            .label 网关发行代币
        .content__item(v-if="token.type==='OFFICAL_GATE'||token.type==='THIRD_GATE'")
            .label 网关设置
            input.gate-url(:placeholder="'请输入网关链接地址'" :disable="token.type==='OFFICAL_GATE'" v-model="url")
</template>

<script>
import { wallet } from 'utils/wallet';
import { gateStorage, getChargeAddr } from 'services/gate';


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
        return {
            tabName: tokenEnum.TOKEN_INFO,
            urlCache: this.token.gateInfo.url,
            dTitle: `${ this.token.tokenSymbol }代币信息`
        };
    },
    computed: {
        url: {
            get:function() {
                if (this.token.type === 'OFFICAL_GATE') {
                    return this.token.gateInfo.url;
                }
                return this.urlCache;
            },
            set:function(val) {
                this.urlCache = val.trim();
            }
        },
        dSTxt() {
            if (this.token.type === 'THIRD_GATE'&&this.tabName==='gate') {
                return '保存修改';
            }
            return '';
        },
        dBtnUnuse() {
            return !this.urlCache;
        }
    },
    beforeMount(){
        window.sssss=this;
    },
    methods: {
        inspector() {
            return new Promise((res, rej) => {
                getChargeAddr({ addr: wallet.defaultAddr, tokenId: this.token.tokenId }, this.url).then(() => {
                    gateStorage.bindToken(this.token.tokenId, { gateInfo: { url: this.url } });
                    res({ url: this.url });
                }).catch((e) => {
                    debugger
                    this.$toast('节点无效');
                    rej(e);
                });
            });
        },
        tabClick(name) {
            this.tabName = name;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.head {
    border-bottom: 1px solid #D4DEE7;
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
            background-color: rgba(0,122,255,0.06);;
            font-family: $font-normal;
            font-size: 12px;
            height: 20px;
            padding: 0 4px;
            margin-left: 6px;
            line-height: 20px;
            display: flex;
        }
    }
    &__symbol {
        font-size: 12px;
        color: rgba(94, 104, 117, 1);
    }
}
.tab{
    padding-left: 30px;
    height: 50px;
    display: flex;
    border-bottom: 1px solid #D4DEE7;
    &__item{
        height: 100%;
        box-sizing: border-box;
        margin-right: 40px;
        color: #5E6875;
        display: flex;
        align-items: center;
        cursor:pointer;
        &.active{
            border-bottom: 2px solid #007AFF;
        }
    }
}
.tab-content{
    .content__item{
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid rgba(198,203,212,0.3);
        display: flex;
        font-size: 14px;
        .label{
            color: #5E6875;
            margin-right: 6px;
            word-break: keep-all;
        }
        .click-able-color{
            color: #007AFF;
        }
    }
}

</style>

