<template>
    <div class="pow-process-wrapper">
        <div class="pow">{{ $t('pow') }}</div>
        <div class="loading-wrapper __pointer">
            <div class="loading-ring"> <div></div> </div>
            <div class="process-num">{{ processNum + '%' }}</div>
        </div>
        <div v-show="isShowCancel" @click="_cancel" class="btn __pointer">{{ $t('btn.cancel') }}</div>
    </div>
</template>

<script>
let processTimeout;

export default {
    props: {
        cancel: {
            type: Function,
            default: () => {}
        },
        isShowCancel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            processNum: 0
        };
    },
    mounted() {
        let addProcessNum = () => {
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
    destroyed() {
        this.clearProcessTimeout();
    },
    methods: {
        clearProcessTimeout() {
            window.clearTimeout(processTimeout);
            processTimeout = null;
        },
        gotoFinish() {
            this.clearProcessTimeout();
            this.processNum = 100;
        },
        _cancel() {
            this.clearProcessTimeout();
            this.cancel();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.pow-process-wrapper {
    font-family: $font-bold;
    width: 90%;
    max-width: 460px;
    padding: 50px 0 40px;
    background-image: linear-gradient(148deg, #052EF5 0%, #0BB6EB 100%);
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    display: flex;
    justify-content: center;    
    flex-direction: column;
    .pow {
        text-align: center;
        font-size: 24px;
        color: #FFFFFF;
        margin-bottom: 36px;
    }
    .btn {
        position: relative;
        width: 180px;
        height: 44px;
        line-height: 44px;
        border: 2px solid #FFFFFF;
        border-radius: 2px;
        font-size: 16px;
        color: #FFFFFF;
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
    background: #FFFFFF;
    border: 1px solid #F6F5F5;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 68px;
    .process-num {
        font-size: 32px;
        color: #000A12;
        text-align: center;
        line-height: 170px;
    }
}

// loading
.loading-ring {
    box-sizing: border-box;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -60px;
    margin-left: -60px;
    width: 120px;
    height: 120px;
    border: 6px solid #dfdfdf;
    border-radius: 50%;
}
.loading-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    top: -6px;
    right: -6px;
    width: 120px;
    height: 120px;
    border: 6px solid #195ADD;
    border-radius: 50%;
    animation: lds-ring 1.2s linear infinite;
    border-color: #195ADD #195ADD #195ADD transparent;
}
@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>