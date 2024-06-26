<template>
    <div class="vote">
        <secTitle></secTitle>

        <loading v-if="loadingToken" class="loading"></loading>

        <section v-if="!loadingToken">
            <div class="__second-title no-top">{{ $t('walletVote.section1.title')}}</div>
            <wallet-table class="wallet-vote-table"
                          :headList="voteHeadList" :contentList="voteList">
                <span v-for="(v, i) in voteList" :key="i"
                      :slot="`${i}nodeStatusTextAfter`">
                    <i v-if="v.nodeStatus === 2" class="tipsicon hoveraction" @click.self.stop="toggleTips">
                        <tooltips v-if="isResisterTipsShow" v-click-outside="hideTips" class="unregister-tips" :content="$t('walletVote.section1.hoverHelp',{nodeName:v.nodeName})"></tooltips>
                    </i>
                </span>

                <span v-for="(v, i) in voteList" :key="i"
                      :slot="`${i}operateKeyBefore`" :class="cache ? 'unclickable' : 'clickable'">
                    <span class="operate-btn" @click="_cancelVote(v)">{{ v.operate }}</span>
                </span>
            </wallet-table>
        </section>

        <section v-if="!loadingToken" class="node_list">
            <div class="__second-title">
                <div class="title">{{ $t('walletVote.section2.title') }}</div>
                <search v-model="filterKey" :placeholder="$t('walletVote.search')"></search>
            </div>
            <wallet-table class="wallet-vote-table node-list"
                          :clickCell="clickCell" :noDataText="nodeNoDataText"
                          :headList="nodeHeadList" :contentList="nodeList">

                <span v-for="(item, i) in nodeList" :key="i"
                      :slot="`${i}rankBefore`" class="rank">{{ i+1 }}</span>

                <span v-for="(v, i) in nodeList" :key="i"
                      :slot="`${i}operateKeyBefore`"
                      @click="_vote(v)">
                    {{ v.operate }}
                </span>
            </wallet-table>
        </section>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';
import tooltips from '@components/tooltips.vue';
import search from '@components/search.vue';
import secTitle from '@pc/components/secTitle.vue';
import loading from '@components/loading.vue';
import walletTable from '@pc/components/table/index.vue';
import { initPwd } from '@pc/components/password/index.js';
import { timer } from '@utils/asyncFlow';
import BigNumber from '@utils/bigNumber';
import sendTx from '@pc/utils/sendTx';
import { execWithValid } from '@pc/utils/execWithValid';
import openUrl from '@utils/openUrl';
import statistics from '@utils/statistics';
import { getAccountLink, getSBPLink } from '@utils/getLink';
import { getCurrSBPNodeList, getVoteInfo } from '@services/viteServer';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { secTitle, tooltips, search, loading, walletTable },
    beforeMount() {
        this.nodeDataTimer = new timer(this.updateNodeData, 3 * 1000);
        this.nodeDataTimer.start();
        this.startVoteData();
    },
    beforeDestroy() {
        this.nodeDataTimer && this.nodeDataTimer.stop();
        this.voteDataTimer && this.voteDataTimer.stop();
    },
    data() {
        return {
            filterKey: '',
            nodeData: [],
            voteData: [],
            loadingToken: false,
            cache: null,
            nodeDataTimer: null,
            isResisterTipsShow: false
        };
    },
    computed: {
        balance() {
            const tokenList = [].concat(this.$store.getters.balanceInfo);
            for (const tokenId in this.$store.state.ledger.defaultTokenIds) {
                if (!this.$store.state.ledger.tokenInfoMaps[tokenId] && !tokenList[tokenId]) {
                    break;
                }

                const token = this.$store.state.ledger.tokenInfoMaps[tokenId] || tokenList[tokenId];
                const defaultToken = this.$store.state.ledger.defaultTokenIds[tokenId];
                const tokenSymbol = token.tokenSymbol || defaultToken.tokenSymbol;

                tokenList[tokenId] = tokenList[tokenId] || {
                    balance: '0',
                    fundFloat: '0',
                    tokenSymbol,
                    decimals: '0'
                };
                tokenList[tokenId].icon = defaultToken.icon;
            }

            const token = tokenList[Vite_Token_Info.tokenId] || {};
            return token.balance || 0;
        },
        haveVote() {
            return (
                this.voteList[0]
                && (this.voteList[0].voteStatus === 'voting'
                    || this.voteList[0].voteStatus === 'voted')
            );
        },
        voteHeadList() {
            const headList = [];
            const keyList = [ 'blockProducerName', 'nodeStatusText', 'voteNum', 'voteStatusText', 'operateKey' ];
            for (let i = 0; i < this.$t('walletVote.section1.head').length; i++) {
                headList.push({
                    text: this.$t('walletVote.section1.head')[i],
                    cell: keyList[i]
                });
            }
            return headList;
        },
        voteList() {
            const c = voteRecord => {
                const data = Object.assign({}, voteRecord);

                // Update nodestatus from nodelist or voteNum from balance
                this.nodeList.some(v => v.nodeName === data.sbpName)
                    ? (data.nodeStatus = 1)
                    : (data.nodeStatus = 2);

                // VoteNotWork first
                if (this.voteData[0] && this.voteData[0].sbpName === data.sbpName) {
                    data.nodeStatus = this.voteData[0].status;
                }

                data.nodeStatus === 2 && (data.voteStatus = 'voteNotWork');
                data.nodeStatusText = this.$t('walletVote.section1.nodeStatusMap')[data.nodeStatus];
                data.voteStatusText = this.$t('walletVote.section1.voteStatusMap')[data.voteStatus];

                // Tans
                data.voteNum = BigNumber.toBasic(data.votes, Vite_Token_Info.decimals) || this.balance || 0;
                data.operate = this.$t('walletVote.section1.operateBtn');

                return data;
            };

            if (this.cache) {
                // Update cache
                if (this.cache.voteStatus === 'voting'
                    && this.voteData[0]
                    && this.voteData[0].sbpName === this.cache.sbpName
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
        nodeHeadList() {
            const headList = [];
            const keyList = [ 'rank', 'nodeName', 'blockProducingAddress', 'voteNum', 'operateKey' ];
            const classList = [ '', 'clickable', 'clickable', '', 'clickable' ];
            for (let i = 0; i < this.$t('walletVote.section2.head').length; i++) {
                headList.push({
                    text: this.$t('walletVote.section2.head')[i],
                    cell: keyList[i],
                    cellClass: classList[i]
                });
            }
            return headList;
        },
        nodeList() {
            return this.nodeData.map(v => {
                // Tans
                v.voteNum = BigNumber.toBasic(v.votes, Vite_Token_Info.decimals) || 0;
                v.operate = this.$t('walletVote.section2.operateBtn');
                return v;
            }).filter(v => {
                if (this.filterKey.trim() === '') {
                    return true;
                }

                return new RegExp(this.filterKey.trim(), 'i').test(v.nodeName)
                        || new RegExp(this.filterKey.trim(), 'i').test(v.blockProducingAddress);
            });
        },
        nodeNoDataText() {
            return this.filterKey ? this.$t('walletVote.section2.noSearchData') : this.$t('hint.noData');
        },
        activeAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        activeAddr() {
            this.startVoteData();
        }
    },
    methods: {
        startVoteData() {
            this.voteDataTimer && this.voteDataTimer.stop();
            this.voteDataTimer = null;
            this.voteDataTimer = new timer(this.updateVoteData, 3 * 1000);
            this.voteDataTimer.start();
        },
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
            return getVoteInfo(this.activeAddr).then(result => {
                if (!result) {
                    this.voteData = [];
                    return null;
                }

                result.voteStatus = 'voted';
                result.sbpName = result.blockProducerName;
                this.voteData = [result];
                return this.voteData;
            });
        },
        updateNodeData() {
            return getCurrSBPNodeList().then(result => {
                this.nodeData = result.map(v => {
                    return {
                        ...v,
                        nodeName: v.sbpName
                    };
                }) || [];

                return this.nodeData;
            });
        },

        clickCell(cell, item) {
            if (cell === 'nodeName') {
                this.goToNodeDetail(item.nodeName);
                return;
            }

            if (cell === 'blockProducingAddress') {
                this.goToDetail(item.blockProducingAddress);
                return;
            }
        },
        goToNodeDetail(nodeName) {
            return openUrl(`${ getSBPLink(this.$i18n.locale, nodeName) }`);
        },
        goToDetail(addr) {
            return openUrl(`${ getAccountLink(this.$i18n.locale, addr) }`);
        },

        _cancelVote(v) {
            statistics.event(this.$route.name, 'vote_revoke', this.activeAddr || '');
            this.cancelVote(v);
        },
        cancelVote: execWithValid(function (v) {
            if (this.cache) {
                return;
            }

            const successCancel = () => {
                const t = Object.assign({}, v);
                t.blockProducerName = v.sbpName || v.nodeName;
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
                sendTx({ methodName: 'cancelSBPVoting', config: { pow: true } }).then(successCancel).catch(failCancel);
            };

            initPwd({
                title: this.$t('walletVote.revokeVoting'),
                submitTxt: this.$t('walletVote.section1.confirm.submitText'),
                cancelTxt: this.$t('walletVote.section1.confirm.cancelText'),
                submit: sendCancel
            }, true);
        }),
        _vote(v) {
            statistics.event(this.$route.name, 'vote_to', this.activeAddr || '');
            this.vote(v);
        },
        vote: execWithValid(function (v) {
            const successVote = () => {
                const t = Object.assign({}, v);
                t.blockProducerName = v.sbpName || v.nodeName;
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
                sendTx({
                    methodName: 'voteForSBP',
                    data: { sbpName: v.sbpName }
                }).then(successVote).catch(failVote);
            };

            const t = this.haveVote ? 'cover' : 'normal';

            initPwd({
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
        })
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
@use "@pc/assets/scss/common.scss" as *;

@include secondTitle();

.vote {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .__second-title {
        display: flex;
        flex: none;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 14px 0;
        &.no-top {
            margin-top: 0;
        }
        .title {
            line-height: 34px;
        }
        .ct {
            margin-top: 10px;
        }
    }

    .node_list {
        min-height: 300px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .wallet-vote-table {
            flex: 1;
        }
    }
}

.operate-btn {
    margin-right: 12px;
}
.clickable {
    // color: #00BEFF;
    @include primary_color();
    cursor: pointer;
}

.unclickable {
    color: #ced1d5;
}
</style>
