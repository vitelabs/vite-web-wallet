<template>
    <div class="confirm-container" :class="classStr">
        <div class="confirm-wrapper">
            <div class="title" :class="{'__ellipsis': !closeIcon}">
                {{ title }}
                <span v-show="closeIcon" @click="close" class="close-icon __pointer"></span>
            </div>

            <div class="content-wrapper" >
                <img v-if="type === 'generalTips'" class="general-tips-icon" src="~assets/imgs/general-tips.svg"/>
                <div v-if="content" style="white-space: pre-line;">{{ content }}</div>
                <slot></slot>
            </div>

            <div v-show="singleBtn || leftBtnTxt || rightBtnTxt"
                 class="bottom" :class="{'single': singleBtn}">
                <div v-show="singleBtn" class="btn btn-single btn-blue __pointer"
                     :class="{'btn-gray': btnUnuse && !isLoading }"
                     @click="_leftBtnClick">
                    <span v-show="!isLoading">{{ leftBtnTxt }}</span>
                    <loading v-show="isLoading" loadingType="dot"></loading>
                </div>
                <div v-show="!singleBtn" class="btn btn-border __pointer"
                     @click="_leftBtnClick">{{ leftBtnTxt }}</div>
                <div v-show="!singleBtn" class="btn btn-blue __pointer"
                     :class="{'btn-gray': btnUnuse && !isLoading }"
                     @click="_rightBtnClick">
                    <span v-show="!isLoading">{{ rightBtnTxt }}</span>
                    <loading v-show="isLoading" loadingType="dot"></loading>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import loading from 'components/loading.vue';

export default {
    components: { loading },
    props: {
        size: {
            type: String,
            default: ''
        },
        // description / generalTips
        type: {
            type: String,
            default: ''
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        showMask: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ''
        },
        closeIcon: {
            type: Boolean,
            default: false
        },
        close: {
            type: Function,
            default: () => {}
        },
        singleBtn: {
            type: Boolean,
            default: false
        },
        leftBtnTxt: {
            type: String,
            default: ''
        },
        rightBtnTxt: {
            type: String,
            default: ''
        },
        leftBtnClick: {
            type: Function,
            default: () => {}
        },
        rightBtnClick: {
            type: Function,
            default: () => {}
        },
        btnUnuse: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        }
    },
    computed: {
        classStr() {
            return `${ this.size } ${ this.type } ${ this.showMask ? 'gray' : '' }`;
        }
    },
    methods: {
        _rightBtnClick() {
            if (this.btnUnuse || this.isLoading) {
                return;
            }
            this.rightBtnClick && this.rightBtnClick();
        },
        _leftBtnClick() {
            if (this.singleBtn && (this.btnUnuse || this.isLoading)) {
                return;
            }
            this.leftBtnClick && this.leftBtnClick();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./confirm.scss";
@import "./confirmRow.scss";
</style>
