<template>
    <div class="vote __wrapper">
        <secTitle></secTitle>

        <loading v-if="loadingToken" class="loading"></loading>

        <section v-if="!loadingToken" class="vote_list">
            <div class="title ct">{{ $t('walletVote.section1.title')}}</div>
            <div class="__tb">
                <div class="__tb_row __tb_head">
                    <div class="__tb_cell" v-for="v in $t('walletVote.section1.head')" :key="v"> {{v}}</div>
                </div>
                <div class="__tb_content">
                    <div class="__tb_row" v-for="v in voteList" :key="v.nodeName">
                        <div class="__tb_cell nodename">{{v.nodeName}}</div>
                        <div class="__tb_cell">
                            {{v.nodeStatusText}}
                            <i v-if="v.nodeStatus===2" class="tipsicon hoveraction" @click.self.stop="toggleTips">
                                <tooltips v-if="isResisterTipsShow" v-click-outside="hideTips" class="unregister-tips" :content="$t('walletVote.section1.hoverHelp',{nodeName:v.nodeName})"></tooltips>
                            </i>
                        </div>
                        <div class="__tb_cell">{{v.voteNum}}</div>
                        <div class="__tb_cell">{{v.voteStatusText}}</div>
                        <div class="__tb_cell" :class="cache ? 'unclickable' : 'clickable'">
                            <span v-unlock-account @unlocked="cancelVote(v)">{{ v.operate }}</span>
                            <span class="reward" @click="openReward(v)">{{ $t('walletVote.toReward') }}</span>
                        </div>
                    </div>
                    <div class="__tb_no_data">{{ voteList.length ? '' : $t('hint.noData') }}</div>
                </div>
            </div>
        </section>

        <section v-if="!loadingToken" class="node_list">
            <div class="title">
                <div class="ct">{{ $t('walletVote.section2.title') }}</div>
                <search v-model="filterKey" :placeholder="$t('walletVote.search')" class="filter"></search>
            </div>
            <div class="tb_container">
                <div class="__tb">
                    <div class="__tb_row __tb_head">
                        <div class="__tb_cell" v-for="v in $t('walletVote.section2.head')" :key="v">{{v}}</div>
                    </div>
                    <div class="__tb_content" v-if="!!nodeList.length">
                        <div class="__tb_row __tb_content_row active"
                             v-for="(v,i) in nodeList" :key="v.nodeName">
                            <div class="__tb_cell rank">{{i+1}}</div>
                            <div @click="goToNodeDetail(v.nodeName)" class="__tb_cell nodename clickable">{{v.nodeName}}</div>
                            <div @click="goToDetail(v.nodeAddr)" class="__tb_cell clickable">{{v.nodeAddr}}</div>
                            <div class="__tb_cell">{{v.voteNum}}</div>
                            <div class="__tb_cell clickable" v-unlock-account @unlocked="vote(v)">{{v.operate}}</div>
                        </div>
                    </div>
                    <div class="__tb_content" v-else-if="this.filterKey">
                        <div class="__tb_no_data">{{$t("walletVote.section2.noSearchData")}}</div>
                    </div>
                    <div class="__tb_content" v-else>
                        <div class="__tb_no_data">{{$t("hint.noData")}}</div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';
import tooltips from 'components/tooltips';
import search from 'components/search';
import secTitle from 'components/secTitle';
import loading from 'components/loading';
import confirm from 'components/confirm';
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import $ViteJS from 'utils/viteClient';
import sendTx from 'utils/sendTx';

const VoteDifficulty = '201564160';

export default {
    components: { secTitle, tooltips, search, loading, confirm },
    beforeMount() {
        this.tokenInfo = this.$store.getters.viteTokenInfo;

        if (!this.tokenInfo) {
            this.loadingToken = true;
            this.$store.dispatch('fetchTokenInfo').then(tokenInfo => {
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
        cleanCache() {
            this.cache = null;
        },
        hideTips() {
            this.isResisterTipsShow = false;
        },
        toggleTips() {
            this.isResisterTipsShow = !this.isResisterTipsShow;
        },
        updateVoteData() {
            return $ViteJS.vote.getVoteInfo(constant.Snapshot_Gid, this.$wallet.getActiveAccount().getDefaultAddr()).then(result => {
                this.voteData = result ? [result] : [];
                this.voteData[0] && (this.voteData[0].voteStatus = 'voted');

                return this.voteData;
            });
        },
        updateNodeData() {
            return $ViteJS.register.getCandidateList(constant.Snapshot_Gid).then(result => {
                this.nodeData = result.map(v => {
                    return {
                        ...v,
                        nodeName: v.name
                    };
                }) || [];

                return this.nodeData;
            });
        },
        goToNodeDetail(nodeName) {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${ process.env.viteNet }${ locale }SBPDetail/${ nodeName }`);
        },
        goToDetail(addr) {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${ process.env.viteNet }${ locale }account/${ addr }`);
        },
        openReward() {
            if (this.cache) {
                return;
            }
            const activeAccount = this.$wallet.getActiveAccount();
            const locale = this.$i18n.locale === 'zh' ? 'zh' : 'en';
            window.open(`https://reward.vite.net?language=${ locale }&address=${ activeAccount.getDefaultAddr() }`);
        },
        cancelVote(v) {
            if (this.cache) {
                return;
            }

            let activeAccount = this.$wallet.getActiveAccount();

            const successCancel = () => {
                const t = Object.assign({}, v);
                t.isCache = true;
                // 撤销投票中
                t.voteStatus = 'canceling';
                this.cache = t;
                this.$toast(this.$t('hint.request', { name: this.$t('walletVote.section1.revoke') }));
            };

            const failCancel = e => {
                this.$toast(this.$t('walletVote.section1.cancelVoteErr'), e);
            };

            const sendCancel = () => {
                activeAccount = this.$wallet.getActiveAccount();

                sendTx(activeAccount.revokeVoting, { tokenId: this.tokenInfo.tokenId }, {
                    pow: true,
                    powConfig: { difficulty: VoteDifficulty }
                }).then(successCancel).catch(failCancel);
            };

            activeAccount.initPwd({
                title: this.$t('walletVote.revokeVoting'),
                submitTxt: this.$t('walletVote.section1.confirm.submitText'),
                cancelTxt: this.$t('walletVote.section1.confirm.cancelText'),
                submit: sendCancel
            }, true);
        },
        vote(v) {
            let activeAccount = this.$wallet.getActiveAccount();

            const successVote = () => {
                const t = Object.assign({}, v);
                t.isCache = true;
                // 投票中
                t.voteStatus = 'voting';
                t.nodeStatus = 1;
                this.cache = t;
                this.$toast(this.$t('hint.request', { name: this.$t('walletVote.voting') }));
            };

            const failVote = e => {
                console.warn(e);
                const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;

                if (code === -36001) {
                    this.$toast(this.$t('walletVote.addrNoExistErr'));
                    return;
                }

                this.$toast(this.$t('walletVote.section2.voteErr'), e);
            };

            const sendVote = () => {
                activeAccount = this.$wallet.getActiveAccount();

                sendTx(activeAccount.voting, {
                    nodeName: v.name,
                    tokenId: this.tokenInfo.tokenId
                }, {
                    pow: true,
                    powConfig: {
                        isShowCancel: false,
                        difficulty: VoteDifficulty
                    }
                }).then(successVote).catch(failVote);
            };

            const t = this.haveVote ? 'cover' : 'normal';

            activeAccount.initPwd({
                title: this.$t('walletVote.voting'),
                submitTxt: this.$t(`walletVote.section2.confirm.${ t }.submitText`),
                cancelTxt: this.$t(`walletVote.section2.confirm.${ t }.cancelText`),
                content: this.$t(`walletVote.section2.confirm.${ t }.content`, {
                    nodeName: this.voteList[0] && this.voteList[0].nodeName,
                    name: v.name
                }),
                submit: sendVote,
                exchange: this.haveVote
            }, true);
        }
    },
    computed: {
        balance() {
            const tokenList = [].concat(this.$store.getters.tokenBalanceList);
            for (const tokenId in this.$store.state.ledger.defaultTokenIds) {
                if (!this.$store.state.ledger.tokenInfoMaps[tokenId] && !tokenList[tokenId]) {
                    break;
                }

                const token = this.$store.state.ledger.tokenInfoMaps[tokenId] || tokenList[tokenId];
                const defaultToken = this.$store.state.ledger.defaultTokenIds[tokenId];
                const symbol = token.tokenSymbol || defaultToken.tokenSymbol;

                tokenList[tokenId] = tokenList[tokenId] || {
                    balance: '0',
                    fundFloat: '0',
                    symbol,
                    decimals: '0'
                };
                tokenList[tokenId].icon = defaultToken.icon;
            }

            const token = tokenList[this.tokenInfo.tokenId] || {};
            return token.balance || 0;
        },
        haveVote() {
            return (
                this.voteList[0]
                && (this.voteList[0].voteStatus === 'voting'
                    || this.voteList[0].voteStatus === 'voted')
            );
        },
        voteList() {
            const c = voteRecord => {
                const data = Object.assign({}, voteRecord);

                // Update nodestatus from nodelist or voteNum from balance
                this.nodeList.some(v => v.nodeName === data.nodeName)
                    ? (data.nodeStatus = 1)
                    : (data.nodeStatus = 2);

                // VoteNotWork first
                if (this.voteData[0] && this.voteData[0].nodeName === data.nodeName) {
                    data.nodeStatus = this.voteData[0].nodeStatus;
                }
                data.nodeStatus === 2 && (data.voteStatus = 'voteNotWork');
                data.nodeStatusText = this.$t('walletVote.section1.nodeStatusMap')[data.nodeStatus];
                data.voteStatusText = this.$t('walletVote.section1.voteStatusMap')[data.voteStatus];
                const token = this.$store.getters.viteTokenInfo;
                // Tans
                data.voteNum = BigNumber.toBasic(data.balance, token.decimals) || this.balance || 0;
                data.operate = this.$t('walletVote.section1.operateBtn');

                return data;
            };

            if (this.cache) {
                // Update cache
                if (this.cache.voteStatus === 'voting'
                    && this.voteData[0]
                    && this.voteData[0].nodeName === this.cache.nodeName
                ) {
                    // Voting and voting success
                    this.cleanCache();
                } else if (this.cache.voteStatus === 'canceling'
                    && this.voteData.length === 0
                ) {
                    // Cancel and cancel success
                    this.cleanCache();
                }
            }

            if (this.cache) {
                return [c(this.cache)];
            } else if (this.voteData[0]) {
                return [c(this.voteData[0])];
            }

            return [];
        },
        nodeList() {
            const token = this.$store.getters.viteTokenInfo;

            return this.nodeData.map(v => {
                // Tans
                v.voteNum = BigNumber.toBasic(v.voteNum, token.decimals) || 0;
                v.operate = this.$t('walletVote.section2.operateBtn');
                return v;
            }).filter(v => {
                if (this.filterKey.trim() === '') {
                    return true;
                }

                return new RegExp(this.filterKey.trim(), 'i').test(v.nodeName)
                        || new RegExp(this.filterKey.trim(), 'i').test(v.nodeAddr);
            });
        }
    },
    beforeDestroy() {
        this.nodeDataTimer && this.nodeDataTimer.stop();
        this.voteDataTimer && this.voteDataTimer.stop();
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/table.scss";

.vote {
    height: 100%;
    overflow: auto;
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
        font-family: $font-bold, arial, sans-serif;
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
        min-height: 213px;

        .seat {
            height: 78px;
            text-align: center;
        }

        .__tb_content {
            overflow: visible;
        }
    }

    .node_list {
        min-height: 300px;
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
            text-overflow: hidden;
            margin: 0 5px;
            text-overflow: ellipsis;

            &:first-child {
                width: 5%;
                min-width: 30px;
            }

            &:nth-child(2) {
                width: 30%;
            }

            &:nth-child(3) {
                width: 40%;
                min-width: 450px;
            }

            &:nth-child(4) {
                width: 15%;
                min-width: 150px;
            }

            &:last-child {
                width: 5%;
                min-width: 50px;
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
