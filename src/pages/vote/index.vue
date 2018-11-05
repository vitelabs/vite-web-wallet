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
                    <div class="__tb_row" v-for="v in voteList" :key="v.name">
                        <div class="__tb_cell">{{v.name}}</div>
                        <div class="__tb_cell">{{v.nodeStatusText}} <i v-if="v.nodeStatus==='cancelRegister'" class="tipsicon hoveraction">
                                <tooltips :content="$t('vote.section1.hoverHelp')"></tooltips>
                            </i></div>
                        <div class="__tb_cell">{{v.voteNum}}</div>
                        <div class="__tb_cell">{{v.voteStatusText}}</div>
                        <div class="__tb_cell" :class="v.voteStatus==='voting'?'unclickable':'clickable'" @click="cancelVote(v)">{{v.operate}}</div>
                    </div>
                </div>
            </div>
        </section>

        <search v-model="filterKey" class="filter"></search>
        <section class="node_list">
            <div class="title">{{$t('vote.section2.title')}}</div>

            <div class="__tb">
                <div class="__tb_row __tb_head">
                    <div class="__tb_cell" v-for="v in $t('vote.section2.head')" :key="v">{{v}}</div>
                </div>
                <div class="__tb_content">
                    <div class="__tb_row __tb_content_row" v-for="v in nodeList" :key="v.name">
                        <div class="__tb_cell">{{v.name}}</div>
                        <div class="__tb_cell">{{v.nodeAddr}}</div>
                        <div class="__tb_cell">{{v.voteNum}}</div>
                        <div class="__tb_cell" :class="v.voteStatus==='voting'?'unclickable':'clickable'" @click="vote(v)">{{v.operate}}</div>
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
import { doUntill } from "utils/asyncFlow";
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
  },
  data() {
    return {
      filterKey: "",
      haveVote: "false",
      nodeData: [],
      voteData: [],
      loadingToken: false,
      tokenInfo: null,
      cache: null
    };
  },
  methods: {
    updateVoteData() {
      return $ViteJS.Vite.vote_getVoteInfo(
        c.gid,
        this.$wallet.getActiveAccount().getDefaultAddr()
      ).then(data => {
        this.voteData = data.result ? [data.result] : [];
        return this.voteData;
      });
    },
    updateNodeData() {
      return $ViteJS.Vite.register_getCandidateList(c.gid).then(data => {
        this.nodeData = data.result || [];
        return this.nodeData;
      });
    },
    cancelVote(v) {
      const activeAccount = this.$wallet.getActiveAccount();
      const successCancel = () => {
        activeAccount
          .sendTx({ tokenId: this.tokenInfo.tokenId }, "cancelVoteBlock")
          .then(d => {
            const t = Object.assign({}, v);
            t.isCache = true;
            t.voteStatus = 4; // 撤销投票中
            this.cache = t;
            doUntill(this.updateVoteData, ({ resolve, reject }) => {
              return this.cache === null;
            });
          });
      };
      activeAccount.initPwd(
        {
          title: this.$t("vote.section1.confirm.title"),
          submitTxt: this.$t("vote.section1.confirm.cancelText"),
          cancelTxt: this.$t("vote.section1.confirm.submitText"),
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
            t.voteStatus = 3; // 投票中
            this.cache = t;
            doUntill(this.updateVoteData, ({ resolve, reject }) => {
              return this.cache === null; // 直到缓存清空即停止轮询问。
            });
          });
      };
      const t = this.haveVote ? "cover" : "normal";
      activeAccount.initPwd(
        {
          title: this.$t(`vote.section2.confirm.${t}.title`),
          submitTxt: this.$t(`vote.section2.confirm.${t}.cancelText`),
          cancelTxt: this.$t(`vote.section2.confirm.${t}.submitText`),
          content: this.$t(`vote.section2.confirm.${t}.submitText`),
          submit: successVote
        },
        true
      );
    }
  },
  computed: {
    voteList() {
      const voteList = this.voteData.map(v => {
        v.nodeStatusText = this.$t(`vote.section1.nodeStatusMap`)[v.nodeStatus];
        v.voteStatusText = this.$t(`vote.section1.voteStatusMap`)[v.nodeStatus];
        v.voteNum = v.balance; // tans
        v.operate = "撤销";
        return v;
      });
      if (this.cache) {
        // 缓存消费策略
        if (
          this.cache.nodeStatus === 3 &&
          voteList[0] &&
          voteList[0].nodeName === this.cache.nodeName
        ) {
          //投票中且投票成功
          this.cache = null;
        }
        if (this.cache.nodeStatus === 4 && voteList.length === 0) {
          // 撤销中且撤销成功
          this.cache = null;
        }
        voteList[0] = Object.assign({}, this.cache); // 否则只展示缓存
      }
      return voteList;
    },
    nodeList() {
      return this.nodeData
        .map(v => {
          v.voteNum = v.voteNum || 0;
          v.operate = "投票";
          return v;
        })
        .filter(v => {
          if (this.filterKey.trim() === "") {
            return true;
          }
          return (
            new RegExp(this.filterKey, "i").test(v.name) ||
            new RegExp(this.filterKey, "i").test(v.addr)
          );
        });
    }
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
    border-left: 2px solid rgba(0, 122, 255, 0.7);
    font-family: $font-bold;
    font-size: 18px;
    color: #1d2024;
    line-height: 18px;
    height: 18px;
    margin-bottom: 28px;
    padding-left: 10px;
  }
  .vote_list {
    overflow-x: auto;
    overflow-y: hidden;
    margin: 40px 0;
    margin-bottom: 29px;
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
