<template>
    <div class="vote __wrapper">
        <powProcess ref="pow"></powProcess>
        <secTitle></secTitle>

        <loading v-if="loadingToken" class="loading"></loading>

        <section v-if="!loadingToken" class="vote_list">
            <div class="title ct">{{ $t('vote.section1.title')}}</div>
            <div class="__tb">
                <div class="__tb_row __tb_head">
                    <div class="__tb_cell" v-for="v in $t('vote.section1.head')" :key="v"> {{v}}</div>
                </div>
                <div class="__tb_content">
                    <div class="__tb_row" v-for="v in voteList" :key="v.nodeName">
                        <div class="__tb_cell nodename">{{v.nodeName}}</div>
                        <div class="__tb_cell">
                            {{v.nodeStatusText}} 
                            <i v-if="v.nodeStatus===2" class="tipsicon hoveraction" @click.self.stop="toggleTips">
                                <tooltips v-if="isResisterTipsShow" v-click-outside="hideTips" class="unregister-tips" :content="$t('vote.section1.hoverHelp',{nodeName:v.nodeName})"></tooltips>
                            </i>
                        </div>
                        <div class="__tb_cell">{{v.voteNum}}</div>
                        <div class="__tb_cell">{{v.voteStatusText}}</div>
                        <div class="__tb_cell" :class="cache ? 'unclickable' : 'clickable'">
                            <span @click="cancelVote(v)">{{ v.operate }}</span>
                            <span class="reward" @click="openReward(v)">{{ $t('vote.toReward') }}</span>
                        </div>
                    </div>
                    <div class="__tb_no_data">{{ voteList.length ? '' : $t('hint.noData') }}</div>
                </div>
            </div>
        </section>

        <section v-if="!loadingToken" class="node_list">
            <div class="title">
                <div class="ct">{{ $t('vote.section2.title') }}</div>
                <search v-model="filterKey" :placeholder="$t('vote.search')" class="filter"></search>
            </div>
            <div class="tb_container">
                <div class="__tb">
                    <div class="__tb_row __tb_head">
                        <div class="__tb_cell" v-for="v in $t('vote.section2.head')" :key="v">{{v}}</div>
                    </div>
                    <div class="__tb_content" v-if="!!nodeList.length">
                        <div class="__tb_row __tb_content_row active" v-for="v in nodeList" :key="v.nodeName">
                            <div class="__tb_cell nodename">{{v.nodeName}}</div>
                            <div @click="goToDetail(v.nodeAddr)" class="__tb_cell clickable">{{v.nodeAddr}}</div>
                            <div class="__tb_cell">{{v.voteNum}}</div>
                            <div class="__tb_cell clickable" @click="vote(v)">{{v.operate}}</div>
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
import tooltips from 'components/tooltips';
import search from 'components/search';
import c from 'config/constant';
import secTitle from 'components/secTitle';
import loading from 'components/loading';
import { timer } from 'utils/asyncFlow';
import confirm from 'components/confirm';
import powProcess from 'components/powProcess';

export default {
    components: {
        secTitle, tooltips, search, loading, confirm, powProcess
    },
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
        this.$store.dispatch('getBalanceInfo', this.$wallet.getActiveAccount());
        this.updateVoteData();
        this.updateNodeData();
        this.nodeDataTimer = new timer(this.updateNodeData, 3 * 1000);
        this.nodeDataTimer.start();
        this.voteDataTimer = new timer(this.updateVoteData, 3 * 1000);
        this.voteDataTimer.start();
    },
    data() {
        return {
            filterKey: '',
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
                this.voteData[0] && (this.voteData[0].voteStatus = 'voted');
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
        goToDetail(addr) {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${process.env.viteNet}${locale}account/${addr}`);
        },
        openReward() {
            if (this.cache) {
                return;
            }
            const activeAccount = this.$wallet.getActiveAccount();
            let locale = this.$i18n.locale === 'zh' ? 'zh' : 'en';
            window.open(`https://reward.vite.net?language=${locale}&address=${activeAccount.getDefaultAddr()}`);
        },
        cancelVote(v) {
            if (this.cache) {
                return;
            }
            const activeAccount = this.$wallet.getActiveAccount();
            const successCancel = () => {
                const t = Object.assign({}, v);
                t.isCache = true;
                t.voteStatus = 'canceling'; // 撤销投票中
                this.cache = t;
                this.$toast(this.$t('vote.section1.toast'));
            };
            const failCancel = e => {
                const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;
                if (code === -35002) {
                    const c = Object.assign({}, this.$t('vote.section1.quotaConfirm'));
                    c.leftBtn.click = () => {
                        this.$router.push({
                            name: 'quota'
                        });
                    };
                    (c.rightBtn.click = () => {
                        this.$refs.pow
                            .startPowTx(
                                {
                                    tokenId: this.tokenInfo.tokenId,
                                    nodeName: this.voteList[0].nodeName,
                                    difficulty: '201564160'
                                },
                                'cancelVoteBlock'
                            )
                            .then(successCancel)
                            .catch(failCancel);
                    }),
                    (c.closeBtn = { show: true });
                    this.$confirm(c);
                } else {
                    this.$toast(this.$t('vote.section1.cancelVoteErr'), e);
                }
            };
            const sendCancel = () => {
                activeAccount
                    .sendTx(
                        {
                            tokenId: this.tokenInfo.tokenId,
                            nodeName: this.voteList[0].nodeName
                        },
                        'cancelVoteBlock'
                    )
                    .then(successCancel)
                    .catch(failCancel);
            };

            activeAccount.initPwd(
                {
                    title: this.$t('vote.section1.confirm.title'),
                    submitTxt: this.$t('vote.section1.confirm.submitText'),
                    cancelTxt: this.$t('vote.section1.confirm.cancelText'),
                    submit: sendCancel,
                    exchange: true
                },
                true
            );
        },
        vote(v) {
            const activeAccount = this.$wallet.getActiveAccount();
            const successVote = () => {
                const t = Object.assign({}, v);
                t.isCache = true;
                t.voteStatus = 'voting'; // 投票中
                t.nodeStatus = 1;
                this.cache = t;
                this.$toast(this.$t('vote.section2.toast'));
            };
            const failVote = e => {
                const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;
                if (code === -35002) {
                    const c = Object.assign({}, this.$t('vote.section2.quotaConfirm'));
                    c.leftBtn.click = () => {
                        this.$router.push({
                            name: 'quota'
                        });
                    };
                    c.rightBtn.click = () => {
                        this.$refs.pow
                            .startPowTx(
                                {
                                    nodeName: v.name,
                                    tokenId: this.tokenInfo.tokenId,
                                    difficulty: '201564160'
                                },
                                'voteBlock'
                            )
                            .then(successVote)
                            .catch(failVote);
                    };
                    c.closeBtn = { show: true };
                    this.$confirm(c);
                } else if (code === -36001) {
                    this.$toast(this.$t('vote.addrNoExistErr'));
                } else {
                    console.warn('vote', e);
                    this.$toast(this.$t('vote.section2.voteErr'), e);
                }
            };
            const sendVote = () => {
                activeAccount
                    .sendTx(
                        { nodeName: v.name, tokenId: this.tokenInfo.tokenId },
                        'voteBlock'
                    )
                    .then(successVote)
                    .catch(failVote);
            };
            const t = this.haveVote ? 'cover' : 'normal';
            activeAccount.initPwd(
                {
                    title: this.$t(`vote.section2.confirm.${t}.title`),
                    submitTxt: this.$t(`vote.section2.confirm.${t}.submitText`),
                    cancelTxt: this.$t(`vote.section2.confirm.${t}.cancelText`),
                    content: this.$t(`vote.section2.confirm.${t}.content`, {
                        nodeName: this.voteList[0] && this.voteList[0].nodeName,
                        name: v.name
                    }),
                    submit: sendVote,
                    exchange: this.haveVote
                },
                true
            );
        }
    },
    computed: {
        balance() {
            const token =
        this.$store.getters.tokenBalanceList[this.tokenInfo.tokenId] || {};
            return token.balance || 0;
        },
        haveVote() {
            return (
                this.voteList[0] &&
        (this.voteList[0].voteStatus === 'voting' ||
          this.voteList[0].voteStatus === 'voted')
            );
        },
        voteList() {
            const c = voteRecord => {
                const data=Object.assign({},voteRecord);
                // update nodestatus from nodelist or voteNum from balance
                this.nodeList.some(v => {
                    return v.nodeName === data.nodeName;
                })
                    ? (data.nodeStatus = 1)
                    : (data.nodeStatus = 2);
                // voteNotWork first
                this.voteData[0]&&this.voteData[0].nodeName===data.nodeName&&(data.nodeStatus=this.voteData[0].nodeStatus);
                data.nodeStatus === 2 && (data.voteStatus = 'voteNotWork');
                data.nodeStatusText = this.$t('vote.section1.nodeStatusMap')[
                    data.nodeStatus
                ];
                data.voteStatusText = this.$t('vote.section1.voteStatusMap')[
                    data.voteStatus
                ];
                const token = viteWallet.Ledger.getTokenInfo();
                data.voteNum =
          viteWallet.BigNumber.toBasic(data.balance, token.decimals) ||
          this.balance ||
          0; // tans
                data.operate = this.$t('vote.section1.operateBtn');
                return data;
            };
            if (this.cache) {
                // update cache
                if (
                    this.cache.voteStatus === 'voting' &&
          this.voteData[0] &&
          this.voteData[0].nodeName === this.cache.nodeName
                ) {
                    //投票中且投票成功
                    this.cache = null;
                } else if (
                    this.cache.voteStatus === 'canceling' &&
          this.voteData.length === 0
                ) {
                    // 撤销中且撤销成功
                    this.cache = null;
                }
            }
            if (this.cache) {
                return [c(this.cache)];
            } else if (this.voteData[0]) {
                return [c(this.voteData[0])];
            } else {
                return [];
            }
        },
        nodeList() {
            const token = viteWallet.Ledger.getTokenInfo();
            return this.nodeData
                .map(v => {
                    v.voteNum =
            viteWallet.BigNumber.toBasic(v.voteNum, token.decimals) || 0; // tans
                    v.operate = this.$t('vote.section2.operateBtn');
                    return v;
                })
                .filter(v => {
                    if (this.filterKey.trim() === '') {
                        return true;
                    }
                    return (
                        new RegExp(this.filterKey.trim(), 'i').test(v.nodeName) ||
            new RegExp(this.filterKey.trim(), 'i').test(v.nodeAddr)
                    );
                });
        }
    },
    beforeDestroy() {
        this.nodeDataTimer && this.nodeDataTimer.stop();
        this.voteDataTimer&&this.voteDataTimer.stop();
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
        margin-top: 10px;
    }

    .ct {
        border-left: 2px solid rgba(0, 122, 255, 0.7);
        padding-left: 10px;
        height: 18px;
        line-height: 18px;
        font-family: $font-bold;
        font-size: 18px;
        color: #1d2024;
    }
    .title {
        display: flex;
        flex: none;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 24px;
        .ct {
            margin-top: 20px;
        }
    }
    .__tb {
        width: 100%;
    }
    .vote_list {
        overflow-x: auto;
        overflow-y: hidden;
        margin: 40px 0;
        margin-bottom: 20px;

        .seat {
            height: 78px;
            text-align: center;
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
        .__tb_cell {
            min-width: 100px;
            &:first-child {
                width: 30%;
            }
            &:nth-child(2) {
                width: 40%;
            }
        }
    }
    .__tb_cell {
        min-width: 180px;
        .reward {
            margin-left: 10px;
        }
        &.nodename {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 150px;
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
                    word-break: break-all;
                    min-width: 314px;
                    min-height: 100px;
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

@media only screen and (max-width: 550px) {
    .vote {
        overflow: auto;
        padding: 15px;
        display: block;
    }
}
</style>
