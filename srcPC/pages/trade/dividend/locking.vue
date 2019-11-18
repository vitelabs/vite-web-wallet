<template>
    <div class="staking-detail">
        <div class="item">
            <div>
                {{ $t("tradeDividend.lockedAmount") }}
                <span class="help __pointer">
                    <tooltips class="tips" :content="$t('tradeDividend.lockAmountTips')"></tooltips>
                </span>
            </div>
            <div class="bold">{{ vxLocked || 0 }} VX</div>
        </div>
        <div class="item" :class="{ 'no-border': !isInitAutoLock }">
            <div>{{ $t("tradeDividend.unlockAmount") }}</div>
            <div class="bold">
                {{ vxUnlocking || 0 }} VX
                <span v-show="vxBalanceInfo.vxUnlocking" @click="showVxUnlockingDetails" class="down-icon __pointer"></span>
            </div>
        </div>
        <div v-if="isInitAutoLock" @click="tooggleAutoLock" class="item check no-border">
            <Checkbox v-model="isAutoLock" :canClick="false" class="check-box"></Checkbox>
            {{ isAutoLock ? $t("tradeDividend.closeAutoLock.title") : $t("tradeDividend.openAutoLock.title") }}
        </div>

        <div class="operations">
            <div class="btn add __pointer" @click="showVXConfirm(true)">
                {{ $t("tradeDividend.lock") }}
            </div>
            <div v-show="!vxBalanceInfo.vxLocked" class="btn unuse">
                {{ $t("tradeDividend.unlock") }}
            </div>
            <div v-show="vxBalanceInfo.vxLocked" @click="showVXConfirm(false)" class="btn cancel __pointer">
                {{ $t("tradeDividend.unlock") }}
            </div>
        </div>

        <vx-confirm ref="vxConfirm"></vx-confirm>
        <vxUnlockingConfirm ref="vxUnlockingDetail"></vxUnlockingConfirm>
    </div>
</template>

<script>
import bigNumber from 'utils/bigNumber';
import Checkbox from 'uiKit/checkbox';
import tooltips from 'components/tooltips';
import { abiList } from 'services/apiServer';
import { getIsAutoLockMinedVx } from 'services/viteServer';
import { execWithValid } from 'pcUtils/execWithValid';
import sendTx from 'pcUtils/sendTx';
import { initPwd } from 'pcComponents/password/index.js';
import vxConfirm from './vxConfirm';
import vxUnlockingConfirm from './vxUnlockingConfirm';

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
            return this.$store.state.exchangeBalance.vxBalanceInfo || {};
        },
        vxUnlocking() {
            const vxUnlocking = this.vxBalanceInfo.vxUnlocking || 0;
            return bigNumber.toBasic(vxUnlocking, this.vxTokenDecimals);
        },
        vxLocked() {
            const vxLocked = this.vxBalanceInfo.vxLocked || 0;
            return bigNumber.toBasic(vxLocked, this.vxTokenDecimals);
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
                abi: JSON.stringify(abiList.SwitchConfig.abi),
                methodName: 'callContract',
                data: {
                    abi: abiList.SwitchConfig.abi,
                    toAddress: abiList.SwitchConfig.contractAddr,
                    params: [ '1', !this.isAutoLock ]
                }
            }).then(() => {
                this.$toast(this.$t('hint.operateSuccess'));
            }).catch(err => {
                this.$toast(this.$t('hint.operateFail'), err);
            });
        },
        getIsAutoLockMinedVx() {
            this.isInitAutoLock = false;
            getIsAutoLockMinedVx(this.address).then(data => {
                this.isInitAutoLock = true;
                this.isAutoLock = !!data;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../components/stakingDetail.scss";

.staking-detail {
    background: none;
    .item.check {
        .check-box {
            margin-right: 6px;
        }
        flex-direction: row;
        justify-content: left;
        align-items: center;
    }
}

.help {
    position: relative;
    background: url('~assets/imgs/info.svg');
    background-size: 100% 100%;
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

.down-icon {
    display: inline-block;
    background: url('~assets/imgs/dividendInfo.svg');
    background-size: 100% 100%;
    width: 16px;
    height: 16px;
    margin-bottom: -4px;
}
</style>
