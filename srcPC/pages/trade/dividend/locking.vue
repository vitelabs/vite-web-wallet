<template>
    <div class="staking-detail">
        <div class="item">
            <div>
                {{ $t("tradeDividend.lockedAmount") }}
                <span class="help __pointer">
                    <tooltips class="tips" :content="$t('tradeDividend.lockAmountTips')"></tooltips>
                </span>
            </div>
            <div class="bold">{{ dexAccountFundInfo.vxLocked || '--' }}</div>
        </div>
        <div class="item" :class="{ 'no-border': !isInitAutoLock }">
            <div>{{ $t("tradeDividend.unlockAmount") }}</div>
            <div class="bold">{{ dexAccountFundInfo.vxUnlocking || '--' }}</div>
        </div>
        <div v-if="isInitAutoLock" @click.stop="tooggleAutoLock" class="item check no-border">
            <Checkbox v-model="isAutoLock" :canClick="false" class="check-box"></Checkbox>
            {{ isAutoLock ? $t("tradeDividend.closeAutoLock.title") : $t("tradeDividend.openAutoLock.title") }}
        </div>

        <div class="operations">
            <div class="btn add __pointer">
                {{ $t("tradeDividend.lock") }}
            </div>
            <div v-show="!dexAccountFundInfo.vxUnlocking" class="btn unuse">
                {{ $t("tradeDividend.unlock") }}
            </div>
            <div v-show="dexAccountFundInfo.vxUnlocking" class="btn cancel __pointer">
                {{ $t("tradeDividend.unlock") }}
            </div>
        </div>
    </div>
</template>

<script>
import Checkbox from 'uiKit/checkbox';
import tooltips from 'components/tooltips';
import confirm from 'components/confirm/index.js';
import { getIsAutoLockMinedVx } from 'services/viteServer';

export default {
    components: { Checkbox, tooltips },
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
        dexAccountFundInfo() {
            return this.$store.state.exchangeBalance.accountFundInfo || {};
        }
    },
    watch: {
        address() {
            this.getIsAutoLockMinedVx();
        }
    },
    methods: {
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
                size: 'small',
                leftBtn: { text: this.$t('btn.cancel') },
                rightBtn: {
                    text: this.$t('btn.submit'),
                    click: () => {
                        // this.fetchStopTx(item);
                    }
                }
            });
        },
        getIsAutoLockMinedVx() {
            this.isInitAutoLock = false;
            getIsAutoLockMinedVx().then(data => {
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
