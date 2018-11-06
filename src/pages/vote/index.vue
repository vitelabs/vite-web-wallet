<template>
    <loading v-if="loadingToken" class="loading"></loading>
    <div class="vote" v-else>

        <secTitle></secTitle>

        <section class="vote_list">
            <div class="title">{{$t('vote.section1.title')}}</div>
            <div class="__tb">
                <div class="__tb_row __tb_head">
                    <div class="__tb_cell" v-for="v in $t('vote.section1.head')" :key="v"> {{v}}</div>
                </div>
                <div class="__tb_content">
                    <div class="__tb_row" v-for="v in voteList" :key="v.nodeName">
                        <div class="__tb_cell">{{v.nodeName}}</div>
                        <div class="__tb_cell">{{v.nodeStatusText}} <i v-if="v.nodeStatus==='cancelRegister'" class="tipsicon hoveraction">
                                <tooltips :content="$t('vote.section1.hoverHelp',{nodeName:v.nodeName})"></tooltips>
                            </i></div>
                        <div class="__tb_cell">{{v.voteNum}}</div>
                        <div class="__tb_cell">{{v.voteStatusText}}</div>
                        <div class="__tb_cell" :class="cache?'unclickable':'clickable'" @click="cancelVote(v)">{{v.operate}}</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="node_list">
            <div class="title">{{$t('vote.section2.title')}}<search v-model="filterKey" class="filter"></search>
            </div>

            <div class="__tb">
                <div class="__tb_row __tb_head">
                    <div class="__tb_cell" v-for="v in $t('vote.section2.head')" :key="v">{{v}}</div>
                </div>
                <div class="__tb_content">
                    <div class="__tb_row __tb_content_row" v-if="nodeList.length" v-for="v in nodeList" :key="v.nodeName">
                        <div class="__tb_cell">{{v.nodeName}}</div>
                        <div class="__tb_cell">{{v.nodeAddr}}</div>
                        <div class="__tb_cell">{{v.voteNum}}</div>
                        <div class="__tb_cell" :class="cache?'unclickable':'clickable'" @click="vote(v)">{{v.operate}}</div>
                    </div>
                    <div class="__tb_no_data" v-else-if="this.filterKey">{{$t("vote.section2.noSearchData")}}</div>
                    <div class="__tb_no_data" v-else>{{$t("vote.section2.noData")}}</div>
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
import { quotaConfirm } from "components/quota";
export default {
  components: { secTitle, tooltips, search, loading },
  beforeMount() {
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
    this.nodeDataTimer = new timer(this.updateNodeData, 75 * 1000);
  },
  data() {
    return {
      filterKey: "",
      nodeData: [],
      voteData: [],
      loadingToken: false,
      tokenInfo: null,
      cache: null,
      nodeDataTimer: null
    };
  },
  methods: {
    updateVoteData() {
      if (this.cache) {
        return Promise.resolve();
      }
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
      if (this.cache) {
        return Promise.resolve();
      }
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
      const activeAccount = this.$wallet.getActiveAccount();
      const successCancel = () => {
        activeAccount
          .sendTx(
            {
              tokenId: this.tokenInfo.tokenId,
              nodeName: this.voteList[0].nodeName
            },
            "cancelVoteBlock"
          )
          .then(d => {
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
          })
          .catch(e => {
            const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;
            if (code === -35002) {
              quotaConfirm({ operate: this.$t("vote.section1.operate") });
            }
          });
      };

      activeAccount.initPwd(
        {
          title: this.$t("vote.section1.confirm.title"),
          submitTxt: this.$t("vote.section1.confirm.submitText"),
          cancelTxt: this.$t("vote.section1.confirm.cancelText"),
          submit: successCancel
        },
        true
      );
    },
    vote(v) {
      const activeAccount = this.$wallet.getActiveAccount();
      const successVote = () => {
        activeAccount
          .sendTx(
            { nodeName: v.name, tokenId: this.tokenInfo.tokenId },
            "voteBlock"
          )
          .then(d => {
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
          })
          .catch(e => {
            const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;
            if (code === -35002) {
              quotaConfirm({ operate: this.$t("vote.section2.operate") });
            }
          });
      };
      const t = this.haveVote ? "cover" : "normal";
      activeAccount.initPwd(
        {
          title: this.$t(`vote.section2.confirm.${t}.title`),
          submitTxt: this.$t(`vote.section2.confirm.${t}.submitText`),
          cancelTxt: this.$t(`vote.section2.confirm.${t}.cancelText`),
          content: this.$t(`vote.section2.confirm.${t}.content`),
          submit: successVote
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
          this.cache.nodeStatus === 3 &&
          this.voteData[0] &&
          this.voteData[0].nodeName === this.cache.nodeName
        ) {
          //投票中且投票成功
          this.cache = null;
        }
        if (this.cache.nodeStatus === 4 && this.voteData.length === 0) {
          // 撤销中且撤销成功
          this.cache = null;
        }
        this.voteData[0] = Object.assign({}, this.cache); // 否则只展示缓存
      }
      this.voteData[0] &&
        this.voteData[0].nodeStatus === 2 &&
        (this.voteData[0].voteStatus = "voteNotWork"); // 取消注册情况下作废投票，优先级最高
      const voteList = this.voteData.map(v => {
        v.nodeStatusText = this.$t(`vote.section1.nodeStatusMap`)[v.nodeStatus];
        v.voteStatusText =
          this.$t(`vote.section1.voteStatusMap`)[v.voteStatus] || "注册中";
        v.voteNum = v.balance || 0; // tans
        v.operate = this.$t("vote.section1.operateBtn");
        return v;
      });
      return voteList;
    },
    nodeList() {
      return this.nodeData
        .map(v => {
          v.voteNum = v.voteNum || 0;
          v.operate = this.$t("vote.section2.operateBtn");
          return v;
        })
        .filter(v => {
          if (this.filterKey.trim() === "") {
            return true;
          }
          return (
            new RegExp(this.filterKey.trim(), "i").test(v.name) ||
            new RegExp(this.filterKey.trim(), "i").test(v.addr)
          );
        })
        .sort((a, b) => {
          return a.voteNum - b.voteNum;
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
  .vote_list {
    overflow-x: auto;
    overflow-y: hidden;
    margin: 40px 0;
    margin-bottom: 29px;
    .__tb_content {
      padding-bottom: 78px;
    }
  }
  .node_list {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }
  .__tb_cell {
    min-width: 150px;
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
        > div {
          display: none;
          font-size: 14px;
          color: #3e4a59;
          line-height: 20px;
        }
        &:hover {
          > div {
            display: flex;
          }
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
