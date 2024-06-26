<template>
    <div class="staking-detail locking">
        <div class="item">
            <div>
                {{ $t("tradeDividend.lockedAmount") }}
                <span class="help __pointer">
                    <tooltips class="tips" :content="$t('tradeDividend.lockAmountTips')"></tooltips>
                </span>
            </div>
            <div class="bold">{{ vxLocked || 0 }} VX</div>
        </div>
        <div class="item no-border">
            <div>{{ $t("tradeDividend.unlockAmount") }}</div>
            <div class="bold">
                {{ vxUnlocking || 0 }} VX
                <span v-show="vxBalanceInfo.vxUnlocking" @click="showVxUnlockingDetails" class="down-icon __pointer"></span>
            </div>
        </div>

        <div class="operations">
            <div v-if="isInitAutoLock" @click="tooggleAutoLock" class="check">
                <Checkbox v-model="isAutoLock" :canClick="false" class="check-box"></Checkbox>
                {{ $t("tradeDividend.autoLock") }}
            </div>
            <div class="btn add __pointer" @click="showVXConfirm(true)">
                {{ $t("tradeDividend.lock") }}
            </div>
            <div v-show="!canIUnlock" class="btn unuse">
                {{ $t("tradeDividend.unlock") }}
            </div>
            <div v-show="canIUnlock" @click="showVXConfirm(false)" class="btn cancel __pointer">
                {{ $t("tradeDividend.unlock") }}
            </div>
        </div>

        <vx-confirm ref="vxConfirm"></vx-confirm>
        <vxUnlockingConfirm ref="vxUnlockingDetail"></vxUnlockingConfirm>
    </div>
</template>

<script>
import { doUntill } from '@utils/asyncFlow';
import bigNumber from '@utils/bigNumber';
import Checkbox from '@uiKit/checkbox.vue';
import tooltips from '@components/tooltips.vue';
import { getIsAutoLockMinedVx } from '@services/viteServer';
import { execWithValid } from '@pc/utils/execWithValid';
import sendTx from '@pc/utils/sendTx';
import { initPwd } from '@pc/components/password/index.js';
import vxConfirm from './vxConfirm.vue';
import vxUnlockingConfirm from './vxUnlockingConfirm.vue';

export default {
    components: { Checkbox, tooltips, vxConfirm, vxUnlockingConfirm },
    beforeMount() {
        this.getIsAutoLockMinedVx();
    },
    data() {
        return {
            isInitAutoLock: false,
            isAutoLock: false
        };
    },
    computed: {
        vxTokenInfo() {
            return this.$store.getters.vxTokenInfo || {};
        },
        vxTokenDecimals() {
            return this.vxTokenInfo.decimals;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        vxBalanceInfo() {
            return this.$store.getters.exVXBalanceInfo;
        },
        vxUnlocking() {
            const vxUnlocking = this.vxBalanceInfo.vxUnlocking || 0;
            return bigNumber.toBasic(vxUnlocking, this.vxTokenDecimals);
        },
        vxLocked() {
            const vxLocked = this.vxBalanceInfo.vxLocked || 0;
            return bigNumber.toBasic(vxLocked, this.vxTokenDecimals);
        },
        canIUnlock() {
            const minNumber = bigNumber.toMin(10, this.vxTokenDecimals);
            return +this.vxBalanceInfo.vxLocked && bigNumber.compared(minNumber, this.vxBalanceInfo.vxLocked) <= 0;
        }
    },
    watch: {
        address() {
            this.getIsAutoLockMinedVx();
        }
    },
    methods: {
        showVXConfirm: execWithValid(function (isLockVX) {
            this.$refs.vxConfirm.show(isLockVX);
        }),
        showVxUnlockingDetails() {
            this.$refs.vxUnlockingDetail.show();
        },
        tooggleAutoLock: execWithValid(function () {
            const title = this.isAutoLock
                ? this.$t('tradeDividend.closeAutoLock.title')
                : this.$t('tradeDividend.openAutoLock.title');
            const content = this.isAutoLock
                ? this.$t('tradeDividend.closeAutoLock.text')
                : this.$t('tradeDividend.openAutoLock.text');

            initPwd({
                title,
                content,
                submitTxt: this.$t('btn.submit'),
                cancelTxt: this.$t('btn.cancel'),
                submit: () => {
                    this.sendAutoLockTx();
                }
            }, true);
        }),

        sendAutoLockTx() {
            sendTx({
                methodName: 'dexSwitchConfig',
                data: {
                    switchType: '1',
                    enable: !this.isAutoLock
                }
            }).then(() => {
                this.$toast(this.$t('hint.operateSuccess'));
                doUntill({
                    createPromise: () => this.getIsAutoLockMinedVx(),
                    interval: 1000,
                    times: 3
                });
            }).catch(err => {
                this.$toast(this.$t('hint.operateFail'), err);
            });
        },
        getIsAutoLockMinedVx() {
            this.isInitAutoLock = this.isInitAutoLock || false;
            return getIsAutoLockMinedVx(this.address).then(data => {
                this.isInitAutoLock = true;
                this.isAutoLock = !!data;
                return data;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
@use "../components/stakingDetail.scss" as *;

.staking-detail.locking {
    [data-theme="0"] & {
        background: #f7f9fb;
        border-bottom: 1px solid rgba(227, 235, 245, 0.6);
    }
    [data-theme="1"] & {
        background: $black-color-2;
        border-bottom: 1px solid $black-color-4;
    }
    .check {
        font-size: 12px;
        margin-right: 30px;
        @include font_color_2();
        .check-box {
            display: inline-block;
            margin-right: 4px;
            margin-bottom: -3px;
        }
    }
}

.help {
    position: relative;
    @include background_common_img("info.svg");
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-bottom: -2px;
    .tips {
        white-space: nowrap;
        display: none;
    }
    &:hover {
        .tips {
            display: inline-block;
        }
    }
}
</style>
