<template lang="pug">
extends /components/dialog/base.pug
block content
    .col
        .trans-icon
          img(:src="rightCircle")
          .line
          .circle
        .row
            .card
                img.net-icon(:src='networkPair.from.icon')
                .confirm-info
                    .trans-info
                        .amount {{transInfo.amount+' '+tokenInfo.token}}
                        .tx-hash(:class="{pending:!tx.fromHash}") {{tx.fromHash?tx.fromHash:'pending'}}
                    .confirms
                        .address(@click="addressClick(transInfo.fromAddress)") From {{transInfo.fromAddress}}
                        .nums ({{(tx.confirms||0)+'/'+(tx.totalConfirms||0)}})
            .card
                img.net-icon(:src='networkPair.to.icon')
                .confirm-info
                    .trans-info
                        .amount {{transInfo.amount+' '+tokenInfo.token}}
                        .tx-hash(:class="{pending:!tx.toHash}") {{tx.toHash?tx.toHash:'pending'}}
                    .confirms
                        .address(@click="addressClick(transInfo.toAddress)") To {{transInfo.toAddress}}
</template>
<script>
// {
// 	id:string,
// 	idx:number,
// 	amount:string,
// 	toAddress:string,
// 	fromHash:string,
// 	fromHashConfirmationNums: number,
// 	toHash: string,
// 	toHashConfirmationNums: number
// }
import rightCircle from 'assets/imgs/crossBridge/right.png';
import execCopy from 'utils/copy';
import { getTx } from 'pcServices/conversion';
import { timer } from 'utils/asyncFlow';

export default {
    props: [ 'networkPair', 'tokenInfo', 'transInfo' ],
    data() {
        return {
            dTitle: 'Confirm',
            tx: {},
            rightCircle,
            ShowBottom: false,
            loopTimer: null
        };
    },
    mounted() {
        const { inputId, fromAddress, toAddress } = this.transInfo;
        this.loopTimer = new timer(() => {
            getTx({
                from: fromAddress,
                to: toAddress,
                id: inputId
            });
        });
        this.loopTimer.start();
    },
    beforeDestroy() {
        this.loopTimer?.stop();
    },
    computed: {},
    methods: {
        addressClick(value) {
            execCopy(value);
            this.$toast(this.$t('hint.copy'));
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
.col {
    display: flex;
    align-items: center;
    .trans-icon {
        height: 142px;
        width: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 30px;
        img {
            height: 20px;
            width: 20px;
        }
        .line {
            flex-grow: 1;
            width: 2px;
            background-color: rgba($blue-color-1, 0.45);
        }
        .circle {
            height: 18px;
            width: 18px;
            box-sizing: border-box;
            border-radius: 50%;
            border: 3px solid rgba($blue-color-1, 0.45);
        }
    }
    .row {
        display: flex;
        flex-direction: column;

        .card {
            display: flex;
            padding: 30px 15px;
            height: 100px;
            width: 408px;
            box-sizing: border-box;
            &:not(:first-child) {
                margin-top: 30px;
            }
            @include box_shadow();
            .net-icon {
                height: 40px;
                width: 40px;
                flex-shrink: 0;
                border-radius: 50%;
                margin-right: 15px;
            }

            .confirm-info {
                display: flex;
                justify-content: space-between;
                width: 100%;
                font-size: 14px;
                min-width: 200px;
                .confirms {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-shrink: 1;
                    .address {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        white-space: nowrap;
                        max-width: 210px;
                    }
                }

                .trans-info {
                    display: flex;
                    flex-direction: column;
                    margin-right: 10px;
                    flex-shrink: 1;
                    .amount {
                        margin-bottom: 8px;
                        @include font-family-bold();
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        white-space: nowrap;
                        max-width: 100px;
                    }
                    .tx-hash {
                        @include font_color_2();
                        &.pending {
                            color: #44d7b6;
                        }
                    }
                }
            }
        }
    }
}
</style>
