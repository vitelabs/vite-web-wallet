<template>
    <page-layout>
        <div class="bridge-wrapper">
            <div class="bridge-content">
                <div class="bri__title">Choose Asset</div>
                <viteSelect
                    :onSelected="onSelectd"
                    :options="tokenList"
                    :searchable="false"
                    :clearable="false"
                    :class="'sfd'"
                ></viteSelect>
                <div class="bri__network">
                    <networkCard
                        :type="'from'"
                        :status="'connected'"
                        :network="'VITE'"
                    />
                    <div class="bri__trans-icon">
                        ···<rightDouble style="height:20;width:20" />
                    </div>
                    <networkCard
                        :type="'from'"
                        :status="'connected'"
                        :network="'ETH'"
                    />
                </div>
                <div>
                    <div class="__row">
                        <div class="__row_t">
                            Amount
                            <span class="__row_hint">Balance:122</span>
                        </div>
                        <vite-input>
                            <slot name="after">MAX</slot>
                        </vite-input>
                    </div>

                    <div class="__row">
                        <div class="__row_t">
                            Destination Address
                            <span v-show="amountErr" class="__err">{{
                                amountErr
                            }}</span>
                        </div>
                        <vite-input>
                            <span slot="after" class="__all_wrapper __pointer">
                                <span class="__all">{{
                                    $t('tradeAssets.all')
                                }}</span>
                            </span>
                        </vite-input>
                    </div>
                </div>
                <div class="__row clearfix">
                    <div
                        class="__form_btn"
                        style="width:100%"
                        @click="onNextClick"
                    >
                        Next
                    </div>
                </div>
                <div class="__row">
                    <div class="__row-tips">
                        <div><span class="red-dot"></span>Reminder</div>
                        <div>max 111</div>
                        <div>min 2222</div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-point progress-point--pending">
                        <div class="progress-icon"></div>
                        <div class="progress-text">Choose Chain&Asset</div>
                        <div class="progress-line"></div>
                    </div>
                    <div class="progress-point progress-point--pending">
                        <div class="progress-icon"></div>
                        <div class="progress-text">Connect Wallet</div>
                        <div class="progress-line"></div>
                    </div>
                    <div class="progress-point progress-point--pending">
                        <div class="progress-icon"></div>
                        <div class="progress-text">Send transaction</div>
                        <div class="progress-line"></div>
                    </div>
                    <div class="progress-point progress-point--todo">
                        <div class="progress-icon"></div>
                        <div class="progress-text">Success</div>
                    </div>
                </div>
            </div>
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'pcComponents/pageLayout/index';
import searchTips from 'src/uiKit/searchTips';
import viteSelect from 'src/uiKit/viteSelect';

import ViteInput from 'components/viteInput.vue';
import { confirmBriTxDialog } from 'pcComponents/dialog';

import 'vue-select/dist/vue-select.css';
import { defaultTokenMap } from 'utils/constant';
import networkCard from './networkCard.vue';
import rightDouble from 'assets/imgs/rightDouble.svg.vue';
export default {
    components: {
        pageLayout,
        ViteInput,
        searchTips,
        viteSelect,
        networkCard,
        rightDouble
    },
    data() {
        return {
            tokenList: Object.values(defaultTokenMap).map(t => {
                return {
                    value: t.tokenId,
                    label: t.tokenSymbol,
                    icon: t.icon
                };
            })
        };
    },
    methods: {
        async onNextClick() {
            await confirmBriTxDialog();
        },
        onSelected(v) {
            console.log(99999, v);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
@import 'pcComponents/confirm/confirmRow.scss';
@import '~pc/styles/form.scss';

.bridge-wrapper {
    width: 100%;
    height: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    .bridge-content {
        width: 630px;
        height: 810px;
        box-sizing: border-box;
        position: relative;
        @include bg_color_2();

        @include common_font_color();
        border-radius: 2px;
        box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
        padding: 40px;
        .bri__title {
            margin-bottom: 20px;
            font-size: 18px;
        }
        .bri__network {
            display: flex;
            align-items: center;
            margin: 35px 0;
            .bri__trans-icon {
                width: 180px;
                font-size: 36px;
                color: #007aff;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .__row-tips {
            @include bg_color_tips();
            padding: 10px 20px;
            line-height: 24px;
            > div {
                &:first-child {
                    line-height: 32px;
                }
            }

            .red-dot {
                border-radius: 100%;
                height: 6px;
                width: 6px;
                background-color: #e02020;
                display: inline-block;
                margin-right: 8px;
            }
        }
        .progress-bar {
            display: flex;
            position: absolute;
            bottom: 50px;
            left: 15px;
            font-size: 12px;

            .progress-point {
                width: 120px;
                height: 56px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                &:not(:last-child) {
                    margin-right: 45px;
                }

                .progress-line {
                    height: 2px;
                    background-color: rgba($blue-color-1, 0.4);
                    position: absolute;
                    left: 70px;
                    top: 10px;
                    width: 145px;
                }
                .progress-text {
                    white-space: nowrap;
                }
                &--pending {
                    .progress-icon {
                        width: 20px;
                        height: 20px;
                        box-sizing: border-box;
                        border-radius: 100%;
                        border: 6px solid $blue-color-1;
                    }
                    @include font-family-bold();
                }
                &--todo {
                    .progress-icon {
                        width: 20px;
                        height: 20px;
                        box-sizing: border-box;
                        border-radius: 100%;
                        border: 3px solid rgba($blue-color-1, 0.4);
                    }
                    @include font_color_2();
                }
            }
        }
    }
}
</style>
