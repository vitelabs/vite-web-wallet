<template>
    <div class="bridge-wrapper">
        <div class="bridge-content">
            <div class="bri__title">Choose Asset</div>
            <viteSelect
                v-model="curToken"
                :options="tokenList"
                :searchable="false"
                :clearable="false"
                :class="'sfd'"
            ></viteSelect>
            <div class="bri__network">
                <networkCard
                    :type="'From'"
                    :status="richNetworkPair.from['status']"
                    :value="curSelectFromNet"
                    :icon="richNetworkPair.from['icon']"
                    @input="onToggleNet"
                    :netList="netList"
                />
                <img
                    class="bri__trans-icon"
                    :src="transIcon"
                    @click="onToggleNet"
                    style="cursor:pointer"
                />
                <networkCard
                    :type="'To'"
                    :status="richNetworkPair.to['status']"
                    :value="curSelectToNet"
                    :icon="richNetworkPair.to['icon']"
                    :netList="netList"
                    @input="onToggleNet"
                />
            </div>
            <div v-if="!requireBSCConnect">
                <div>
                    <div class="__row">
                        <div class="__row_t">
                            Amount
                            <span class="__row_hint"
                            >Balance:{{ balanceMan }}
                                {{ curToken.label }}</span
                                >
                        </div>
                        <vite-input v-model="amount" :type="'number'">
                            <span slot="after" class="__all_wrapper __pointer">
                                <span class="__all" @click="autoFillMax">{{
                                    $t('tradeAssets.all')
                                }}</span>
                            </span>
                        </vite-input>
                    </div>

                    <div class="__row">
                        <div class="__row_t">
                            Destination Address
                            <!-- <span v-show="amountErr" class="__err">{{ amountErr }}</span> -->
                        </div>
                        <vite-input v-model="toAddress"> </vite-input>
                    </div>
                </div>
                <div class="__row clearfix">
                    <div
                        class="__form_btn"
                        style="width:100%"
                        @click="onNextClick"
                    >
                        Next
                    </div>
                </div>
            </div>
            <div v-else class="clearfix">
                <div
                    class="__form_btn"
                    style="width:100%"
                    @click="requestConnect2MetaMask"
                >
                    Connect MetaMask
                </div>
            </div>
            <div class="__row" v-if="!requireBSCConnect">
                <div class="__row-tips">
                    <div><span class="red-dot"></span>Reminder</div>
                    <div>
                        The maximum amount is {{ richNetworkPair.from.max }}
                        {{ curToken.label }}
                    </div>
                    <div>
                        The minimum amount is {{ richNetworkPair.to.min }}
                        {{ curToken.label }}
                    </div>
                </div>
            </div>
            <div class="progress-bar">
                <div
                    :class="[
                        'progress-point',
                        progressSetp >= 1
                            ? 'progress-point--pending'
                            : 'progress-point--todo'
                    ]"
                >
                    <div class="progress-icon"></div>
                    <div class="progress-text">Choose Chain&Asset</div>
                    <div class="progress-line"></div>
                </div>
                <div
                    :class="[
                        'progress-point',
                        progressSetp >= 2
                            ? 'progress-point--pending'
                            : 'progress-point--todo'
                    ]"
                >
                    <div class="progress-icon"></div>
                    <div class="progress-text">Connect Wallet</div>
                    <div class="progress-line"></div>
                </div>
                <div
                    :class="[
                        'progress-point',
                        progressSetp >= 3
                            ? 'progress-point--pending'
                            : 'progress-point--todo'
                    ]"
                >
                    <div class="progress-icon"></div>
                    <div class="progress-text">Send transaction</div>
                    <div class="progress-line"></div>
                </div>
                <div
                    :class="[
                        'progress-point',
                        progressSetp >= 4
                            ? 'progress-point--pending'
                            : 'progress-point--todo'
                    ]"
                >
                    <div class="progress-icon"></div>
                    <div class="progress-text">Success</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import pageLayout from 'pcComponents/pageLayout/index.vue';
import searchTips from 'src/uiKit/searchTips.vue';
import viteSelect from 'src/uiKit/viteSelect.vue';

import ViteInput from 'components/viteInput.vue';
import {
    confirmBriTxDialog,
    confirmCrossBridgeDialog,
    transConfirmsDialog
} from 'pcComponents/dialog';

import 'vue-select/dist/vue-select.css';
import { defaultTokenMap } from 'utils/constant';
import networkCard from './networkCard.vue';
import rightDouble from 'assets/imgs/rightDouble.svg.vue';
import { ethers, Contract } from 'ethers';
import { ChannelERC20 } from '../abstractClient/erc20';
import { viteClient } from 'services/apiServer';
import { StatusMap } from 'wallet/webAccount';
import _channelAbi from '../abstractClient/erc20/channel.json';
import _erc20Abi from '../abstractClient/erc20/erc20.json';
import { ChannelVite } from '../abstractClient/vite';
import bnUtils from 'src/utils/bigNumber';
import BigNumber from 'bignumber.js';
import { execWithValid } from 'pcUtils/execWithValid';
import { wallet, isValidHex } from '@vite/vitejs';
import { getTokenIcon } from 'utils/tokenParser';
import transIcon from 'assets/imgs/crossBridge/trans.png';
import Loading from 'src/components/loading.vue';
import { verifyAmount } from 'pcUtils/validations';

let erc20Contract = null;
const mockTokens = {
    tokens: [
        {
            token: 'USDT',
            icon: 'https://static.vite.net/image-1257137467/logo/usdt-logo.png',
            channels: [
                [
                    {
                        network: 'BSC',
                        desc: 'BSC TestNet ',
                        icon:
                            'https://static.vite.net/image-1257137467/logo/bsc-logo.png',
                        contract: '0x2fe56db3f21815ab26828debc175ab08d91cf81d',
                        erc20: '0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
                        decimals: 18,
                        confirmedThreshold: 10,
                        max: '1',
                        min: '0.01',
                        fee: { fixed: '0' }
                    },
                    {
                        network: 'VITE',
                        desc: 'Vite TestNet',
                        icon:
                            'https://static.vite.net/image-1257137467/logo/VITE-logo.png',
                        contract:
                            'vite_75043ce60463a3c14b188a1505fd359acaef278c16dece5a0b',
                        tokenId: 'tti_ece34ebace895e3506a24064',
                        decimals: 18,
                        confirmedThreshold: 100,
                        max: '1',
                        min: '0.01',
                        fee: { fixed: '0' }
                    }
                ]
            ]
        }
    ]
};

export default {
    name: 'BRIDGE',
    components: {
        pageLayout,
        ViteInput,
        searchTips,
        viteSelect,
        networkCard,
        rightDouble,
        Loading
    },
    mounted() {
        if (ethereum) {
            this.networkMeta['BSC'].status = ethereum.selectedAddress
                ? 'CONNECTED'
                : 'UNCONNECT';

            ethereum.on('accountsChanged', accounts => {
                console.log(9999, accounts);
                this.networkMeta['BSC'].status = accounts?.[0]
                    ? 'CONNECTED'
                    : 'UNCONNECT';
            });
            // ethereum.on("disconnect", (connectInfo) => {
            //   this.networkMeta["BSC"].status = "UNCONNECT";
            //   console.log(8888, "disconnected");
            // });
        } else {
        }
        this.getTokens().then(t => {
            this.tokens = t.tokens;
            // TOKEN first \ then net @todo
            // ct.tokens[0].channels.reduce((pre,cur)=>{
            //   pre[cur.network]=cur;
            //   return pre;
            // },{})
            t.tokens[0].channels[0].forEach(t => {
                this.networkMeta[t.network] = Object.assign({},
                    this.networkMeta[t.network] || {},
                    t);
            });
        });
    },
    data() {
        return {
            isConnectingMetaMask: false,
            transIcon,
            toAddress: '',
            amount: '',
            tokens: [],
            curToken: '',
            networkPair: {
                from: 'VITE',
                to: 'BSC'
            },
            networkMeta: {
                BSC: { status: 'UNCONNECT' },
                VITE: {
                    status:
                        this.$store.state.wallet.currHDAcc.status
                        === StatusMap.LOCK
                            ? 'UNCONNECT'
                            : 'CONNECTED'
                }
            },
            progressSetp: 1,
            balance: new BigNumber(0)
        };
    },
    computed: {
        requireBSCConnect() {
            return (
                this.networkPair.from === 'BSC'
                && this.networkMeta['BSC'].status !== 'CONNECTED'
            );
        },
        curTokenInfo() {
            return this.tokenInfos.find(t => t.tokenId === this.curToken?.value);
        },
        tokenInfos() {
            const tokenMap = this.$store.getters.allTokensMap || {};
            return (this.tokens || []).map(t => {
                const tokenId = t.channels[0].find(c => c.network === 'VITE')
                    ?.tokenId;
                return {
                    ...t,
                    icon: t?.icon || getTokenIcon(tokenId),
                    tokenId
                };
            });
        },
        tokenList() {
            return this.tokenInfos.map(t => {
                return {
                    value: t.tokenId,
                    label: t.token,
                    icon: t.icon
                };
            });
        },
        curSelectToNet() {
            const net
                = this.netList.find(t => t.value === this.networkPair.to) || {};
            net.icon = null;
            return net;
        },
        curSelectFromNet() {
            const net
                = this.netList.find(t => t.value === this.networkPair.from) || {};
            net.icon = null;
            return net;
        },
        netList() {
            return Object.values(this.networkMeta || {}).map(t => {
                return {
                    value: t.network,
                    label: t.desc
                };
            });
        },
        balanceMan() {
            const channel = this.getChannelInfo(this.networkPair.from);
            if (!channel) return 0;
            return bnUtils.toBasic(this.balance, channel.decimals);
        },
        richNetworkPair() {
            const richNetworkPair = {
                from: {},
                to: {}
            };
            const fromInfo = this.networkMeta[this.networkPair.from] || {};
            const toInfo = this.networkMeta[this.networkPair.to] || {};
            richNetworkPair.from = { ...fromInfo };
            richNetworkPair.to = { ...toInfo };
            return richNetworkPair;
        }
    },
    watch: {
        'networkPair.from': async function (val) {
            this.reGenErc20();
            this.resetBalance();
        },
        curToken: async function (val) {
            this.reGenErc20();
            this.resetBalance();
        }
    },
    methods: {
        async resetBalance() {
            this.balance = new BigNumber(0);
            const balance = await this.getBalance(this.networkPair.from);
            console.log('rrrrrfetch', balance);
            this.balance = balance;
        },
        async reGenErc20() {
            if (this.networkPair.from !== 'BSC') return;
            const tokenAddress = this.getChannelInfo('BSC')?.erc20;
            if (!tokenAddress) {
                erc20Contract = null;
                return;
            }
            erc20Contract = new Contract(tokenAddress,
                _erc20Abi,
                new ethers.providers.Web3Provider(window.ethereum).getSigner());
            const balance = await this.getBalance(this.networkPair.from);
            console.log('token change', 'balance', balance);
        },
        async getTokens() {
            return fetch('https://raw.githubusercontent.com/vitelabs/vite-asset-bridge/master/meta.json').then(data => data.json());
        },
        async onNextClick() {
            const curNet = this.networkPair.from;
            const toNet = this.networkPair.to;
            if (!erc20Contract && curNet === 'BSC') return;
            const toAddress = this.toAddress;
            const curChannel = this.getChannelInfo(curNet);
            if (!curChannel) return;
            const channelAddress = curChannel?.contract;
            const decimals = curChannel.decimals;
            const ammountMin = bnUtils.toMin(this.amount, decimals);
            let balanceMin = null;
            const tokenId = this.curTokenInfo.tokenId;
            try {
                balanceMin = await this.getBalance(curNet);
            } catch (e) {
                this.$toast(JSON.stringify(e));
            }
            if (!channelAddress || !this.curTokenInfo.tokenId) {
                console.error('err send ',
                    channelAddress,
                    toAddress,
                    this.curTokenInfo.tokenId);
                return;
            }
            const errorMap = {
                notEnough: this.$t('tokenCard.withdraw.balanceErrMap.notEnough'),
                overMax: 'Illegal amount',
                lessMin: 'Illegal amount'
            };
            const amountErrMsg = verifyAmount({
                decimals: curChannel.decimals,
                balance: balanceMin,
                minAmount: curChannel.min
                    ? bnUtils.toMin(curChannel.min, curChannel.decimals)
                    : undefined,
                maxAmount: curChannel.max
                    ? bnUtils.toMin(curChannel.max, curChannel.decimals)
                    : undefined,
                errorMap: errorMap
            })(this.amount);
            if (amountErrMsg) {
                console.log(amountErrMsg);
                this.$toast(amountErrMsg);
                return;
            }
            if (toNet === 'BSC') {
                if (!ethers.utils.isAddress(toAddress)) {
                    this.$toast('Illegal address');
                    return;
                }
            }
            if (toNet === 'VITE') {
                if (!wallet.isValidAddress(toAddress)) {
                    this.$toast('Illegal address');
                    return;
                }
            }
            const fromAddress = await this.getAddress(curNet);
            const params = {
                networkPair: this.richNetworkPair,
                tokenInfo: this.curTokenInfo,
                transInfo: {
                    fromAddress,
                    toAddress,
                    fee: 0,
                    amount: this.amount,
                    estimateAmount: this.amount
                }
            };

            await confirmBriTxDialog(params);
            async function sendTx() {
                let inputId = '';
                if (curNet === 'BSC') {
                    await erc20Contract.approve(channelAddress, ammountMin);
                    const erc20hChannel = new Contract(channelAddress,
                        _channelAbi,
                        new ethers.providers.Web3Provider(window.ethereum).getSigner());
                    const originAddr = `0x${ wallet.getOriginalAddressFromAddress(toAddress) }`;
                    await erc20hChannel.input(originAddr, ammountMin);
                    inputId = await erc20hChannel.prevInputId();
                } else if (curNet === 'VITE') {
                    const channelClient = new ChannelVite({
                        address: channelAddress,
                        tokenId
                    });
                    await execWithValid(() =>
                        channelClient.input(toAddress, ammountMin))();
                    inputId = await channelClient.prevInputId();
                }
                return inputId;
            }
            const result = await confirmCrossBridgeDialog({
                ...params,
                inspector: sendTx
            });

            const inputId = result?.data?.[0];
            console.log('tx result-----', result);
            if (!inputId) return;
            params.transInfo['inputId'] = inputId;
            await transConfirmsDialog(params);
        },
        async getAddress(net) {
            if (net === 'VITE') return this.$store.state.wallet.currHDAcc?.activeAddr;
            if (net === 'BSC') return window.ethereum?.selectedAddress;
        },
        getChannelInfo(net) {
            return this.curTokenInfo?.channels[0]?.find(
                channel => channel.network === net
            );
        },
        async getBalance(net) {
            const address = await this.getAddress(net);
            const channel = this.getChannelInfo(this.networkPair.from);

            const tokenId = channel?.erc20 || channel?.tokenId;
            console.log(22222, address, tokenId);

            if (!address || !tokenId) return null;

            if (net === 'VITE') {
                const balanceInfo = await viteClient.getBalanceInfo(address);
                const balance = balanceInfo.balance?.balanceInfoMap?.[tokenId]
                    ?.balance
                    ? new BigNumber(balanceInfo.balance?.balanceInfoMap?.[
                              tokenId
                          ]?.balance)
                    : new BigNumber(0);
                return balance;
            }
            if (net === 'BSC') {
                const balance = await erc20Contract?.balanceOf(address);
                const transedBigNumberBalance = new BigNumber(balance?.toString() || 0);
                return transedBigNumberBalance || new BigNumber(0);
            }
        },
        onToggleNet() {
            const { from, to } = this.networkPair;
            this.networkPair.from = to;
            this.networkPair.to = from;
        },
        async requestConnect2MetaMask() {
            try {
                this.isConnectingMetaMask = true;
                await ethereum?.request({ method: 'eth_requestAccounts' });
                this.networkMeta['BSC'].status = 'CONNECTED';
            } finally {
                this.isConnectingMetaMask = false;
            }
        },
        async autoFillMax() {
            this.amount = this.balanceMan;
        },
        onSelected(v) {
            console.log(99999, v);
        }
    }
};
// parent weird animal coil sister damp tunnel cover stick plug ivory luggage
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
@import 'pcComponents/confirm/confirmRow.scss';
@import '~pc/styles/form.scss';

.bridge-wrapper {
    width: 100%;
    height: 100%;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    .bridge-content {
        width: 630px;
        height: 810px;
        box-sizing: border-box;
        position: relative;
        @include bg_color_2();

        @include common_font_color();
        border-radius: 2px;
        box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
        padding: 40px;
        .bri__title {
            margin-bottom: 20px;
            font-size: 18px;
        }
        .bri__network {
            display: flex;
            align-items: center;
            margin: 35px 0;
            .bri__trans-icon {
                width: 45px;
                height: 15px;
                font-size: 36px;
                margin: 0 10px;
                color: #007aff;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .__row-tips {
            @include bg_color_tips();
            padding: 10px 20px;
            line-height: 24px;
            > div {
                &:first-child {
                    line-height: 32px;
                }
            }

            .red-dot {
                border-radius: 100%;
                height: 6px;
                width: 6px;
                background-color: #e02020;
                display: inline-block;
                margin-right: 8px;
            }
        }
        .progress-bar {
            display: flex;
            position: absolute;
            bottom: 50px;
            left: 15px;
            font-size: 12px;

            .progress-point {
                width: 120px;
                height: 56px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                &:not(:last-child) {
                    margin-right: 45px;
                }

                .progress-line {
                    height: 2px;
                    background-color: rgba($blue-color-1, 0.4);
                    position: absolute;
                    left: 70px;
                    top: 10px;
                    width: 145px;
                }
                .progress-text {
                    white-space: nowrap;
                }
                &--pending {
                    .progress-icon {
                        width: 20px;
                        height: 20px;
                        box-sizing: border-box;
                        border-radius: 100%;
                        border: 6px solid $blue-color-1;
                    }
                    @include font-family-bold();
                }
                &--todo {
                    .progress-icon {
                        width: 20px;
                        height: 20px;
                        box-sizing: border-box;
                        border-radius: 100%;
                        border: 3px solid rgba($blue-color-1, 0.4);
                    }
                    @include font_color_2();
                }
            }
        }
    }
}
</style>
