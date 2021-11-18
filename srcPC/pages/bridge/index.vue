<template>
  <page-layout>
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
            :type="'from'"
            :status="networkMeta[networkPair.from]['status']"
            :value="networkPair.from"
            :icon="networkMeta[networkPair.from]['logo']"
            @input="onToggleNet"
          />
          <div class="bri__trans-icon">
            ···<rightDouble style="height:20;width:20" />
          </div>
          <networkCard
            :type="'from'"
            :status="networkMeta[networkPair.to]['status']"
            :value="networkPair.to"
            :icon="networkMeta[networkPair.to]['logo']"
            @input="onToggleNet"
          />
        </div>
        <div v-if="networkMeta['ETH'].status === 'CONNECTED'">
          <div>
            <div class="__row">
              <div class="__row_t">
                Amount
                <span class="__row_hint">Balance:{{ balanceMan }}</span>
              </div>
              <vite-input v-model="amount">
                <span slot="after" class="__all_wrapper __pointer">
                  <span class="__all" @click="autoFillMax">{{
                    $t("tradeAssets.all")
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
            <div class="__form_btn" style="width:100%" @click="onNextClick">
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
        <div class="__row">
          <div class="__row-tips">
            <div><span class="red-dot"></span>Reminder</div>
            <div>max 111</div>
            <div>min 2222</div>
          </div>
        </div>
        <div class="progress-bar">
          <div
            :class="[
              'progress-point',
              progressSetp >= 1
                ? 'progress-point--pending'
                : 'progress-point--todo',
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
                : 'progress-point--todo',
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
                : 'progress-point--todo',
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
                : 'progress-point--todo',
            ]"
          >
            <div class="progress-icon"></div>
            <div class="progress-text">Success</div>
          </div>
        </div>
      </div>
    </div>
  </page-layout>
</template>

<script>
import pageLayout from "pcComponents/pageLayout/index.vue";
import searchTips from "src/uiKit/searchTips.vue";
import viteSelect from "src/uiKit/viteSelect.vue";

import ViteInput from "components/viteInput.vue";
import { confirmBriTxDialog } from "pcComponents/dialog";

import "vue-select/dist/vue-select.css";
import { defaultTokenMap } from "utils/constant";
import networkCard from "./networkCard.vue";
import rightDouble from "assets/imgs/rightDouble.svg.vue";
import { ethers, Contract } from "ethers";
import { ChannelERC20 } from "./abstractClient/erc20";
import { viteClient } from "services/apiServer";
import { StatusMap } from "wallet/webAccount";
import ViteLogo from "src/assets/imgs/vite.png";
import EthLogo from "src/assets/imgs/ethCircle.png";
import _channelAbi from "./abstractClient/erc20/channel.json";
import _erc20Abi from "./abstractClient/erc20/erc20.json";
import { ChannelVite } from "./abstractClient/vite";
import bnUtils from "src/utils/bigNumber";
import BigNumber from "bignumber.js";
import { execWithValid } from "pcUtils/execWithValid";

let erc20Contract = null;
const mockTokens = {
  tokens: [
    {
      token: "USDT",
      channels: [
        {
          network: "ETH",
          contract: "0x2fe56db3f21815ab26828debc175ab08d91cf81d",
          erc20: "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd",
          decimals: 18,
          confirmedThreshold: 10,
        },
        {
          network: "VITE",
          contract: "vite_75043ce60463a3c14b188a1505fd359acaef278c16dece5a0b",
          confirmedThreshold: 100,
          decimals: 18,
          tokenId: "tti_ece34ebace895e3506a24064",
        },
        ,
      ],
    },
  ],
};
const netWorkMap = {
  VITE: {
    logo: ViteLogo,
  },
  ETH: {
    logo: EthLogo,
  },
};
export default {
  name: "BRIDGE",
  components: {
    pageLayout,
    ViteInput,
    searchTips,
    viteSelect,
    networkCard,
    rightDouble,
  },
  mounted() {
    if (ethereum) {
      this.networkMeta["ETH"].status = ethereum.isConnected
        ? "CONNECTED"
        : "UNCONNECT";

      ethereum.on("connect", (connectInfo) => {
        console.log(9999, "connected");
        this.networkMeta["ETH"].status = "CONNECTED";
      });
      ethereum.on("disconnect", (connectInfo) => {
        this.networkMeta["ETH"].status = "UNCONNECT";
        console.log(8888, "disconnected");
      });
    } else {
    }
    this.getTokens().then((t) => (this.tokens = t.tokens));
  },
  data() {
    return {
      toAddress: "",
      amount: "",
      tokens: [],
      curToken: "",
      networkPair: {
        from: "VITE",
        to: "ETH",
      },
      networkMeta: {
        ETH: {
          status: "UNCONNECT",
          ...netWorkMap["ETH"],
        },
        VITE: {
          status:
            this.$store.state.wallet.currHDAcc.status === StatusMap.LOCK
              ? "UNCONNECT"
              : "CONNECTED",
          ...netWorkMap["VITE"],
        },
      },

      amountInput: "",
      progressSetp: 1,
      balance: new BigNumber(0),
    };
  },
  computed: {
    curTokenInfo() {
      return this.tokenInfos.find((t) => t.tokenId === this.curToken?.value);
    },
    tokenInfos() {
      const tokenMap = this.$store.getters.allTokensMap || {};
      return (this.tokens || []).map((t) => {
        const tokenId = t.channels.find((c) => c.network === "VITE")?.tokenId;
        const token = tokenMap[tokenId];
        return { ...t, icon: token?.icon, tokenId };
      });
    },
    tokenList() {
      return this.tokenInfos.map((t) => {
        return {
          value: t.tokenId,
          label: t.token,
          icon: t.icon,
        };
      });
    },
    balanceMan() {
      const channel = this.getChannelInfo(this.networkPair.from);
      if (!channel) return 0;
      return bnUtils.toBasic(this.balance, channel.decimals);
    },
  },
  watch: {
    "networkPair.from": async function(val) {
      this.reGenErc20();
      this.resetBalance();
    },
    curToken: async function(val) {
      this.reGenErc20();
      this.resetBalance();
    },
  },
  methods: {
    async resetBalance() {
      this.balance = new BigNumber(0);
      const balance = await this.getBalance(this.networkPair.from);
      console.log("rrrrrfetch", balance);
      this.balance = balance;
    },
    async reGenErc20() {
      if (this.networkPair.from !== "ETH") return;
      const tokenAddress = this.getChannelInfo("ETH")?.erc20;
      if (!tokenAddress) {
        erc20Contract = null;
        return;
      }
      erc20Contract = new Contract(
        tokenAddress,
        _erc20Abi,
        new ethers.providers.Web3Provider(window.ethereum)
      );
      const balance = await this.getBalance(this.networkPair.from);
      console.log("token change", "balance", balance);
    },
    async getTokens() {
      return mockTokens;
      return fetch(
        "https://raw.githubusercontent.com/vitelabs/vite-asset-bridge/master/meta.json"
      ).then((data) => data.json());
    },
    async onNextClick() {
      const curNet = this.networkPair.from;
      if (!erc20Contract && curNet === "ETH") return;
      const toAddress = this.toAddress;
      const curChannel = this.getChannelInfo(curNet);
      const channelAddress = curChannel?.contract;
      const decimals = curChannel.decimals;
      const ammountMin = bnUtils.toMin(this.amount, decimals);
      if (!channelAddress) {
        return;
      }
      // await confirmBriTxDialog({});
      console.log(333333, channelAddress, toAddress, ammountMin);
      if (curNet === "ETH") {
        await erc20Contract.approve(channelAddress, ammountMin);
        const erc20hChannel= new Contract(
          channelAddress,
          _channelAbi,
          new ethers.providers.Web3Provider(window.ethereum)
        );
        await erc20hChannel.connect((new ethers.providers.Web3Provider(window.ethereum)).getSigner())
        await erc20hChannel.input(toAddress, ammountMin);
      } else if (curNet === "VITE") {
        await execWithValid(
          new ChannelVite({ address: channelAddress }).input(
            toAddress,
            ammountMin
          )
        );
      }
    },
    async getAddress(net) {
      console.log(9999999, this.$store.state.wallet.currHDAcc?.activeAddr);
      if (net === "VITE") return this.$store.state.wallet.currHDAcc?.activeAddr;
      if (net === "ETH") return window.ethereum?.selectedAddress;
    },
    getChannelInfo(net) {
      return this.curTokenInfo?.channels?.find(
        (channel) => channel.network === net
      );
    },
    async getBalance(net) {
      const address = await this.getAddress(net);
      const channel = this.getChannelInfo(this.networkPair.from);

      const tokenId = channel?.erc20 || channel?.tokenId;
      console.log(22222, address, tokenId);

      if (!address || !tokenId) return null;

      if (net === "VITE") {
        const balanceInfo = await viteClient.getBalanceInfo(address);
        const balance = balanceInfo.balance?.balanceInfoMap?.[tokenId]?.balance
          ? new BigNumber(
              balanceInfo.balance?.balanceInfoMap?.[tokenId]?.balance
            )
          : new BigNumber(0);
        return balance;
      }
      if (net === "ETH") {
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
      ethereum?.request({ method: "eth_requestAccounts" });
    },
    async autoFillMax() {},
    onSelected(v) {
      console.log(99999, v);
    },
  },
};
// parent weird animal coil sister damp tunnel cover stick plug ivory luggage
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "pcComponents/confirm/confirmRow.scss";
@import "~pc/styles/form.scss";

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
        width: 180px;
        font-size: 36px;
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
