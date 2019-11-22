<template>
    <div class="my-divident">
        <div class="item-top">
            <span class="item-title">{{ $t('mobileDividend.lockingTitle') }}</span>
            <span class="view-link" @click="goView">{{ $t('mobileDividend.viewLink') }}</span>
        </div>

        <div class="staking-detail">
            <div class="operation">
                <div class="item">
                    <div class="item-tilte">{{ $t("tradeDividend.lockedAmount") }}</div>
                    <div class="bold">{{ vxLocked }}</div>
                </div>
                <div class="item">
                    <div class="item-tilte">{{ $t("tradeDividend.unlockAmount") }}</div>
                    <div class="bold">{{ vxUnlocking }}</div>
                </div>
            </div>

            <div v-if="isInitAutoLock" @click="tooggleAutoLock" class="check">
                <Checkbox v-model="isAutoLock" :canClick="false" class="check-box"></Checkbox>
                {{ isAutoLock ? $t("tradeDividend.closeAutoLock.title") : $t("tradeDividend.openAutoLock.title") }}
            </div>

            <div class="operation no">
                <span class="item btn add" @click="showVXConfirm(true)">
                    {{ $t("tradeDividend.lock") }}
                </span>
                <span v-show="!vxBalanceInfo.vxLocked" class="item btn unuse">
                    {{ $t("tradeDividend.unlock") }}
                </span>
                <span v-show="vxBalanceInfo.vxLocked" class="item btn cancel" @click="showVXConfirm(false)">
                    {{ $t("tradeDividend.unlock") }}
                </span>
            </div>
        </div>

        <lock-confirm ref="lockConfirm"></lock-confirm>
    </div>
</template>

<script>
import { VX_TOKENID } from 'utils/constant';
import bigNumber from 'utils/bigNumber';
import Checkbox from 'uiKit/checkbox';
import tooltips from 'components/tooltips';
import { abiList } from 'services/apiServer';
import { getIsAutoLockMinedVx } from 'services/viteServer';
import sendTx from 'h5Utils/sendTx';
import lockConfirm from './lockConfirm';

export default {
    components: { Checkbox, tooltips, lockConfirm },
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
            this.sendAutoLockTx();
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
@import "~h5Assets/scss/vars.scss";

.check {
    margin-top: 14px;
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
    border-radius: 2px;
    line-height: 16px;
    margin: 14px 0;
    .item-top {
        padding: 14px;
        .view-link {
            float: right;
            color: $blue;
            line-height: 16px;
            margin-top: 5px;
            &::after {
                width: 16px;
                height: 16px;
                content: ' ';
                display: inline-block;
                background: url('~h5Assets/imgs/right_arrow.svg');
                background-size: 100% 100%;
                margin-bottom: -4px;
            }
        }
        &:first-child {
            border-bottom: 1px dashed rgba(211,223,239,1);
        }
        .item-title {
            color: rgba(62, 74, 89, 0.3);
            line-height: 26px;
        }
        .item-amount {
            font-size: 24px;
            @include font-bold();
            line-height: 30px;
            color: rgba(36, 39, 43, 1);
            margin-bottom: 6px;
        }
        .item-price {
            line-height: 18px;
            color: rgba(36, 39, 43, 1)
        }
    }

    .my-dividend-token {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-bottom: 0;

        .small-amount {
            width: 50%;
            white-space: nowrap;
            color: rgba(62,74,89,0.6);
            line-height: 16px;
            margin-bottom: 14px;
        }
    }
}

.staking-detail {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 12px;
    @include font-normal();
    color: rgba(62,74,89,0.6);
    line-height: 16px;
    padding: 0 14px 14px;
    .item {
        flex: 1;
        &:first-child {
            margin-right: 23px;
        }
        .item-tilte {
            margin-bottom: 5px;
        }
        .bold {
            @include font-bold();
        }
    }
    .operation {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-top: 14px;
        &.no {
            margin-top: 7px;
        }
    }
    .btn {
        display: inline-block;
        border-radius: 2px;
        padding: 0 13px;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        font-size: 14px;
        @include font-bold();
        text-align: center;
        &.add {
            color: #fff;
            background: $blue;
        }
        &.cancel {
            color: $blue;
            border: 1px solid $blue;
        }
        &.unuse {
            border: 1px solid rgba(201,217,239,1);
            color: rgba(201,217,239,1);
        }
    }
}
</style>
