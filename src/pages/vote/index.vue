<template>
    <div class="vote">
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
                        <div class="__tb_cell">{{v.addr}}</div>
                        <div class="__tb_cell">{{v.voteNum}}</div>
                        <div class="__tb_cell" :class="v.voteStatus==='voting'?'unclickable':'clickable'" @click="vote(v)">{{v.operate}}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import mockdata from 'mock/vote';
import tooltips from 'components/tooltips';
import search from 'components/search';
const nodeList = mockdata.nodeList;
const voteList = mockdata.voteList;
import secTitle from 'components/secTitle';
export default {
    components: { secTitle, tooltips, search },
    data() {
        return {
            filterKey: ''
        };
    },
    methods: {
        // cancelVote(v) {

        // },
        // vote(v) {

        // }
    },
    computed: {
        voteList() {
            return voteList.map(v => {
                v.nodeStatusText = this.$t(
                    `vote.section1.nodeStatusMap.${v.nodeStatus}`
                );
                v.voteStatusText = this.$t(
                    `vote.section1.voteStatusMap.${v.voteStatus}`
                );
                v.operate = '撤销';
                return v;
            });
        },
        nodeList() {
            return nodeList.map(v => {
                v.operate = '投票';
                return v;
            }).filter(v => {
                if (this.filterKey.trim() === '') { return true; }
                return new RegExp(this.filterKey, 'i').test(v.name) || new RegExp(this.filterKey, 'i').test(v.addr);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
@import '~assets/scss/table.scss';
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
        flex:1;
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
