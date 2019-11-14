<template>
    <div class="staking-detail">
        <div class="item">
            <div>
                {{ $t("tradeDividend.lockedAmount") }}
                <span class="help __pointer">
                    <tooltips class="tips" :content="$t('tradeDividend.lockAmountTips')"></tooltips>
                </span>
            </div>
            <div class="bold">{{ vxBalanceInfo.vxLocked || 0 }}</div>
        </div>
        <div class="item" :class="{ 'no-border': !isInitAutoLock }">
            <div>{{ $t("tradeDividend.unlockAmount") }}</div>
            <div class="bold">{{ vxBalanceInfo.vxUnlocking || 0 }}</div>
        </div>
        <div v-if="isInitAutoLock" @click="tooggleAutoLock" class="item check no-border">
            <Checkbox v-model="isAutoLock" :canClick="false" class="check-box"></Checkbox>
            {{ isAutoLock ? $t("tradeDividend.closeAutoLock.title") : $t("tradeDividend.openAutoLock.title") }}
        </div>

        <div class="operations">
            <div class="btn add __pointer" @click="showVXConfirm(true)">
                {{ $t("tradeDividend.lock") }}
            </div>
            <div v-show="!vxBalanceInfo.vxUnlocking" class="btn unuse">
                {{ $t("tradeDividend.unlock") }}
            </div>
            <div v-show="vxBalanceInfo.vxUnlocking" @click="showVXConfirm(false)" class="btn cancel __pointer">
                {{ $t("tradeDividend.unlock") }}
            </div>
        </div>

        <vx-confirm ref="vxConfirm"></vx-confirm>
    </div>
</template>

<script>
import Checkbox from 'uiKit/checkbox';
import tooltips from 'components/tooltips';
import { getIsAutoLockMinedVx } from 'services/viteServer';
import { execWithValid } from 'pcUtils/execWithValid';
import sendTx from 'pcUtils/sendTx';
import { initPwd } from 'pcComponents/password/index.js';
import vxConfirm from './vxConfirm';

const autoLockAbi = { 'type': 'function', 'name': 'SwitchConfig', 'inputs': [ { 'name': 'switchType', 'type': 'uint8' }, { 'name': 'enable', 'type': 'bool' } ] };
const contractAddress = 'vite_0000000000000000000000000000000000000006e82b8ba657';

export default {
    components: { Checkbox, tooltips, vxConfirm },
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
        address() {
            return this.$store.getters.activeAddr;
        },
        vxBalanceInfo() {
            return this.$store.state.exchangeBalance.vxBalanceInfo || {};
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
                methodName: 'callContract',
                data: {
                    abi: autoLockAbi,
                    toAddress: contractAddress,
                    params: [ '1', !this.isAutoLock ]
                }
                // abi: JSON.stringify(autoLockAbi)
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
</style>
