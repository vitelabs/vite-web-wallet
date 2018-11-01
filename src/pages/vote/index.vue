<template>
    <div>
        <secTitle></secTitle>
        <section>
            <div class="title">{{$t('vote.section1.title')}}</div>
            <div class="tb">
                <div class="head"></div>
                <div class="row">
                    <div class="cell"></div>
                </div>
            </div>
        </section>
        <section>
            <div class="title">{{$t('vote.section2.title')}}</div>
        </section>
        <div class="tb">
            <div class="head"></div>
            <div class="row">
                <div class="cell"></div>
            </div>
        </div>
    </div>
</template>

<script>
const nodeStatus = {};
import secTitle from "components/secTitle";
export default {
  components: { secTitle },
  methods: {
    showHelp() {
      this.$confirm({
        title: this.$t("vote.help.title"),
        singleBtn: true,
        closeBtn: {
          show: false
        },
        leftBtn: {
          text: this.$t("btn.understand")
        },
        content: this.$t("vote.help.text")
      });
    }
  },
  computed: {
    content1() {
      this.$t("vote.section1.nodeStatus");
      this.$t("vote.section1.voteStatus");
      this.$t("vote.section1.operate");
      this.voteList.map(v => {
        const l = [];
        l.push();
      });
      return;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/table.scss";
.title {
  border-right: 2px solid rgba(0, 122, 255, 0.7);
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #1d2024;
  line-height: 32px;
}
</style>
