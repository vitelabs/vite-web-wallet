<template>
    <div class="tb-list">
        <wallet-table class="wallet-sbp-table" :headList="[{
            class: 'name __ellipsis',
            text: $t('walletSBP.section1.nodeName'),
            cell: 'name',
            slot: true
        },{
            class: 'block-addr',
            text: $t('walletSBP.section1.producerAddr'),
            cell: 'blockProducingAddress',
            slot: true
        },{
            class: 'reward-addr',
            text: $t('walletSBP.section1.rewardWithdrawAddress'),
            cell: 'rewardWithdrawAddress',
            slot: true
        },{
            class: 'amount',
            text: $t('stakingAmount'),
            cell: 'amount'
        },{
            class: 'height',
            text: $t('withdrawHeight'),
            cell: 'height'
        },{
            class: 'operate',
            text: $t('action'),
            cell: 'operate'
        }]" :contentList="list">
            <template #name="{ data }">
                <a :href="getAccountUrl(data.stakeAddress)" target="_blank">{{ data.name }}</a>
            </template>

            <template #blockProducingAddress="{ data }">
                <a :href="getAccountUrl(data.blockProducingAddress)" target="_blank">
                    {{data.blockProducingAddress | shortAddr}}
                </a>
                <span v-if="data.blockProducingAddress === address" class="beneficial-img"></span>
            </template>

            <template #rewardWithdrawAddress="{ data }">
                <a :href="getAccountUrl(data.rewardWithdrawAddress)" target="_blank">
                    {{data.rewardWithdrawAddress | shortAddr}}
                </a>
                <span v-if="data.rewardWithdrawAddress === address" class="beneficial-img"></span>
            </template>

            <span v-for="(item, i) in list" :key="i"
                  :slot="`${i}heightBefore`">
                {{ item.isCancel ? '--' : item.withdrawHeight }}
                <i v-if="!item.isCancel" @click.self.stop="showTime(i)" class="tipsicon __pointer">
                    <tooltips v-show="showTimeTips === i" v-click-outside="hideTime" class="sbp-tooltips"
                              :content="$t('walletSBP.section2.expireDate', { time: item.time })"></tooltips>
                </i>
            </span>

            <span v-for="(item, i) in list" :key="i"
                  :slot="`${i}operateBefore`">
                <template v-if="item.isStakingAddr">
                    <span v-if="!item.isCancel" class="btn __pointer"
                          @click="edit(item)">{{ $t('btn.edit') }}</span>
                    <span v-if="item.isCancel" class="btn" :class="{
                        '__pointer': item.isReReg,
                        'unuse': !item.isReReg
                    }" @click="reg(item, true)">{{ $t('btn.reReg') }}</span>
                    <span v-if="!item.isCancel" class="btn" :class="{
                        '__pointer': item.isMaturity,
                        'unuse': !item.isMaturity
                    }" @click="cancel(item)">{{ $t('walletSBP.cancelBtn') }}</span>
                </template>
                <span class="btn __pointer"
                      @click="reward(item)">{{ $t('walletSBP.rewardBtn') }}</span>
            </span>
        </wallet-table>

        <password v-show="isShowReward"
                  :title="$t('walletSBP.rewardConfirm.title')"
                  :submitTxt="$t('walletSBP.rewardConfirm.rightBtn')"
                  :cancelTxt="$t('walletSBP.rewardConfirm.leftBtn')"
                  :isShowPWD="isShowPWD" :cancel="hideReward" :submit="sendReward">
            {{ $t('walletSBP.rewardConfirm.describe1', { time: this.getTime(new Date().getTime()) }) }}
            <div class="__unuse_input __input_row __bold">VITE
                <span class="__right">{{ totalReward || '--' }}</span>
            </div>
            <div class="__hint">
                <span>
                    {{ $t('walletSBP.rewardConfirm.describe2') }}
                    <a class="link" target="_blank"
                       :href="getUrl(rewardItem && rewardItem.rawData.name)">
                        {{ $t('walletSBP.rewardConfirm.describe3') }}
                    </a>
                    {{ $t('walletSBP.rewardConfirm.describe4') }}
                </span>
            </div>
        </password>
    </div>
</template>

<script>
import { constant as viteConstant } from '@vite/vitejs';
import date from '@utils/date.js';
import { getAccountLink, getSBPLink } from '@utils/getLink';
import BigNumber from '@utils/bigNumber';
import sendTx from '@pc/utils/sendTx';
import { constant } from '@pc/utils/store';
import tooltips from '@components/tooltips.vue';
import walletTable from '@pc/components/table/index.vue';
import { initPwd } from '@pc/components/password/index.js';
import password from '@pc/components/password/password.vue';
import { execWithValid } from '@pc/utils/execWithValid';
import { getSBPAvailableReward } from '@services/viteServer';

const Vite_Token_Info = viteConstant.Vite_Token_Info;
const amount = 1000000;

export default {
    components: { tooltips, password, walletTable },
    props: {
        showConfirm: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.$store.dispatch('startLoopHeight');
        this.fetchList();
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    data() {
        return {
            showTimeTips: -1,
            totalReward: null,
            isShowReward: false,
            rewardItem: null
        };
    },
    computed: {
        isShowPWD() {
            const currHDAcc = this.$store.state.wallet.currHDAcc;
            const accInfo = currHDAcc ? currHDAcc.getAccInfo() : null;
            const isHoldPWD = accInfo ? !!accInfo[constant.HoldPwdKey] : false;
            return !isHoldPWD;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        amountErr() {
            const balance = this.tokenBalList[Vite_Token_Info.tokenId] ? this.tokenBalList[Vite_Token_Info.tokenId].totalAmount : 0;
            const minAmount = BigNumber.toMin(amount, Vite_Token_Info.decimals);
            if (BigNumber.compared(balance, minAmount) < 0) {
                return this.$t('hint.insufficientBalance');
            }

            return '';
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        },
        currentHeight() {
            return this.$store.state.ledger.currentHeight || 0;
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        list() {
            const decimals = Vite_Token_Info.decimals;

            const registrationList = this.$store.state.SBP.registrationList || [];
            const list = [];


            registrationList.forEach(item => {
                const isStakingAddr = item.stakeAddress === this.address;

                const isMaturity = BigNumber.compared(item.expirationHeight, this.currentHeight) <= 0;
                const isCancel = item.revokeTime && !BigNumber.isEqual(item.revokeTime, 0);
                const isReReg = isCancel
                    ? (new Date().getTime() - item.revokeTime * 1000) > 75000
                    : false;

                const day = date(item.expirationTime * 1000, this.$i18n.locale);
                list.push({
                    ...item,
                    amount: item.isCancel ? '--' : `${ BigNumber.toBasic(item.stakeAmount, decimals) } ${ Vite_Token_Info.tokenSymbol }`,
                    isMaturity,
                    isCancel,
                    isReReg,
                    withdrawHeight: item.expirationHeight,
                    time: day,
                    rawData: item,
                    isStakingAddr
                });
            });

            return list;
        }
    },
    watch: {
        address() {
            this.fetchList();
        }
    },
    methods: {
        fetchList() {
            return this.$store.dispatch('fetchRegistrationList');
        },
        showTime(index) {
            this.showTimeTips = index;
        },
        hideTime() {
            this.showTimeTips = -1;
        },
        getTime(time) {
            return date(time, 'zh');
        },
        getUrl(name) {
            return `${ getSBPLink(this.$i18n.locale, name) }`;
        },
        getAccountUrl(address) {
            return `${ getAccountLink(this.$i18n.locale, address) }`;
        },

        sendRegisterTx(item) {
            const rawData = item.rawData;
            const nodeName = rawData.name;
            const producerAddr = rawData.blockProducingAddress;

            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            const minAmount = BigNumber.toMin(amount || 0, Vite_Token_Info.decimals);
            sendTx({
                methodName: 'registerSBP',
                data: {
                    sbpName: nodeName,
                    blockProducingAddress: producerAddr,
                    rewardWithdrawAddress: producerAddr,
                    amount: minAmount
                },
                config: {
                    pow: false,
                    confirm: {
                        showMask: true,
                        operate: this.$t('walletSBP.register')
                    }
                }
            }).then(() => {
                this.$toast(this.$t('walletSBP.section1.registerSuccess'));
                this.$store.dispatch('loopRegList', {
                    nodeName,
                    operate: 1,
                    producer: producerAddr
                });
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('walletSBP.section1.registerFail'), err);
            });
        },
        reg: execWithValid(function (item, isReReg) {
            if (isReReg && !item.isReReg) {
                return;
            }

            if (this.amountErr) {
                this.$toast(this.amountErr);
                return;
            }

            initPwd({
                title: this.$t('walletSBP.confirm.title'),
                submitTxt: this.$t('walletSBP.confirm.rightBtn'),
                cancelTxt: this.$t('walletSBP.confirm.leftBtn'),
                content: this.$t('walletSBP.confirm.describe', { amount }),
                submit: () => {
                    this.sendRegisterTx(item);
                }
            }, true);
        }),
        cancel: execWithValid(function (item) {
            if (!item.isMaturity || item.isCancel) {
                return;
            }

            initPwd({
                title: this.$t('walletSBP.section2.cancelConfirm.title'),
                content: this.$t('walletSBP.section2.cancelConfirm.describe', { amount: item.amount }),
                submit: () => {
                    const nodeName = item.rawData.name;
                    const producer = item.rawData.blockProducingAddress;

                    sendTx({
                        methodName: 'revokeSBP',
                        data: { sbpName: nodeName },
                        config: {
                            pow: false,
                            confirm: {
                                showMask: true,
                                operate: this.$t('walletSBP.cancel')
                            }
                        }
                    }).then(() => {
                        this.$toast(this.$t('hint.request', { name: this.$t('walletSBP.section2.cancel') }));
                        this.$store.dispatch('loopRegList', {
                            nodeName,
                            operate: 0,
                            producer
                        });
                    }).catch(err => {
                        this.$toast(this.$t('walletSBP.section2.cancelFail'), err);
                    });
                }
            }, true);
        }),
        edit: execWithValid(function (item) {
            if (item.isCancel) {
                return;
            }
            this.showConfirm('edit', item.rawData);
        }),
        sendReward() {
            sendTx({
                methodName: 'withdrawSBPReward',
                data: {
                    sbpName: this.rewardItem.rawData.name,
                    receiveAddress: this.address
                },
                config: {
                    pow: false,
                    confirm: {
                        showMask: true,
                        operate: this.$t('walletSBP.rewardBtn')
                    }
                }
            }).then(() => {
                this.$toast(this.$t('hint.request', { name: this.$t('walletSBP.rewardBtn') }));
                this.hideReward();
            }).catch(err => {
                this.$toast('Claim Failed', err);
            });
        },
        showReward(item) {
            this.isShowReward = true;
            this.rewardItem = item;
        },
        hideReward() {
            this.isShowReward = false;
            this.rewardItem = null;
        },
        reward: execWithValid(function (item) {
            this.totalReward = null;
            getSBPAvailableReward(item.rawData.name).then(data => {
                if (!data || data.allRewardWithdrawed || !+data.totalReward) {
                    this.$toast(this.$t('walletSBP.noReward'));
                    return;
                }

                const decimals = Vite_Token_Info.decimals;
                this.totalReward = BigNumber.toBasic(data.totalReward, decimals);
                this.showReward(item);
            }).catch(err => {
                console.warn(err);
                this.$toast('Get Reward Failed', err);
            });
        })
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;

.tb-list {
    flex: 1;
    .wallet-sbp-table {
        height: 100%;
    }
}

.__input_row {
    margin-top: 18px;
}

.__hint {
    .link {
        // color: #00BEFF;
        @include primary_color();
    }
}
.beneficial-img {
    display: inline-block;
    margin-left: 8px;
    margin-bottom: -2px;
    width: 12px;
    height: 12px;
    background: url("@assets/imgs/owner.png");
    background-size: 100% 100%;
}

.tipsicon {
    position: relative;
    display: inline-block;
    background: url("@assets/imgs/hover_help.svg");
    overflow: visible;
    width: 16px;
    height: 16px;
    vertical-align: sub;
    .sbp-tooltips {
        min-width: 300px;
    }
}

.btn {
    // color: #00BEFF;
    @include primary_color();
    margin-right: 15px;
    &.unuse {
        color: #ced1d5;
    }
}
</style>
