<template>
    <div class="sync-block-wrapper">
        <span class="status-text" v-show="statusText && statusText !== 'sync'">
            {{ statusText ? $t(`nav.${statusText}`) : '' }}
        </span>

        <span v-show="!statusText">----</span>

        <span v-show="statusText.indexOf('first') !== -1">{{
            `${currentHeight} / ${targetHeight}`
        }}</span>

        <img src="../assets/imgs/sync_icon.svg"
             v-show="statusText !== 'firstDone' && statusText !== 'sync'" 
             @click="reloadBlock"
             :class="{
                 'icon': true,
                 'loading': reloading || statusText === 'noNet' || statusText === 'noP2P'
        }"/>
        <img src="../assets/imgs/done_icon.svg" class="icon" v-show="statusText === 'firstDone'" />


        <span v-show="statusText === 'sync'">
            {{ $t(`nav.blockHeight`) + ': ' + blockHeight }}
        </span>


    </div>
</template>

<script>
let p2pEvent = null;
let blockEvent = null;
let netEvent = null;
let heightTimeout = null;

export default {
    data() {
        return {
            currentHeight: '',
            targetHeight: '',
            status: null,
            statusText: '',
            netStatus: false,
            reloading: false,

            blockHeight: '0'
        };
    },
    mounted() {
        blockEvent = webViteEventEmitter.on('syncInfo', (blockInfo) => {
            this.syncData(blockInfo);
        });
        p2pEvent = webViteEventEmitter.on('p2pStatus', (netStatus) => {
            this.netStatus = netStatus;
        });
        netEvent = webViteEventEmitter.on('netStatus', (status) => {
            this.updateStatusText(null, status);
        });

        this.netStatus = viteWallet.Net.getP2PStatus();
        this.syncData( viteWallet.Ledger.getSyncInfo() );

        this.startBlockHeight();
    },
    destroyed() {
        webViteEventEmitter.off(blockEvent);
        webViteEventEmitter.off(p2pEvent);
        webViteEventEmitter.off(netEvent);
        this.stopBlockHeight();
    },
    watch: {
        status: function(val, oldVal) {
            val === 2 && webViteEventEmitter.off(blockEvent);
            this.updateStatusText(oldVal);
        },
        netStatus: function() {
            this.updateStatusText(null, -1);
        }
    },
    methods: {
        reloadBlock() {
            if (this.reloading || this.statusText === 'noNet') {
                return;
            }

            this.reloading = true;
            viteWallet.Ledger.reloadSyncInfo().then((data) => {
                setTimeout(()=>{
                    this.reloading = false;
                }, 200);
                this.syncData(data);
            }).catch((err)=>{
                this.reloading = false;
                console.warn(err);
            });
        },

        stopBlockHeight() {
            window.clearTimeout(heightTimeout);
            heightTimeout = null;
        },
        startBlockHeight() {
            let reGet = () => {
                heightTimeout = setTimeout(()=>{
                    this.stopBlockHeight();
                    this.startBlockHeight();
                }, 2000);
            };

            viteWallet.Ledger.getBlockHeight().then((data) => {
                this.blockHeight = data;
                reGet();
            }).catch((err)=>{
                console.warn(err);
                reGet();
            });
        },

        updateStatusText(oldVal, clientNet = -1) {
            // Client has no network.
            if (!clientNet) {
                this.statusText = 'noNet';
                return;
            }

            // No node connection
            if (!this.netStatus) {
                this.statusText = 'noP2P';
                return;
            }

            // Waiting for initialization 
            if (this.status === 0) {
                this.statusText = '';
                return;
            }

            // Initing
            if (this.status === 1) {
                this.statusText = 'firstDoing';
                return;
            }

            // Block synchronization completed
            if (oldVal === null && this.status === 2) {
                this.statusText = 'sync';
                return;
            }

            this.statusText = 'firstDone';
            let textTimeout = window.setTimeout(()=>{
                window.clearTimeout(textTimeout);
                textTimeout = null;
                this.statusText = 'sync';
            }, 500);
        },
        syncData({
            targetHeight, currentHeight, status
        }) {
            this.targetHeight = targetHeight;
            this.currentHeight = currentHeight;
            this.status = status;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.sync-block-wrapper {
    font-family: $font-bold;
    font-size: 16px;
    color: #1D2024;
    line-height: 20px;
    .status-text {
        margin-right: 10px;
    }
    .icon {
        width: 16px;
        height: 16px;
        margin-bottom: -4px;
        margin-left: 20px;
        &.loading {
            animation: rotate 0.7s linear infinite;
        }
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
