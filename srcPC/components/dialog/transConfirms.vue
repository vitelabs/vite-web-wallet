<template lang="pug">
extends /components/dialog/base.pug
block head
    .bri-trans__head {{ amount+" VITE"}}
block content
    .col
        .trans-icon
        .row
            .card
                img.net-icon(:src='networkPair.from.icon')
                .confirm-info
                    .trans-info
                        .amount {{amount+tokenSymbol}} 
                        .tx-hash {{networkPair.from.hash??'pending'}}
                    .confirms Confirms({{tx.confirms+'/'+tx.totalConfirms}})
            .card
                img.net-icon(:src='networkPair.from.icon')
                .confirm-info
                    .trans-info
                        .amount {{amount+tokenSymbol}} 
                        .tx-hash {{networkPair.from.hash??'pending'}}
                    .confirms To {{tx.toAddress}} 
</template>
<script>
export default {
    props:[
        'networkPair','tokenSymbol','tokenIcon','toAddress','fee','amount','estimateAmount','submitCb'
    ],
    data() {
        return { dTitle: 'Confirm', dSTxt: 'Confirm',tx:{} };
    },
    beforeMount() {},
    computed: {},
    methods: {
        inspector() {
            return submitCb();
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
.col{
    display: flex;
    align-items: center;
    .trans-icon{
        height: 142px;
            display: flex;
            flex-direction: column;
        }
        .row{
               display: flex; 
               .card{
                   display: flex;
                   padding:15px;
                   height: 100px;
                   width: 410px;
                   .trans-icon{
                       height: 40px;
                       width: 40px;
                   }
                   .confirm-info{
                       display: flex;
                       justify-content: space-between;
                       .trans-info{
                           display: flex;
                           flex-direction: column;
                           .amount{
                               margin-bottom: 8px;
                           }
                       }
                   }
               }
        }
}
</style>
