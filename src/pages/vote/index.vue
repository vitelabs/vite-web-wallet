<template>
    <loading v-if="loadingToken" class="loading"></loading>
    <div class="vote" v-else>
        <powProcess ref="pow"></powProcess>
        <secTitle></secTitle>

        <section class="vote_list">
            <div class="title">{{$t('vote.section1.title')}}</div>

            <div class="__tb">
                <div class="__tb_row __tb_head">
                    <div class="__tb_cell" v-for="v in $t('vote.section1.head')" :key="v"> {{v}}</div>
                </div>
                    <div class="__tb_content">
                        <div class="__tb_row" v-for="v in voteList" :key="v.nodeName">
                            <div class="__tb_cell nodename">{{v.nodeName}}</div>
                            <div class="__tb_cell">{{v.nodeStatusText}} <i v-if="v.nodeStatus===2" class="tipsicon hoveraction" @click.self.stop="toggleTips">
                                    <tooltips v-if="isResisterTipsShow" v-click-outside @clickoutside="hideTips" class="unregister-tips" :content="$t('vote.section1.hoverHelp',{nodeName:v.nodeName})"></tooltips>
                                </i></div>
                            <div class="__tb_cell">{{v.voteNum}}</div>
                            <div class="__tb_cell">{{v.voteStatusText}}</div>
                            <div class="__tb_cell" :class="cache?'unclickable':'clickable'" @click="cancelVote(v)">{{v.operate}}</div>
                        </div>
                        <div class="__tb_row seat">
                        </div>
                    </div>
            </div>
        </section>

        <section class="node_list">
            <div class="title">{{$t('vote.section2.title')}}<search v-model="filterKey" class="filter"></search>
            </div>
            <div class="tb_container">
                <div class="__tb">
                    <div class="__tb_row __tb_head">
                        <div class="__tb_cell" v-for="v in $t('vote.section2.head')" :key="v">{{v}}</div>
                    </div>
                    <div class="__tb_content" v-if="!!nodeList.length">
                        <div class="__tb_row __tb_content_row" v-for="v in nodeList" :key="v.nodeName">
                            <div class="__tb_cell nodename">{{v.nodeName}}</div>
                            <div class="__tb_cell">{{v.nodeAddr}}</div>
                            <div class="__tb_cell">{{v.voteNum}}</div>
                            <div class="__tb_cell" :class="cache&&cache.nodeName===v.nodeName?'unclickable':'clickable'" @click="vote(v)">{{v.operate}}</div>
                        </div>
                    </div>
                    <div class="__tb_content" v-else-if="this.filterKey">
                        <div class="__tb_no_data">{{$t("vote.section2.noSearchData")}}</div>
                    </div>
                    <div class="__tb_content" v-else>
                        <div class="__tb_no_data">{{$t("vote.section2.noData")}}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import mockdata from "mock/vote";
import tooltips from "components/tooltips";
import search from "components/search";
import c from "config/constant";
import secTitle from "components/secTitle";
import pwdConfirm from "components/password";
import loading from "components/loading";
import { doUntill, timer } from "utils/asyncFlow";
import confirm from "components/confirm";
import powProcess from "components/powProcess";

export default {
  components: { secTitle, tooltips, search, loading, confirm, powProcess },
  beforeMount() {
    window.yzthis = this;
    this.tokenInfo = viteWallet.Ledger.getTokenInfo();
    if (!this.tokenInfo) {
      this.loadingToken = true;
      viteWallet.Ledger.fetchTokenInfo()
        .then(tokenInfo => {
          this.loadingToken = false;
          this.tokenInfo = tokenInfo;
        })
        .catch(err => {
          console.warn(err);
        });
    }
    this.updateVoteData();
    this.updateNodeData();
    this.nodeDataTimer = new timer(this.updateNodeData, 3 * 1000);
  },
  data() {
    return {
      filterKey: "",
      nodeData: [],
      voteData: [],
      loadingToken: false,
      tokenInfo: null,
      cache: null,
      nodeDataTimer: null,
      isResisterTipsShow: false
    };
  },
  methods: {
    hideTips() {
      this.isResisterTipsShow = false;
    },
    toggleTips() {
      this.isResisterTipsShow = !this.isResisterTipsShow;
    },
    updateVoteData() {
      return $ViteJS.Vite.vote_getVoteInfo(
        c.gid,
        this.$wallet.getActiveAccount().getDefaultAddr()
      ).then(data => {
        this.voteData = data.result ? [data.result] : [];
        this.voteData[0] && (this.voteData[0].voteStatus = "voted");
        return this.voteData;
      });
    },
    updateNodeData() {
      return $ViteJS.Vite.register_getCandidateList(c.gid).then(data => {
        this.nodeData =
          data.result.map(v => {
            return {
              ...v,
              nodeName: v.name
            };
          }) || [];
        return this.nodeData;
      });
    },
    cancelVote(v) {
      if (this.cache) {
        return;
      }
      const activeAccount = this.$wallet.getActiveAccount();
      const successCancel = d => {
        const t = Object.assign({}, v);
        t.isCache = true;
        t.voteStatus = "canceling"; // 撤销投票中
        this.cache = t;
        this.$toast(this.$t("vote.section1.toast"));
        doUntill({
          createPromise: this.updateVoteData,
          test: ({ resolve, reject }) => {
            return this.cache === null;
          }
        });
      };
      const failCancel = e => {
        const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;
        if (code === -35002) {
          const c = Object.assign({}, this.$t("vote.section1.quotaConfirm"));
          c.leftBtn.click = () => {
            this.$router.push({
              name: "quota"
            });
          };
          (c.rightBtn.click = () => {
            this.$refs.pow
              .startPowTx(
                {
                  tokenId: this.tokenInfo.tokenId,
                  nodeName: this.voteList[0].nodeName,
                  difficulty: "201564160"
                },
                "cancelVoteBlock"
              )
              .then(successCancel)
              .catch(failCancel);
          }),
            (c.closeBtn = { show: true });
          this.$confirm(c);
        } else {
          this.$toast(this.$t("vote.section1.cancelVoteErr"));
        }
      };
      const sendCancel = () => {
        activeAccount
          .sendTx(
            {
              tokenId: this.tokenInfo.tokenId,
              nodeName: this.voteList[0].nodeName
            },
            "cancelVoteBlock"
          )
          .then(successCancel)
          .catch(failCancel);
      };

      activeAccount.initPwd(
        {
          title: this.$t("vote.section1.confirm.title"),
          submitTxt: this.$t("vote.section1.confirm.submitText"),
          cancelTxt: this.$t("vote.section1.confirm.cancelText"),
          submit: sendCancel,
          exchange: true
        },
        true
      );
    },
    vote(v) {
      if (this.cache && this.cache.nodeName === v.nodeName) {
        return;
      }
      const activeAccount = this.$wallet.getActiveAccount();
      const successVote = d => {
        const t = Object.assign({}, v);
        t.isCache = true;
        t.voteStatus = "voting"; // 投票中
        t.nodeStatus = 1;
        this.cache = t;
        this.$toast(this.$t("vote.section2.toast"));
        doUntill({
          createPromise: this.updateVoteData,
          test: ({ resolve, reject }) => {
            return this.cache === null; // 直到缓存清空即停止轮询问。
          }
        });
      };
      const failVote = e => {
        const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;
        if (code === -35002) {
          const c = Object.assign({}, this.$t("vote.section2.quotaConfirm"));
          console.log(888, c);
          c.leftBtn.click = () => {
            this.$router.push({
              name: "quota"
            });
          };
          c.rightBtn.click = () => {
            this.$refs.pow
              .startPowTx(
                {
                  nodeName: v.name,
                  tokenId: this.tokenInfo.tokenId,
                  difficulty: "201564160"
                },
                "voteBlock"
              )
              .then(successVote)
              .catch(failVote);
          };
          c.closeBtn = { show: true };
          this.$confirm(c);
        } else if(code=-36001){
            this.$toast(this.$t('vote.addrNoExistErr'))
        }else {
          this.$toast(this.$t("vote.section2.voteErr"));
        }
      };
      const sendVote = () => {
        activeAccount
          .sendTx(
            { nodeName: v.name, tokenId: this.tokenInfo.tokenId },
            "voteBlock"
          )
          .then(successVote)
          .catch(failVote);
      };
      const t = this.haveVote ? "cover" : "normal";
      activeAccount.initPwd(
        {
          title: this.$t(`vote.section2.confirm.${t}.title`),
          submitTxt: this.$t(`vote.section2.confirm.${t}.submitText`),
          cancelTxt: this.$t(`vote.section2.confirm.${t}.cancelText`),
          content: this.$t(`vote.section2.confirm.${t}.content`, {
            nodeName: v.nodeName
          }),
          submit: sendVote,
          exchange: this.haveVote
        },
        true
      );
    }
  },
  computed: {
    haveVote() {
      return this.voteList[0] && this.voteList[0].voteStatus === "voted";
    },
    voteList() {
      if (this.cache) {
        // 缓存消费策略
        if (
          this.cache.voteStatus === "voting" &&
          this.voteData[0] &&
          this.voteData[0].nodeName === this.cache.nodeName
        ) {
          //投票中且投票成功
          this.cache = null;
        } else if (
          this.cache.voteStatus === "canceling" &&
          this.voteData.length === 0
        ) {
          // 撤销中且撤销成功
          this.cache = null;
        } else {
          this.voteData[0] = Object.assign({}, this.cache); // 否则只展示缓存
        }
      }
      let voteList = [];
      if (this.voteData.length > 0) {
        // 从nodeList更新voteList中节点状态；
        this.nodeList.some(v => {
          // todo anytime will be fasle?
          return v.nodeName === this.voteData[0].nodeName;
        }) || !this.voteData[0].isCache
          ? (this.voteData[0].nodeStatus = 1)
          : (this.voteData[0].nodeStatus = 2);
        // 取消注册情况下作废投票，优先级最高
        this.voteData[0].nodeStatus === 2 &&
          (this.voteData[0].voteStatus = "voteNotWork");
        //投票数目
        voteList = this.voteData.map(v => {
          v.nodeStatusText = this.$t("vote.section1.nodeStatusMap")[
            v.nodeStatus
          ];
          v.voteStatusText = this.$t("vote.section1.voteStatusMap")[
            v.voteStatus
          ];
          const token = viteWallet.Ledger.getTokenInfo();
          v.voteNum =
            viteWallet.BigNumber.toBasic(v.balance, token.decimals) || 0; // tans
          v.operate = this.$t("vote.section1.operateBtn");
          return v;
        });
      }
      return voteList;
    },
    nodeList() {
      const token = viteWallet.Ledger.getTokenInfo();
      return this.nodeData
        .map(v => {
          v.voteNum =
            viteWallet.BigNumber.toBasic(v.voteNum, token.decimals) || 0; // tans
          v.operate = this.$t("vote.section2.operateBtn");
          return v;
        })
        .filter(v => {
          if (this.filterKey.trim() === "") {
            return true;
          }
          return (
            new RegExp(this.filterKey.trim(), "i").test(v.nodeName) ||
            new RegExp(this.filterKey.trim(), "i").test(v.nodeAddr)
          );
        });
    }
  },
  beforeDestroy() {
    this.nodeDataTimer && this.nodeDataTimer.stop();
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/table.scss";
.vote {
  height: 100%;
  overflow: hidden;
  padding: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .filter {
    align-self: flex-end;
  }
  .title {
    display: flex;
    flex: none;
    justify-content: space-between;
    border-left: 2px solid rgba(0, 122, 255, 0.7);
    font-family: $font-bold;
    font-size: 18px;
    color: #1d2024;
    line-height: 40px;
    height: 40px;
    margin-bottom: 24px;
    padding-left: 10px;
  }
  .__tb{
      width: 100%;
  }
  .vote_list {
    overflow-x: auto;
    overflow-y: hidden;
    margin: 40px 0;
    margin-bottom: 29px;
    .__tb_row.seat{
        height: 78px;
    }
    .__tb_content {
      overflow: visible;
    }
  }
  .node_list {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    .tb_container {
      height: calc(100% - 64px);
      overflow: auto;
    }
  }
  .__tb_cell {
    min-width: 150px;
    &.nodename{
        overflow:hidden; 
        text-overflow:ellipsis;
        white-space:nowrap; 
        max-width: 180px;
        padding-right: 15px;
    }
    .hoveraction {
      &.tipsicon {
        position: relative;
        display: inline-block;
        background: url(~assets/imgs/hover_help.svg);
        overflow: visible;
        width: 16px;
        height: 16px;
        vertical-align: sub;
        cursor: pointer;
        .unregister-tips {
          width: 314px;
          height: 100px;
          padding: 10px;
          font-size: 14px;
          color: #3e4a59;
          line-height: 20px;
        }
      }
    }
  }
}
.clickable {
  color: #007aff;
  cursor: pointer;
}
.unclickable {
  color: #ced1d5;
}
</style>
