<template>
    <div v-if="isShowGuide" class="beginner-guide" :class="$i18n.locale">
        <div v-if="guideType ===  'assets'" class="assets-back"></div>
        <div class="item" :class="guideType" v-for="(item, i) in $t(`guide.${guideType}`)" :key="i"
             v-show="guideStep === i">
            <div v-if="guideType" class="icon">
                <div v-if="i === 1 && guideType === 'trade'">
                    <span>{{ $t('tradeOpenOrders.title') }}</span>
                    <span>{{ $t('tradeOrderHistory.title') }}</span>
                </div>
                <div v-if="i === 2 && guideType === 'trade'">
                    <span>{{ $t('tradeMining.title') }}</span>
                    <span>{{ $t('tradeDividend.title') }}</span>
                </div>

                <span v-if="guideType === 'assets'" class="tab">
                    {{ [
                        $t('tokenCard.actionType.EXCHARGE'),
                        $t('tokenCard.actionType.EXWITHDRAW'),
                        `${$t('tokenCard.actionType.CHARGE')}    ${$t('tokenCard.actionType.WITHDRAW')}`
                    ][i] }}
                </span>
            </div>
            <div class="close __pointer" @mouseenter="overClose" @mouseleave="leaveClose" @click="close">
                <div class="tips" v-show="isShowTips">{{ $t('guide.closeTips') }}</div>
            </div>
            <div class="content">{{ item }}</div>
            <div class="next-wrapper">
                <div class="next __pointer" @click="next">
                    {{ i === $t(`guide.${guideType}`).length - 1 ? $t('guide.close') : $t('guide.next') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import storage from 'utils/store';

const GuideKey = 'beginnerGuide';

export default {
    mounted() {
        this.setGuide();
    },
    data() {
        return {
            storeData: '',
            isShowGuide: false,
            isShowTips: false,
            guideStep: 0,
            guideType: ''
        };
    },
    methods: {
        setGuide() {
            let guideType = '';
            if (this.$route.name === 'tradeCenter') {
                guideType = 'trade';
            } else if (this.$route.name === 'assets') {
                guideType = 'assets';
            }
            this.guideType = guideType;

            this.storeData = storage.getItem(GuideKey);
            this.isShowGuide = !this.storeData || this.storeData.indexOf(this.guideType) === -1;
        },
        next() {
            this.guideStep++;
            if (this.guideStep >= this.$t(`guide.${ this.guideType }`).length) {
                this.close();
            }
        },
        close() {
            this.isShowGuide = false;
            storage.setItem(GuideKey, (this.storeData || '') + this.guideType);
        },
        overClose() {
            this.isShowTips = true;
        },
        leaveClose() {
            this.isShowTips = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.beginner-guide {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(0,0,0,0.3);
}

.assets-back {
    position: absolute;
    top: 285px;
    left: 10px;
    width: calc(100% - 20px);
    height: 75px;
    background: url('~assets/imgs/assets_guide_zh.jpg');
    background-size: 100% 100%;
}

.item {
    position: absolute;
    max-width: 250px;
    padding: 12px;
    box-sizing: border-box;
    background: rgba(255,255,255,1);
    box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);
    font-size: 12px;
    @include font-family-bold();
    font-weight: 600;
    .icon {
        position: absolute;
        background: #fff;
        border: 1px dashed #000;
        border-radius: 2px;
        padding: 7px 12px;
        box-sizing: border-box;
    }
    .close {
        position: relative;
        float: right;
        width: 28px;
        height: 28px;
        background: url('~assets/imgs/close.svg') no-repeat top right;
        background-size: 16px 16px;
        .tips {
            position: absolute;
            transform: translateY(-100%);
            top: -20px;
            right: -50%;
            white-space: nowrap;
            background: rgba(255,255,255,0.8);
            padding: 6px;
            border-radius: 2px;
            @include font-family-normal();
        }
    }
    .content {
        margin: 28px 0 12px;
        color: rgba(29,32,36,1);
        line-height: 16px;
    }
    .next-wrapper {
        height: 30px;
    }
    .next {
        float: right;
        width: 70px;
        height: 30px;
        line-height: 30px;
        background: rgba(0,122,255,1);
        border-radius: 2px;
        color: rgba(255,255,255,1);
        text-align: center;
    }
    &:after {
        position: absolute;
        display: inline-block;
        content: ' ';
        border: 6px solid transparent;
    }
}

.en .trade.item {
    &:nth-child(2) {
        left: 210px;
    }
    &:nth-child(3) {
        left: 425px;
    }
}
.trade.item {
    &:first-child, &:nth-child(4) {
        top: 109px;
        left: 60px;
        &:after {
            border-right: 6px solid #fff;
            top: 8px;
            left: -12px;
        }
        .icon {
            top: 0;
            left: -10px;
            transform: translateX(-100%);
            width: 30px;
            height: 30px;
            background: url('~assets/imgs/assets_gray.svg') center;
            background-size: 100% 100%;
        }
    }
    &:nth-child(2), &:nth-child(3) {
        top: 55px;
        left: 200px;
        &:after {
            border-bottom: 6px solid #fff;
            top: -12px;
            left: 20px;
        }
        .icon {
            top: -17px;
            left: -45px;
            transform: translateY(-100%);
            span {
                line-height: 16px;
                color: #BDC1D1;
                font-size: 13px;
                @include font-family-bold();
                font-weight: 600;
                display: inline-block;
                box-sizing: border-box;
                height: 100%;
                white-space: nowrap;
                text-align: center;
                &:first-child {
                    margin-right: 28px;
                }
            }
        }
    }
    &:nth-child(3) {
        left: 360px;
    }
    &:nth-child(4) {
        top: 250px;
        .icon {
            background: url('~assets/imgs/wallet_default.svg') center;
        }
    }
}

.assets.item {
    top: 195px;
    .icon {
        word-break: keep-all;
        white-space: nowrap;
        line-height: 16px;
        color: #007aff;
        bottom: -20px;
        transform: translateY(100%);
    }

    &:after {
        border-top: 6px solid #fff;
        bottom: -12px;
        left: 50%;
        margin-left: -6px;
    }

    &:nth-child(2) {
        left: 15%;
    }

    &:nth-child(3) {
        right: 30%;
    }

    &:nth-child(4) {
        right: 50%;
    }
}

</style>
