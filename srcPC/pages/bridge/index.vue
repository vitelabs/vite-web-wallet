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
                    <div class="bri__network__card">
                        <div class="network__title">
                            <div class="content">From</div>
                            <div class="status">Connected</div>
                        </div>
                        <div class="network__content">
                            <div>Network</div>
                            <div>downArrow</div>
                        </div>
                        <div class="network__icon">tokenIcon</div>
                    </div>
                    <div class="bri__trans-icon">transIcon</div>
                    <div class="bri__network__card">
                        <div class="network__title">
                            <div class="content">From</div>
                            <div class="status">Connected</div>
                        </div>
                        <div class="network__content">
                            <div>Network</div>
                            <div>downArrow</div>
                        </div>
                        <div class="network__icon">tokenIcon</div>
                    </div>
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

export default {
    components: { pageLayout, ViteInput, searchTips, viteSelect },
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
        width: 644px;
        height: 680px;
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
                width: 64px;
            }
            &__card {
                display: flex;
                flex-direction: column;
                width: 244px;
                height: 136px;
                @include common_border();
                border-radius: 2px;
                padding: 20px 12px;
                box-sizing: border-box;
                @include box_shadow();
                .network__title {
                    display: flex;
                    justify-content: space-between;
                }
                .network__content {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                .network__icon {
                    margin-top: 20px;
                    height: 35px;
                }
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
                    margin-right: 62px;
                }

                .progress-line {
                    height: 2px;
                    background-color: rgba($blue-color-1, 0.4);
                    position: absolute;
                    left: 70px;
                    top: 12px;
                    width: 162px;
                }
                .progress-text {
                    white-space: nowrap;
                }
                &--pending {
                    .progress-icon {
                        width: 24px;
                        height: 24px;
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
                        margin-top: 4px;
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
