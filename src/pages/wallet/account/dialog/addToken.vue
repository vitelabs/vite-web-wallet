<template lang="pug">
extends /components/dialog/base.pug
block content
    search(v-model="userInput")
        .tips
            .item(v-for="token in searchRes" :class="{active:selectedTokens.indexOf(token.tokenId)>=0}")
                input(type="checkbox" name="addTokenSelected" v-model="selectedTokens" :value="token.tokenId" )
                img(:src="token.icon||token.tokenId|id2icon")
                .info
                    .title
                        .name {{token.tokenName}}
                        .tag {{token.gateInfo.name}}
                    .desc {{token.tokenId}}

</template>

<script>
import search from 'components/search';

const MAX_RES_NUMS = 10;
export default {
    components: { search },
    data() {
        return {
            selectedTokens: [],
            userInput: '',
            LTxt: '取消',
            RTxt: '添加'
        };
    },
    computed: {
        searchRes() {
            console.log(MAX_RES_NUMS);
            return [];
        },
        BtnUnuse() {
            return true;
        }
    }
};
</script>

<style lang="scss" scoped>
.tips{
    .item{
        display: flex;
        height: 52px;
        padding: 7px 15px;
        &.active,&:hover{
            background: rgba(0,122,255,0.03);
        }
        input{
            height: 16px;
            width: 16px;
        }
        img{
            margin: 0 12px;
            height: 20px;
            width: 20px;
        }
        .info{
            display: flex;
            flex-direction: column;
            .title{
                display: flex;
                .name{
                    color: #1D2024;
                    font-size: 14px;
                }
                .tag{
                    height: 16px;
                    font-size: 12px;
                    background-color: rgba(0,122,255,0.06);
                    color: #007AFF;
                    line-height: 16px;
                }
            }
        }
    }
}
</style>

