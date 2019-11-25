<template>
    <div>
        <my-income class="my-divident" :isShowMiningLink="false"
                   :isShowLockLink="true" :isShowTotal="false"
                   :title="$t('mobileDividend.lockingTitle')">
            <div class="head-detail">
                <div class="item">
                    <div class="item-tilte">{{ $t("tradeDividend.lockedAmount") }}</div>
                    <div class="bold">{{ vxLocked }}</div>
                </div>
                <div class="item">
                    <div class="item-tilte">{{ $t("tradeDividend.unlockAmount") }}</div>
                    <div class="bold">{{ vxUnlocking }}</div>
                </div>
                <div v-if="isInitAutoLock" @click="tooggleAutoLock" class="check">
                    <Checkbox v-model="isAutoLock" :canClick="false" class="check-box"></Checkbox>
                    {{ isAutoLock ? $t("tradeDividend.closeAutoLock.title") : $t("tradeDividend.openAutoLock.title") }}
                </div>
                <div class="item btn add" @click="showVXConfirm(true)">
                    {{ $t("tradeDividend.lock") }}
                </div>
                <div v-show="!vxBalanceInfo.vxLocked" class="item btn unuse">
                    {{ $t("tradeDividend.unlock") }}
                </div>
                <div v-show="vxBalanceInfo.vxLocked" class="item btn cancel" @click="showVXConfirm(false)">
                    {{ $t("tradeDividend.unlock") }}
                </div>
            </div>
        </my-income>

        <lock-confirm ref="lockConfirm"></lock-confirm>
    </div>
</template>

<script>
import myIncome from 'h5Components/myIncome/index';
import { doUntill } from 'utils/asyncFlow';
import { VX_TOKENID } from 'utils/constant';
import bigNumber from 'utils/bigNumber';
import Checkbox from 'uiKit/checkbox';
import tooltips from 'components/tooltips';
import { abiList } from 'services/apiServer';
import { getIsAutoLockMinedVx } from 'services/viteServer';
import sendTx from 'h5Utils/sendTx';
import lockConfirm from './lockConfirm';
import confirm from 'h5Components/confirm/index';

export default {
    components: { myIncome, Checkbox, tooltips, lockConfirm },
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
            return this.$store.state.env.tokenMap[VX_TOKENID];
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
    methods: {
        goView() {
            this.$router.push({ name: 'lockingList' });
        },
        showVXConfirm(isLockVX) {
            this.$refs.lockConfirm.show(isLockVX);
        },
        tooggleAutoLock() {
            const title = this.isAutoLock
                ? this.$t('tradeDividend.closeAutoLock.title')
                : this.$t('tradeDividend.openAutoLock.title');
            const content = this.isAutoLock
                ? this.$t('tradeDividend.closeAutoLock.text')
                : this.$t('tradeDividend.openAutoLock.text');

            confirm({
                title,
                content,
                singleBtn: true,
                leftBtn: {
                    text: this.$t('btn.submit'),
                    click: () => {
                        this.sendAutoLockTx();
                    }
                }
            });
        },

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
                doUntill({
                    createPromise: () => this.getIsAutoLockMinedVx(),
                    interval: 1000,
                    times: 3
                });
            }).catch(err => {
                console.warn(err);
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
@import "~h5Components/myIncome/headDetail.scss";

.check {
    width: 100%;
    margin-bottom: 7px;
    font-size: 12px;
    margin-right: 30px;
    color: rgba(62,74,89,0.45);
    .check-box {
        display: inline-block;
        margin-right: 4px;
        margin-bottom: -3px;
    }
}

.my-divident {
    background: rgba(0,122,255,0.06);
    margin-top: 14px;
}
</style>
