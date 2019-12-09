<template>
    <div class="totop __btn __btn_all_in __pointer" @click="startAutoReceive">
        {{ !isActive ? 'Auto Receive Tx' : 'Auto Receiving....' }}
    </div>
</template>

<script>
import { accountBlock as accountBlockUtils } from '@vite/vitejs';
import { viteClient } from 'services/apiServer';

let autoReceiveTimer = null;

export default {
    props: {
        address: {
            type: String,
            default: ''
        },
        privateKey: {
            type: String,
            default: ''
        }
    },
    destroyed() {
        autoReceiveTimer && clearTimeout(autoReceiveTimer);
    },
    data() {
        return { isActive: false };
    },
    methods: {
        startAutoReceive() {
            if (this.isActive) {
                return;
            }
            this.isActive = true;

            const loop = async () => {
                try {
                    await this.receiveTx();
                } catch (err) {
                    console.warn(err);
                }
                autoReceiveTimer = setTimeout(() => {
                    loop();
                }, 2000);
            };
            loop();
        },

        async receiveTx() {
            const data = await viteClient.request('ledger_getUnreceivedBlocksByAddress', this.address, 0, 1);
            if (!data || !data.length) {
                console.log('[LOG] No Unreceived Blocks');
                return;
            }

            const accountBlock = accountBlockUtils.createAccountBlock('receive', {
                address: this.address,
                sendBlockHash: data[0].hash
            }).setProvider(viteClient).setPrivateKey(this.privateKey);

            await accountBlock.autoSetPreviousAccountBlock();
            return accountBlock.sendByPoW();
        }
    }
};
</script>
