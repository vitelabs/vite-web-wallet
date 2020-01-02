<template>
    <div class="gray-wrapper" v-if="isShow">
        <div class="pow-process-wrapper">
            <div class="pow">{{ $t('pow.ing') }}</div>
            <div class="loading-wrapper __pointer">
                <loading></loading>
                <div class="process-num">{{ processNum + '%' }}</div>
            </div>
            <div class="pow no">{{ $t('pow.no') }}</div>
            <div v-show="isShowCancel" @click="_cancel" class="btn __pointer">{{ $t('btn.cancel') }}</div>
        </div>
    </div>
</template>

<script>
import loading from 'components/loading';

let processTimeout;
let limitTimeout;

export default {
    components: { loading },
    props: {
        cancel: {
            type: Function,
            default: () => {}
        },
        isShowCancel: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            processNum: 0,
            isShow: false,
            isTimeUp: false,
            timtUpCb: null
        };
    },
    destroyed() {
        this.clearProcessTimeout();
        this.clearLimitTimeout();
    },
    methods: {
        clearProcessTimeout() {
            window.clearTimeout(processTimeout);
            processTimeout = null;
        },
        clearLimitTimeout() {
            window.clearTimeout(limitTimeout);
            limitTimeout = null;
        },

        going() {
            const addProcessNum = () => {
                this.clearProcessTimeout();
                if (this.processNum >= 99) {
                    return;
                }
                this.processNum++;

                processTimeout = window.setTimeout(() => {
                    addProcessNum();
                }, 600);
            };
            addProcessNum();
        },
        _cancel() {
            this.clearProcessTimeout();
            this.isShow = false;
            this.cancel && this.cancel();
        },

        startCount() {
            this.isShow = true;
            this.isTimeUp = false;
            this.going();

            this.clearLimitTimeout();
            limitTimeout = setTimeout(() => {
                this.isTimeUp = true;
                this.clearProcessTimeout();
                this.processNum = 100;
                setTimeout(() => {
                    this.isShow = false;
                    this.timtUpCb && this.timtUpCb();
                }, 1000);
            }, 1500);
        },

        stopCount() {
            if (this.isTimeUp) {
                return Promise.resolve();
            }

            return new Promise(res => {
                this.timtUpCb = () => {
                    res();
                };
            });
        },

        stop() {
            this.clearLimitTimeout();
            this.isShow = false;
            this.isTimeUp = true;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.gray-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
}

.pow-process-wrapper {
    @include font-family-bold();
    width: 90%;
    max-width: 460px;
    padding: 50px 0 40px;
    background-image: linear-gradient(148deg, #052ef5 0%, #0bb6eb 100%);
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .pow {
        text-align: center;
        font-size: 24px;
        color: #fff;
        margin-bottom: 36px;
        &.no {
            margin-bottom: 0;
            margin-top: 36px;
            font-size: 16px;
        }
    }

    .btn {
        position: relative;
        width: 180px;
        height: 44px;
        line-height: 44px;
        border: 2px solid #fff;
        border-radius: 2px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        margin-top: 36px;
        left: 50%;
        margin-left: -90px;
    }
}

.loading-wrapper {
    position: relative;
    left: 50%;
    width: 170px;
    height: 170px;
    margin-left: -85px;
    background: #fff;
    border: 1px solid #f6f5f5;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 68px;

    .process-num {
        position: absolute;
        top: 2px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 32px;
        color: #000a12;
        text-align: center;
        line-height: 170px;
    }
}
</style>
