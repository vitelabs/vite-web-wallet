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
                        .address(@click="addressClick(transInfo.fromAddress)") From {{transInfo.fromAddress}}
                    .confirms
                        .tx-hash(:class="{pending:!tx.fromHash}" @click="tx.fromHash&&addressClick(tx.fromHash)")
                            |{{tx.fromHash?tx.fromHash:'pending'}}
                            Loading(loadingType="dot" v-show="!tx.fromHash" :dotSize="1" class="confirm-loading")
                        .nums ({{(tx.fromHashConfirmationNums||0)+'/'+(networkPair.from.confirmedThreshold||0)}})
            .card
                img.net-icon(:src='networkPair.to.icon')
                .confirm-info
                    .trans-info
                        .amount {{transInfo.amount+' '+tokenInfo.token}}
                        .address(@click="addressClick(transInfo.toAddress)") To {{transInfo.toAddress}}
                    .confirms
                        .tx-hash(:class="{pending:!tx.toHash}" @click="tx.toHash&&addressClick(tx.toHash)")
                            | {{tx.toHash?tx.toHash:'pending'}}
                            Loading(loadingType="dot" v-show="!tx.toHash" :dotSize="1" class="confirm-loading")
                        .nums ({{(tx.toHashConfirmationNums||0)+'/'+(networkPair.to.confirmedThreshold||0)}})

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
            // const data = {
            //     code: 0,
            //     data: {
            //         id:
            //             '0xdb87d64f7847f146aab26a657c00adcd08a2697b07661065ba5bc7ffe5b17d0e',
            //         idx: '2',
            //         amount: '121000000000000000',
            //         fromAddress: '0xea71ff0553eF77cc3Ca6b5ad82662BCe50E7f068',
            //         toAddress: '0xb90388add928d41c114b0fb65471c4a6c70595eb00',
            //         token: 'USDV',
            //         fromNet: 'BSC',
            //         fromHash:
            //             '0x5960e20e1725d8d7cf56032fe854e00cb4d748a842e97f2b3d3b4c4c30714051',
            //         fromHashConfirmedHeight: 14583821,
            //         fromHashConfirmationNums: 13797,
            //         fee: '0',
            //         time: 1638329455,
            //         toNet: 'VITE',
            //         toHash:
            //             '0x21676d28b8915e8a32cd5ea4367d4d1373901513ba391e80bda03d90f696a78e',
            //         toHashConfirmedHeight: 3074523,
            //         toHashConfirmationNums: 39407
            //     }
            // };
            // this.tx = data.data || this.tx;
            getTx({
                from: fromAddress,
                to: toAddress,
                id: inputId
            }).then(data => {
                this.tx = data || this.tx;
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
                flex-direction: column;
                width: 100%;
                font-size: 14px;
                min-width: 200px;

                .trans-info {
                    display: flex;
                    justify-content: space-between;
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
                    .address {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        white-space: nowrap;
                        max-width: 210px;
                    }
                }
                .confirms {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-shrink: 1;
                    .tx-hash {
                        @include font_color_2();
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                        white-space: nowrap;
                        max-width: 210px;
                        &.pending {
                            color: #44d7b6;
                            /deep/ .confirm-loading {
                                margin-left: 5px;
                                .dot {
                                    div {
                                        background: #44d7b6;
                                        width: 4px;
                                        height: 4px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
