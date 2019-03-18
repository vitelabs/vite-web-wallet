<template>
    <div class="gray-wrapper" v-if="isShow">
        <div class="pow-process-wrapper">
            <div class="pow">{{ $t('pow') }}</div>
            <div class="loading-wrapper __pointer">
                <loading></loading>
                <div class="process-num">{{ processNum + '%' }}</div>
            </div>
            <div v-show="isShowCancel" @click="_cancel" class="btn __pointer">{{ $t('btn.cancel') }}</div>
        </div>
    </div>
</template>

<script>
import loading from 'components/loading';
import { getPowNonce } from 'services/pow';
import $ViteJS from 'utils/viteClient';

let processTimeout;

export default {
    components: {
        loading
    },
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
            processNum: 0,
            isShow: false
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
            this.isShow = false;
            this.cancel();
        },
        async startPowTx(accountBlock, startTime, difficulty) {
            let now = new Date().getTime();
            if (startTime && now - startTime > 2000) {
                accountBlock.prevHash = null;
                accountBlock.height = null;
                accountBlock.snapshotHash = null;
                try {
                    accountBlock = await $ViteJS.buildinTxBlock.getAccountBlock.async(accountBlock);
                } catch(e) {
                    this.isShow = false;
                    this.$emit('pow-finish');
                    return Promise.reject(e, 0);
                }
            }

            this.isShow = true;
            const activeAccount = this.$wallet.getActiveAccount();

            return new Promise((res, rej) => {
                getPowNonce(activeAccount.getDefaultAddr(), accountBlock.prevHash, difficulty).then((data) => {
                    accountBlock.difficulty = data.difficulty;
                    accountBlock.nonce = data.nonce;

                    if (!this.isShow) {
                        return;
                    }

                    this.stopPow(() => {
                        activeAccount.sendRawTx(accountBlock).then(data => {
                            this.isShow = false;
                            res(data);
                        }).catch(e => {
                            this.isShow = false;
                            rej(e, 1);
                        });
                    });
                }).catch((e) => {
                    this.isShow = false;
                    this.$emit('pow-finish');
                    rej(e, 0);
                });
            });
        },
        stopPow(cb) {
            this.gotoFinish();
            setTimeout(() => {
                this.isShow = false;
                this.$emit('pow-finish');
                cb && cb();
            }, 1000);
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
    font-family: $font-bold, arial, sans-serif;
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
        color: #ffffff;
        margin-bottom: 36px;
    }
    .btn {
        position: relative;
        width: 180px;
        height: 44px;
        line-height: 44px;
        border: 2px solid #ffffff;
        border-radius: 2px;
        font-size: 16px;
        color: #ffffff;
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
    background: #ffffff;
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
